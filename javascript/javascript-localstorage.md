# JavaScript 実践 ローカルストレージへの読み書き

## 課題：メモを1件だけ保存・読み込みするページを作る

**ファイル**: `practice-localstorage.html` として1ファイルで完結させる。

### 要件

1. テキストエリアと「保存」ボタンがある
2. 「保存」を押すと `localStorage` にテキストを保存する
3. ページをリロードしても、前回保存した内容がテキストエリアに復元される
4. 「削除」ボタンを押すと保存データが消え、テキストエリアも空になる

```html
<!-- 完成イメージ（見た目はシンプルでOK） -->
<textarea id="memo"></textarea>
<button id="save">保存</button>
<button id="clear">削除</button>
<p id="status"></p>  <!-- 「保存しました」などのメッセージ表示用 -->
```

### 使うAPI（この3つだけ）

```js
localStorage.setItem('key', 'value')   // 保存
localStorage.getItem('key')            // 読み込み（なければ null）
localStorage.removeItem('key')         // 削除
```

### 確認ポイント

- [x] リロードして内容が復元されるか
- [x] DevTools の「Application」タブ → Storage → Local Storage で値が見えるか
- [x] 「削除」後にリロードしても何も復元されないか

---

## 課題2：try/catch でエラーハンドリングを加える

前の課題のコードに、`try/catch` を使った安全な読み書きを追加する。

### なぜ try/catch が必要か

`localStorage` は必ず成功するとは限らない。

- **容量オーバー**（`QuotaExceededError`）：ブラウザの保存上限（通常 5MB）を超えると `setItem` が例外を投げる
- **プライベートモード**：Safari のプライベートブラウジングでは `localStorage` 自体が使えないことがある
- **セキュリティ設定**：ブラウザの設定によってアクセスが禁止されている場合がある

`try/catch` なしだと、これらのケースでアプリ全体がクラッシュする。

### 要件

`crudLocalStorage.js` の `localStorage` を読み書きしている箇所を、すべて `try/catch` で囲む。

```js
// 保存
try {
  localStorage.setItem("memo", memo);
  statusMessage.textContent = "メモを保存しました";
} catch (error) {
  statusMessage.textContent = "保存に失敗しました（容量オーバーの可能性があります）";
  console.error(error);
}

// 読み込み・削除も同様に囲む
```

### 確認ポイント

- [x] `setItem` / `getItem` / `removeItem` の3箇所すべてに `try/catch` が入っているか
- [x] `catch` の中でユーザーにエラーを伝えるメッセージを表示しているか
- [x] `catch` の中で `console.error(error)` を使って開発者向けにもログを残しているか

---

## 課題3：複数件のメモを保存・表示する

1件だけだったメモを**複数件管理できる**ように拡張する。  
`localStorage` は文字列しか保存できないため、配列を `JSON.stringify` / `JSON.parse` で変換して扱う。

### なぜ JSON.stringify / JSON.parse が必要か

```js
// 配列をそのまま setItem に渡すと文字列に変換されて壊れる
localStorage.setItem("memos", ["メモ1", "メモ2"]);
localStorage.getItem("memos"); // → "[object Object]" になってしまう

// JSON.stringify で文字列化してから保存する
localStorage.setItem("memos", JSON.stringify(["メモ1", "メモ2"]));
localStorage.getItem("memos"); // → '["メモ1","メモ2"]' ← 正しく保存される

// 読み込むときは JSON.parse で配列に戻す
JSON.parse(localStorage.getItem("memos")); // → ["メモ1", "メモ2"]
```

### 要件

**ファイル**: `practice/memoList.js`（HTML は別途 `practice/memoList.html` を作る）

1. テキストエリアに入力して「追加」ボタンを押すと、メモが一覧に追加される
2. 追加されたメモは `localStorage` に配列として保存される
3. ページをリロードしても、保存済みのメモ一覧が復元される
4. 各メモに「削除」ボタンがあり、押すと該当メモだけ削除される
5. `setItem` / `getItem` はすべて `try/catch` で囲む（課題2の復習）

### 完成イメージ

```
[ テキストエリア              ] [追加]

- メモ1の内容  [削除]
- メモ2の内容  [削除]
- メモ3の内容  [削除]
```

### ヒント

