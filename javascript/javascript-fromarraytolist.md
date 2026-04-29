# JavaScript 実践 動的なリスト表示（配列→HTML）

## 課題：タスクリストを配列からHTML生成する

以下の配列を使って、HTMLページにリストを動的に表示してください。

```javascript
const tasks = [
  { id: 1, title: "牛乳を買う", done: false },
  { id: 2, title: "コードを書く", done: true },
  { id: 3, title: "散歩する", done: false },
];
```

### 要件

1. `tasks` 配列をループして、`<ul>` の中に `<li>` を生成する
2. `done: true` のタスクは文字に取り消し線（`text-decoration: line-through`）を表示する
3. 「追加」ボタン＋テキスト入力で、新しいタスクを配列に追加してリストを再描画できる
4. 各タスクに「削除」ボタンを付けて、クリックしたら配列から削除して再描画する

### ポイント（意識してほしいこと）

- `innerHTML` を使って再描画する「**まるごと再描画**」パターンで実装する
- リスト生成ロジックを `renderTasks()` という関数にまとめる
- 追加・削除のたびに `renderTasks()` を呼び出す設計にする

### ファイル構成

```
task-list/
  index.html   ← JS・CSSも同ファイルに書いてOK
```

---

## 実装メモ

### イベントの発火タイミング（reset, blur）

`taskInput` にフォーカスを当てた状態でリセットボタンをクリックすると、イベントは以下の順で発火する。

| 順序 | イベント | 何が起きるか |
|---|---|---|
| 1 | `taskInput` の `blur` | `validateNotEmpty` がエラーメッセージをセット |
| 2 | フォームの `reset` | エラーメッセージをクリア |

`reset` ハンドラのクリア処理は正しく動いているが、その直前に `blur` がエラーを書き込むため、一瞬だけエラーメッセージが表示されてしまう。

#### 解決策①：`event.relatedTarget` で移動先を確認する（Chrome / Firefox）

`blur` イベントの `relatedTarget` は「フォーカスが移った先の要素」を指す。  
リセットボタンをクリックした場合は `relatedTarget.type === "reset"` になるので、その場合はバリデーションをスキップする。

```javascript
taskInput.addEventListener("blur", (event) => {
  if (event.relatedTarget?.type === "reset") return;
  setSubmitEnabled(validateNotEmpty(taskInput, taskInputError));
});
```

#### ⚠️ macOS では `relatedTarget` が null になる

macOS ではボタンをクリックしてもそのボタンにフォーカスが当たらない仕様があるため、`event.relatedTarget` が `null` になる（OS の設定にも依存）。  
そのため `relatedTarget` チェックだけでは修正が効かない。

#### 解決策②：`mousedown` フラグで代替する（クロスブラウザ対応）

`mousedown` → `blur` → `reset` の順で発火することを利用し、`mousedown` 時点でフラグを立てる。

| イベント順 | 処理 |
|---|---|
| `mousedown`（リセットボタン、マウスボタンを押した瞬間） | `isResetClicking = true` にする |
| `blur`（taskInput） | フラグが `true` なら早期リターン |
| `reset`（フォーム） | エラーをクリア |
| `mouseup`（リセットボタン、マウスボタンを離した瞬間） | `isResetClicking = false` に戻す |

```javascript
let isResetClicking = false;
resetButton.addEventListener("mousedown", () => { isResetClicking = true; });
resetButton.addEventListener("mouseup", () => { isResetClicking = false; });

taskInput.addEventListener("blur", () => {
  if (isResetClicking) return;
  setSubmitEnabled(validateNotEmpty(taskInput, taskInputError));
});
```

- mousedown — マウスボタンを押した瞬間
- mouseup — マウスボタンを離した瞬間
- click — mousedown + mouseup が同じ要素で完結したとき（mouseup の直後に発火）

なので click は mousedown → mouseup → click の順になります。

今回の修正でフラグを mouseup で false に戻しているのは、クリックが途中でキャンセルされた場合（ボタンを押したまま別の場所でマウスを離すなど）にフラグが残り続けるのを防ぐためです。

---

## コードレビュー

### バグ・ロジックの問題

#### `input` イベントで `validateNotEmpty` が2回呼ばれている

```javascript
taskInput.addEventListener("input", () => {
  if (taskInputError.textContent !== "") {
    taskInputError.textContent = "";
    setSubmitEnabled(validateNotEmpty(taskInput, taskInputError)); // 1回目
  }
  setSubmitEnabled(validateNotEmpty(taskInput, taskInputError)); // 2回目（常に実行）
});
```

`if` ブロックの中と外の両方で呼んでいるため、エラーがある場合は2回実行される。`if` ブロック内の呼び出しを削除する。

```javascript
taskInput.addEventListener("input", () => {
  if (taskInputError.textContent !== "") {
    taskInputError.textContent = "";
  }
  setSubmitEnabled(validateNotEmpty(taskInput, taskInputError));
});
```

#### `validateNotEmpty` がエラー表示と判定を兼ねている（副作用）

```javascript
function validateNotEmpty(element, errorElement) {
  if (element.value.trim() === "") {
    errorElement.textContent = "タスクタイトルを入力してください"; // 副作用
    return false;
  }
  return true;
}
```

バリデーション結果（true/false）を返しながら、エラー表示という副作用も持っている。`input` イベントでは「エラーを消したいだけ」なのに `validateNotEmpty` を呼ぶとエラーが再セットされる可能性があり、将来的に混乱しやすい。

これを呼ぶ側は「エラーを表示させたくない場面でも、判定のためだけに呼ぶことができない」という問題が生じます。

- 判定だけしたい → でも呼ぶとエラーが表示される
- エラーを消したい → validateNotEmpty は消す機能を持っていない

---

### 改善提案

#### `reset` イベントで `tasks = []` が無意味

```javascript
tasks = []; // すぐ次の行で上書きされるため不要
tasks = [
  { id: 1, title: "牛乳を買う", done: false },
  ...
];
```

初期データを定数として外に切り出すとすっきりする。

```javascript
const initialTasks = [
  { id: 1, title: "牛乳を買う", done: false },
  { id: 2, title: "コードを書く", done: true },
  { id: 3, title: "散歩する", done: false },
];
let tasks = [...initialTasks];

// reset イベント内
tasks = [...initialTasks];
```

#### `toggleTaskDone` で元のオブジェクトを直接書き換えている

```javascript
tasks = tasks.map((task) => {
  task.id === id && (task.done = !task.done); // task オブジェクト自体を変更している
  return task;
});
```

`map` で新しい配列を作っているのに、中身のオブジェクトは同じ参照。イミュータブルな書き方に統一するとよい。

```javascript
tasks = tasks.map((task) =>
  // スプレッド構文で、オブジェクトをコピーしながら、一部を上書き
  task.id === id ? { ...task, done: !task.done } : task
);
```

---

### 良い点

- `renderTasks` が状態を受け取って描画するだけの純粋な関数になっている
- `addTask` / `removeTask` / `toggleTaskDone` それぞれで `renderTasks` を呼ぶ設計が一貫している
- JSDoc の型注釈がついていて読みやすい
- `mousedown` フラグで macOS の `relatedTarget` 問題に対処できている

---

### 優先度まとめ

| 優先度 | 内容 |
|---|---|
| 高 | `input` イベントで `validateNotEmpty` の二重呼び出しを削除 |
| 中 | `initialTasks` を定数に切り出す |
| 中 | `toggleTaskDone` をイミュータブルな書き方に変える |
| 低 | `validateNotEmpty` の副作用を分離する（リファクタ） |
