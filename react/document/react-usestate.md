# 課題：useState で状態管理

**目標：** `useState` の基本的な使い方を理解し、コンポーネント内で状態を持ち、更新できるようになる

---

## 準備

`study-app/react-practice/src/components/` に新しいコンポーネントファイルを作成：

```
Study03UseState.tsx
```

`App.tsx` から一時的に読み込んで、ブラウザで表示を確認しながら進める。

---

## 前提知識

| ルール | 内容 |
|---|---|
| `useState` は配列を返す | `const [state, setState] = useState(初期値)` |
| state を直接書き換えない | `state = ...` ではなく必ず `setState(...)` を使う |
| `setState` を呼ぶと再レンダリングされる | state が変わるたびにコンポーネントの関数が再実行される |
| state の更新は非同期的にまとめられる | 呼んだ直後に古い値を参照しても更新後の値にはならない |

---

## やること

### ① 最小のカウンターを作る

```tsx
// const [count, setCount] = useState(0);

// <p>カウント: {count}</p>
// <button onClick={() => setCount(count + 1)}>+1</button>

// ボタンを押すたびに画面がどう変わるか確認する
// → setCount を呼ぶと何が起きて画面が更新されるのか説明できるか

// setCount を呼ぶと count の値に1が加算され count の値が変化するため、画面が更新される
```

### ② 直接更新 vs 関数型更新

```tsx
// 直接更新（現在の count を参照する）
// <button onClick={() => {
//   setCount(count + 1);
//   setCount(count + 1);
// }}>+2のつもり</button>

// 関数型更新（前の state を引数で受け取る）
// <button onClick={() => {
//   setCount((prev) => prev + 1);
//   setCount((prev) => prev + 1);
// }}>+2（関数型）</button>

// 2つのボタンを実際に押し比べて、count がいくつ増えるか確認する
// → なぜ結果が異なるのか（同じ関数呼び出し内で複数回 setState した場合の挙動）を考える

// 直接更新は1ずつ、関数型は意図した通り2ずつ加算される

// なぜか：同じイベントハンドラ内で呼ばれた setState は React によってバッチ処理（まとめて後で1回だけ処理する仕組み）され、イベントハンドラが終わったタイミングでまとめて1回だけ再レンダリング
// ハンドラの実行中は再レンダリングが起きない＝count という変数は書き換わらない

// 直接更新：setCount(count + 1) を2回呼んでも、どちらも同じ古い count を見て
// 同じ値（例: 1）を予約するだけなので、後勝ちで実質1回分しか反映されない

// 関数型更新：setCount(prev => prev + 1) は「値」ではなく「更新する手順（関数）」を渡している
// React はこれらをキューに積み、前の結果を次の関数の引数として順番に適用する
// 1回目: prev=0 → 1、2回目: prev=1（1回目の結果を引き継ぐ）→ 2 となり、正しく2回分積み上がる

// 補足：React 18以降は setTimeout の中や Promise.then の中で呼んだ setState も自動でバッチ処理されるようになりました（それ以前はイベントハンドラの中でしかバッチ処理されませんでした）。
```

### ③ 複数の state を扱う

```tsx
// state をそれぞれ個別に持つ場合
// const [name, setName] = useState("");
// const [age, setAge] = useState(0);

// state を1つのオブジェクトにまとめる場合
// const [profile, setProfile] = useState({ name: "", age: 0 });
// setProfile({ ...profile, name: "Alice" });

// 個別に持つ場合とオブジェクトにまとめる場合で、
// → 更新のしやすさ・コードの見通しにどんな違いがあるか考える

// 更新のしやすさ シンプルかつ安全に更新できる
// 個別に state を持てば setName("Alice"); // age には一切影響しない
// オブジェクトにまとめた場合、1つのプロパティだけ更新したくても必ずスプレッド構文が必要になる
// setProfile({ ...profile, name: "Alice" }); // ...profile を忘れると age が消える
// コードの見通し 一つのオブジェクトを追えば良い
```

### ④ オブジェクト・配列の state をイミュータブル（変更不能・不変）に更新する

```tsx
// 配列の state を用意する
// const [items, setItems] = useState<string[]>(["item1"]);

// NG例：直接 push してしまう（動いているように見えても壊れる書き方）
// items.push("item2");
// setItems(items);

// OK例：スプレッド構文で新しい配列を作る
// setItems([...items, "item2"]);

// なぜ push + setItems だと React が変化に気づかないことがあるのか
// → React がどうやって「値が変わった」と判定しているか考える

// - React は setState が呼ばれたとき、新しい値と古い値を Object.is（参照の同一性）で比較して「本当に変わったか」を判定する
// - items.push("item2") は既存の配列をその場で書き換える（＝新しい配列オブジェクトを作らない）
// - そのため setItems(items) は「更新前と全く同じ参照」を渡すことになり、React は Object.is(古いitems, 新しいitems) が true と判定して「変化なし」とみなし、再レンダリングをスキップすることがある
// - 一方 [...items, "item2"] は新しい配列オブジェクトを作るので、参照が変わり、Reactは正しく「変化した」と判定する

// 実際にブラウザで試してみてほしい挙動
// 今のコードで「直接push」ボタンを連打しても、<ul>の表示は変わらないはずです（見た目上は何も起きていないように見える）。ただし、その後に「+1」ボタン（別のstateを更新するボタン）を押すと、コンポーネント全体が再レンダリングされるため、その時点で items にこっそり積み上がっていた要素が急に画面にどっと表示されるという不自然な挙動が見られるはずです。これがまさに「Reactが気づかない」ことの実害で、①②のときと同じように実際にクリックして体感すると理解が深まります。

// 「直接push」を複数回押した後に上記の再レンダリングが起きると、items に "item2" が複数個入るため、key={item} が重複してReactの警告（duplicate key）がコンソールに出るはずです。これはJSXの課題でやった「keyの重要性」ともつながる良い実例です。
```

