# 課題：コンポーネントの分割（props の受け渡し）

**目標：** コンポーネントを役割ごとに分割し、親から子へ `props` でデータを渡す/受け取る方法を理解する

---

## 準備

`study-app/react-practice/src/components/` に新しいコンポーネントファイルを作成：

```
Study02Props.tsx
```

`App.tsx` から一時的に読み込んで、ブラウザで表示を確認しながら進める。

---

## 前提知識

| ルール | 内容 |
|---|---|
| コンポーネントは関数 | 先頭大文字の関数が JSX を返せば、それが1つのコンポーネントになる |
| props は「引数」 | 親から子へ渡すデータは、関数の引数として1つのオブジェクトで渡される |
| props は読み取り専用 | 子コンポーネントの中で props を書き換えてはいけない |
| props の型は TypeScript で定義する | `type Props = { ... }` を定義し、関数の引数に付ける |

---

## やること

### ① 最小のコンポーネントを作り、親から呼び出す

```tsx
// 引数なしのコンポーネントを定義する
// function Greeting() {
//   return <p>こんにちは</p>;
// }

// 親コンポーネント（Study02Props）の中で <Greeting /> として呼び出す

// ポイント：コンポーネントは「関数」であり、JSXの中では <関数名 /> の形で呼び出される
```

### ② props を渡す・受け取る

```tsx
// props の型を定義する
// type GreetingProps = {
//   name: string;
// };

// 型を引数に付けて受け取る
// function Greeting({ name }: GreetingProps) {
//   return <p>こんにちは、{name} さん</p>;
// }

// 呼び出し側で属性のように値を渡す
// <Greeting name="Alice" />
// <Greeting name="Bob" />

// 同じコンポーネントを props だけ変えて複数回呼び出してみる
// → 何が起きるか（描画される内容がどう変わるか）確認する

// 表示が即座に変わり、コンソールでは hot updated として、/components/Study02Props.tsx と index.css が呼び出される
```

### ③ props の分割代入をしない書き方と比較する

```tsx
// 分割代入せずに props オブジェクトのまま受け取る
// function Greeting(props: GreetingProps) {
//   return <p>こんにちは、{props.name} さん</p>;
// }

// ② の分割代入した書き方と比較して、
// → どちらが読みやすいか、props が増えたときどちらが書きやすいか考える

// prop がつかない分、分割代入の方が読みやすく書きやすい
```

### ④ 複数の props を渡す

```tsx
// name, age の2つの props を持つ型を定義する
// type ProfileProps = {
//   name: string;
//   age: number;
// };

// function Profile({ name, age }: ProfileProps) {
//   return <p>{name}（{age}歳）</p>;
// }

// <Profile name="Alice" age={20} />
// 文字列以外の値（数値）を渡すときは {} で囲む必要があることに注意する
// → なぜ age="20" ではなく age={20} と書くのか説明できるか

// {}の中は JavaScript の記述であり、{}に入れると20はstringではなくnumberと認識されるから
```

### ⑤ children props

```tsx
// 子要素をそのまま受け取れる特別な props「children」を使う
// type CardProps = {
//   children: React.ReactNode;
// };

// function Card({ children }: CardProps) {
//   return <div className="card">{children}</div>;
// }

// 呼び出し側でタグの間に要素を書く
// <Card>
//   <p>カードの中身</p>
// </Card>

// name や age のような props と、children はどう違うか
// → 呼び出し方（属性 vs タグの中身）の違いに注目する

// props は呼び出し側で属性に値を入れて呼び出す
// children は呼び出し側でタグの中身を入れて呼び出す
```

### ⑥ 省略可能な props（optional props）

```tsx
// ? を付けて省略可能にする
// type BadgeProps = {
//   label: string;
//   color?: string; // 省略可能
// };

// function Badge({ label, color }: BadgeProps) {
//   return <span style={{ color: color ?? "black" }}>{label}</span>;
// }

// color を渡した場合と渡さなかった場合で表示を比較する
// <Badge label="NEW" />
// <Badge label="SALE" color="red" />

// ?? （Nullish coalescing）を使う理由は？
// → || ではなく ?? を使うべき場面はどんなときか考える

// ?? （Nullish coalescing）を使う理由は？ ?? は、null や undefined の場合、右辺を返すので、props が指定されなかった場合のデフォルト値を設定するため
// `??` は、左辺が null や undefined の場合、右辺を返す
// `||` は、左辺が 偽値 の場合、右辺を返す
```

### ⑦ コンポーネントを分割する判断基準

```tsx
// 1つの大きなコンポーネントに全部書いた場合と、
// 役割ごとに分割した場合を比較する

// 例：ユーザーカード（アイコン・名前・自己紹介）を
// UserCard 1つにまとめて書いてみる
// → 次に UserIcon / UserName / UserBio に分割してみる

// 分割する基準はどこにあるか
// （見た目の単位で分ける？ 再利用する予定があるか？ props の数が増えすぎたか？）
// 再利用する予定がある場合
// 小さな単位で分けるとかえって煩雑
```

---

## 確認ポイント

**props とは何か、どうやって渡す？**

親コンポーネントから子コンポーネントへ渡すデータ。関数の引数 props として1つのオブジェクトで渡される

**props を分割代入で受け取るメリットは？**

props のキーが増えた際、記述がシンプルになる

**`children` props が他の props と違う点は？**

子要素をそのまま受け取れる

**props を省略可能にするにはどう書く？また `??` と `||` の違いは？**

```tsx
type Props = {
  value1: string;
  value2?: number; // 省略可能な書き方
}
```

`??` は、左辺が null や undefined の場合、右辺を返す

`||` は、左辺が 偽値 の場合、右辺を返す

**コンポーネントを分割すべきタイミングの判断基準は？**

再利用する予定がある場合