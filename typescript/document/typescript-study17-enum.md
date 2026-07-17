# 課題：Enum の使い方と注意点

**目標：** Enum（列挙型）の基本的な書き方を理解し、Union 型リテラルとの使い分けを判断できるようになる

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study17-enum.ts
```

---

## 前提知識

| 種類 | 一言で言うと |
|---|---|
| 数値 Enum | 何も指定しないと 0 から自動採番される |
| 文字列 Enum | 各メンバーに文字列を明示的に割り当てる |
| const enum | コンパイル時にインライン展開され、実行時のコードが残らない |

---

## やること

### ① 数値 Enum の挙動を確認する

```ts
// 以下の Enum を定義する
// enum Direction { Up, Down, Left, Right }

// Direction.Up などをそれぞれ console.log してみる
// → 何が表示されるか？（数値になっていることを確認）

// 逆に Direction[0] のようにアクセスするとどうなるか？
// → これを「リバースマッピング」と呼ぶ

// ポイント：数値 Enum は「値 → 名前」の逆引きもできてしまう
```

### ② 数値 Enum の並び順に注意する

```ts
// 以下のように既存の Enum の途中にメンバーを追加する
// enum Direction { Up, Down, Left, Right }
// ↓
// enum Direction { Up, Center, Down, Left, Right }

// 追加前後で Direction.Down の値がどう変わるか確認する
// → 数値がずれることの何が危険か考える
// （例：この値を DB に保存していた場合どうなるか）
```

### ③ 文字列 Enum を書く

```ts
// 以下の文字列 Enum を定義する
// enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }

// Direction.Up を console.log してみる
// → 数値 Enum との違いは何か？

// Direction[0] のようにリバースマッピングを試す
// → 文字列 Enum ではどうなるか？
```

### ④ Enum を関数の引数に使う

```ts
// Direction を引数に取り、対応する移動量 { x: number, y: number } を返す
// 関数 move を書く（switch 文で分岐する）

// 網羅チェックとして default 節に
//   const _exhaustive: never = direction;
// を書けるか試す（study09 の never を思い出す）
```

### ⑤ Union 型リテラルで書き換える

```ts
// ①〜④ で書いた Direction を Enum ではなく
// type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
// として書き直す

// move 関数も型だけ書き換えて動かしてみる
// → コード量・使い勝手はどう変わるか？
```

### ⑥ const enum を試す

```ts
// ③ の Direction を const enum に変えて同じように使ってみる
// enum → const enum の違いをコンパイル後の .js（tsc の出力）で確認する
// → 通常の enum はオブジェクトとして出力されるが、const enum はどうなるか？
```

enum → const enum の違いをコンパイル後の .js（tsc の出力）で確認する方法

`code/` ディレクトリで `tsc` を直接叩いて、生成された `.js` を見る。

```bash
cd study-practice/typescript/code
npx tsc --project tsconfig.json --outDir /tmp/out
cat /tmp/out/study17-enum.js
```

1ファイルだけ見たい場合は `tsconfig.json` を無視するオプションを付ける：

```bash
npx tsc study17-enum.ts --module esnext --target esnext --ignoreConfig --outDir /tmp/out
```

**実際にやってみた結果**

このプロジェクトの `tsconfig.json` には `isolatedModules: true` が設定されている。この設定込みでコンパイルすると、`const enum` は**インライン展開されず、普通の enum と同じ実行時オブジェクトが出力された**：

```js
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    ...
})(Direction || (Direction = {}));
console.log(Direction.Up);
```

一方、`isolatedModules` を外して単体コンパイルすると、期待通りインライン展開された：

```js
console.log("UP" /* Direction.Up */); // UP が返る
```

`const enum` は本来「値をそのまま埋め込んで実行時コードを消す」機能だが、ファイル単位で独立してトランスパイルする設定（`isolatedModules: true`、Babel 単体変換など）では安全にインラインできないため、TypeScript は普通の enum にフォールバックする。

---

## 確認ポイント

**数値 Enum のリバースマッピングとは何？なぜ注意が必要？**

数値 Enum は `Direction[0]` のように値から名前も引ける。これは実行時に生成される追加コードで、メンバーの並びを変えると既存の値の意味がずれるリスクがある

**文字列 Enum が数値 Enum より安全とされる理由は？**

値が明示的な文字列なので、メンバーの追加・並び替えをしても既存メンバーの値が変わらない。ログや DB に保存された値を見ても意味がわかりやすい

**Enum と Union 型リテラルはどちらを使うべき？**

実務では Union 型リテラル（`"UP" | "DOWN"` など）が好まれる場面が多い。理由：Enum は実行時にオブジェクトを生成するコストがある、Union 型は型情報のみでコンパイル後に消える、tree-shaking と相性が良い。Enum が向くのは「値の集合に意味的なまとまりを持たせたい」「他言語との連携で Enum が自然」な場合

**const enum は何が違う？なぜ使われる場面が限られる？**

`const enum` はコンパイル時に値がそのままインライン展開され、実行時のオブジェクトが残らない（軽量）。ただし `isolatedModules` 環境（Babel 単体トランスパイルなど）でサポートされないことがあり、ライブラリ公開時には避けられる傾向がある