```js
// 保存済みメモを読み込む（初回は null なので ?? [] で空配列にする）
const saved = localStorage.getItem("memos");
const memos = saved ? JSON.parse(saved) : [];

// メモを追加して保存
memos.push("新しいメモ");
localStorage.setItem("memos", JSON.stringify(memos));

// 特定のインデックスのメモを削除
memos.splice(index, 1);
localStorage.setItem("memos", JSON.stringify(memos));
```

### 確認ポイント

- [x] 複数件追加してリロードしても、すべて復元されるか
- [x] 個別削除後にリロードしても、削除したメモが復元されないか
- [x] DevTools の Local Storage で値が `["メモ1","メモ2"]` のような形式で保存されているか
- [x] `setItem` / `getItem` に `try/catch` が入っているか

---

### コードレビュー（localStorageMemoList.js）

#### 良い点

- 課題2でコメントアウトしていた早期リターンを `throw new Error` で実装できた
- 関数に役割を分けて責務が明確（save / add / delete / display）
- 全削除時に「削除するメモがありません」チェックを入れている
- `setItem` / `getItem` / `removeItem` すべてに `try/catch` が入っている

#### 改善ポイント

**1. `saveMemoToLocalStorage` の if/else が不要**

`getItem` が `null`（初回）と既存データがある場合で分岐しているが、`displayMemosFromLocalStorage` と同じパターンに統一できる。

```js
// before
const savedMemos = localStorage.getItem("memos");
if (savedMemos) {
  const memos = JSON.parse(savedMemos);
  memos.push(memo);
  localStorage.setItem("memos", JSON.stringify(memos));
} else {
  localStorage.setItem("memos", JSON.stringify([memo]));
}

// after
const saved = localStorage.getItem("memos");
const memos = saved ? JSON.parse(saved) : [];
memos.push(memo);
localStorage.setItem("memos", JSON.stringify(memos));
```

**2. `deleteMemoFromList` 関数が不要**

削除ボタンのクリック時、`index` を計算してDOMとストレージを別々に削除しているが、`listItem` を直接削除すれば `index` 計算も `deleteMemoFromList` 関数も不要になる。

```js
// before
deleteButton.addEventListener("click", () => {
  const index = Array.from(memoList.children).indexOf(listItem);
  deleteMemoFromLocalStorage(index);
  deleteMemoFromList(index);
});

// after
deleteButton.addEventListener("click", () => {
  const index = Array.from(memoList.children).indexOf(listItem);
  deleteMemoFromLocalStorage(index);
  listItem.remove(); // これだけでOK
});
```

**3. 全削除の二重チェック**

`memoList.children.length > 0` の確認が2箇所あるが、早期リターンで保証済みなので内側のチェックは不要。

```js
// before
if (memoList.children.length > 0) {
  while (memoList.firstChild) {
    memoList.removeChild(memoList.firstChild);
  }
}

// after（内側の if を削除するだけでOK）
while (memoList.firstChild) {
  memoList.removeChild(memoList.firstChild);
}
```

> `innerHTML = ""` でも同じ結果になるが、XSS のリスクを避けるため `innerHTML` を使わない判断は正しい。

---

### 補足：破壊的メソッド（splice）について

#### 破壊的メソッドとは

元の配列を直接変更するメソッド。`splice` / `push` / `pop` / `shift` などが該当する。

対して `filter` / `map` / `slice` は元の配列を変更せず、新しい配列を返す（非破壊的）。

#### 破壊的メソッドを避けるべき場面

元の配列を**他の場所でも参照している**場合、破壊的メソッドで変更すると意図しない副作用が起きる。

```js
// グローバルな配列を直接変更してしまうケース
const memos = ["メモ1", "メモ2", "メモ3"]; // 他でも参照されている

memos.splice(1, 1); // 元の配列が変わる → 他の参照箇所に影響
```

React の `useState` で「破壊的メソッドを使うな」と言われるのもこれが理由。

#### このコードで `splice` が問題ない理由

`memos` は `JSON.parse` で**毎回新しく生成されるローカル変数**なので、変更しても他に影響しない。

```js
const memos = JSON.parse(savedMemos); // 新しい配列。他から参照されていない
memos.splice(index, 1);              // 変更してもどこにも影響しない
localStorage.setItem("memos", JSON.stringify(memos)); // 即座に保存して終わり
```

#### 使い分けの基準

| 場面 | 推奨 |
|------|------|
| ローカル変数（使い捨て） | `splice` でOK |
| グローバル変数・共有状態 | `filter` で新しい配列を作る |
| React の state | `filter` 必須（直接変更禁止）|