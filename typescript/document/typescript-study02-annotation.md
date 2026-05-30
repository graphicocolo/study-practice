# 課題：型アノテーションの基本型を使う

**目標：** `string` / `number` / `boolean` / `null` / `undefined` の5つを使いこなす

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
02-type-annotation.ts
```

---

## やること

### ① 変数に型アノテーションをつける

以下の5種類の変数を宣言して、それぞれ適切な値を代入する。

```ts
// string, number, boolean, null, undefined の変数をそれぞれ1つずつ宣言する
```

### ② 意図的に型ミスを起こす

`string` 型の変数に `number` を代入しようとするなど、型の違う値を代入してみる。  
`npx tsc --noEmit` でどんなエラーが出るか確認する。

### ③ null と undefined を使い分ける

```ts
// 「まだ値がない」状態を表す変数を2つ作る
// 1つは null を使い、もう1つは undefined を使う
// それぞれ console.log で出力する
```

- null → 開発者が意図的に「値なし」をセットする
- undefined → まだ値が決まっていない（宣言したけど代入していない状態）

```ts
let userId: null = null; // 「ログインしていない」を明示したい場合など
let userName: undefined; // 宣言だけして、後で代入する場合など
```

### ④ 関数の引数・戻り値に型をつける

前回の `greet` 関数をベースに、以下の関数を作る：

- 名前（`string`）と年齢（`number`）を受け取る
- `「〇〇さんは△△歳です」` という文字列を返す
- 戻り値の型も明示する

---

## 確認ポイント

- ④の戻り値の型を書かなかった場合、TypeScript はどう判断するか（型推論と比べてみる）
