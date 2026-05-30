# 課題：TypeScript を「体験」する

**目標：** TypeScript が JavaScript と何が違うのかを、動かして体感する

---

## 準備

`study-practice/typescript/code/` に以下のファイルを作成する：

```
01-what-is-ts.ts
```

---

## やること

次の3つのコードを `.ts` ファイルに書いて、`npx tsx` で実行する。

### ① 型アノテーションを書いてみる

```ts
// 引数と戻り値に型をつけた関数を1つ書いて、呼び出す
```

### ② TypeScript が怒るパターンを作る

```ts
// 文字列を受け取るはずの変数・引数に、数値を渡してみる
// → エラーメッセージを読んで、何と言っているか確認する
```

### ③ JavaScript では防げなかったミスを TypeScript で防ぐ

```ts
// 存在しないプロパティにアクセスしてみる（例: user.namee のタイポ）
// → JavaScript だと undefined になるが、TypeScript では？
```

---

## 確認ポイント

- `npx tsx` で実行したとき、①はどう動いたか
- ②③でエラーは出たか。エラーメッセージは読めたか
  - npx tsx はTypeScriptの型チェックをしないツールです。「型を無視してJavaScriptとして実行する」動きをします。なのでエラーで止まらず実行された。

- `npx tsx` 型チェックしない、実行する
- `npx tsc --noEmit` 型チェックする、実行しない