### ⑤ 初期値の遅延評価

```tsx
// 通常の初期化（毎回のレンダリングで実行されてしまう重い処理の例）
// const [value, setValue] = useState(heavyCalculation());

// 遅延初期化（初回レンダリング時にしか実行されない）
// const [value, setValue] = useState(() => heavyCalculation());

// function heavyCalculation() {
//   console.log("計算実行");
//   return 42;
// }

// 通常の書き方と関数を渡す書き方で、
// console.log がボタン操作のたびに出るかどうかを比較する
```

### ⑥ フォーム入力と state を連動させる（controlled input）

```tsx
// const [text, setText] = useState("");

// <input
//   value={text}
//   onChange={(e) => setText(e.target.value)}
// />
// <p>入力中の文字: {text}</p>

// value と onChange の両方を指定する理由は？
// → onChange を外した場合、input はどうなるか試してみる

// onChange を外した場合、input に値が入力できない

// なぜか：
// 通常のHTMLの <input> は、何も指定しなければ「今何が入力されているか」を
// DOM自身が内部で管理している。ユーザーがタイプすれば、DOMが勝手に表示を更新する。

// value={text} を付けると「表示内容は常に text というstateの値に一致させる」と
// Reactに約束したことになる（controlled input）。表示の主導権がDOMからReactに移る。

// ここで onChange がないと、ユーザーがキーを押してもDOMは表示を更新しようとするが、
// Reactは「表示は常に text でなければならない」と決めているため、
// 再レンダリングのたびに表示は強制的に元の text に引き戻される。
// text というstateが更新されない限り表示は変わらないので、
// 実質フリーズしたような入力欄になる（文字を打っても反映されない）。

// つまり value と onChange はセットで1つの仕組み：
// value    ：「表示内容はこのstateが正解です」と宣言する側
// onChange ：ユーザーの操作をそのstateに書き戻す唯一の手段
// この2つが揃って初めて「打った文字が画面に反映される」というループが成立する
```

### ⑦ 派生値を state にしない

```tsx
// 悪い例：count から計算できる値までstateにしてしまう
// const [count, setCount] = useState(0);
// const [isEven, setIsEven] = useState(true);
// setCount(count + 1);
// setIsEven((count + 1) % 2 === 0); // 更新し忘れるとズレるリスクがある

// 良い例：レンダリング時に毎回計算する（stateにしない）
// const [count, setCount] = useState(0);
// const isEven = count % 2 === 0;

// なぜ「計算で求められる値」を state にすべきではないのか考える

// 一言でいうと：参照元（正解となる情報）を1つにする、ということ。
// count が唯一の「正解」（Single Source of Truth）であり、isEven はそこから
// いつでも計算し直せるので、わざわざ2つ目の「正解」を作らない。

// isEven は count % 2 === 0 の計算だけで求まる「派生値」であり、それ自体に新しい情報はない。
// これを別の state として持つと、count と isEven という2つの「正解」を
// 自分の手で常に一致させ続けなければならなくなる。

// 問題1：同期忘れによる矛盾
// 例えば後から setCount(0) で「リセット」する機能を追加したとき、
// isEven を更新するのを忘れると、count は0（偶数）に戻ったのに
// isEven は前の値（false）のまま残り、画面に嘘の表示が残り続けるバグになる。

// 問題2：②で見たクロージャの罠と同じ落とし穴
// setIsEven((count + 1) % 2 === 0) のように count を使って計算しようとすると、
// 同じイベントハンドラ内では count がまだ更新されていない（②のバッチ処理の話）ため、
// 毎回 count + 1 と書き直す必要がありミスしやすい。

// 解決策：state にせず、レンダリング時に毎回計算する
// const isEven = count % 2 === 0; // ただの変数。stateではない
// こうすれば正解は count の1つだけになり、isEven は常にその時点の count から
// 自動的に正しく導かれるので、同期を忘れる余地自体がなくなる。
```

---

## 確認ポイント

**`setState` を呼ぶと何が起きる？**

state が更新され、再レンダリングが起きる

1. setState が呼ばれる → state の更新が予約される
2. Reactが再レンダリングを予約する
3. コンポーネントの関数が新しいstateの値で再実行される
4. 新しいJSXと前回のJSXを比較して、DOMの必要な部分だけ更新される

**同じイベントハンドラの中で `setCount(count + 1)` を2回呼んでも +2 にならないのはなぜ？**

setCount(count + 1) を2回呼んでも、どちらも同じ古い count を見て同じ値（例: 1）を予約するだけなので、後勝ちで実質1回分しか反映されない

**配列やオブジェクトの state を更新するとき、直接書き換えてはいけない理由は？**

既存の値をその場で書き換えると、setState に渡される値は更新前と同じ参照になり、React は Object.is（参照の同一性）で「変わったかどうか」を判定するため、setStateは呼ばれているのに「変化なし」と判定されて再レンダリングがスキップされる

setStateは呼んでいるが、渡した値の参照が変わっていないため React が変化に気づけない

**`useState(() => 初期値)` のように関数を渡す（遅延初期化）のはどんなときに使う？**

初期値の計算が重い処理のときに、無駄な再計算を避けるため、初回レンダリング時のみ関数を実行したいとき

**「計算で求められる値」を state にすべきではない理由は？**

ベースとなる参照元の値を一元化するため
