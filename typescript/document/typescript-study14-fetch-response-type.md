# 課題：fetch レスポンスに型をつける（APIレスポンスの型定義）

**目標：** `fetch()` のレスポンスが `any` になる問題を理解し、APIレスポンスに正確な型をつける方法を身につける

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study14-fetch-response-type.ts
```

使用するAPI（無料・登録不要）：

```
https://jsonplaceholder.typicode.com/users/1
```

---

## 前提知識

| メソッド | 戻り値の型 | 問題点 |
|---|---|---|
| `fetch(url)` | `Promise<Response>` | レスポンスの中身の型は不明 |
| `response.json()` | `Promise<any>` | `any` なので型チェックが効かない |
| `response.json() as T` | `Promise<T>` | 型アサーションで型をつけられるが安全ではない |

`fetch` → `response.json()` の流れで、TypeScript は中身の型を自動では知ることができない。
なぜなら HTTP レスポンスは外部からくるデータで、コンパイル時に形がわからないため。

---

## やること

### ① `response.json()` が `any` になることを確認する

```ts
// async 関数 fetchUser を書く
// https://jsonplaceholder.typicode.com/users/1 を fetch する
// response.json() の戻り値を変数に入れる
// → その変数にカーソルを当てたとき、型は何と表示されるか？

// ポイント：TypeScript は外部からのデータの型を知らない
// → any になる = 型チェックが働かない
```

### ② APIレスポンスの型を定義する

```ts
// https://jsonplaceholder.typicode.com/users/1 を実際にブラウザで開いて
// 返ってくる JSON の形を確認する

// 確認できたら、その形に合わせて type を定義する
// 全フィールドを書く必要はない。使いたいフィールドだけでよい
// 例：id / name / email / username の4つを対象にする

type User = {
  // ここに書く
};
```

**なぜ全フィールドを書かなくていいのか**

TypeScript の型は「最低限この形であればよい」という意味。実際のデータに余分なフィールドがあっても型エラーにならない。必要なものだけ定義するのが実務のスタンス。

### ③ 型アサーション（`as`）で型をつける

```ts
// response.json() の結果を User 型にアサーションする
// const data = (await response.json()) as User;

// data.name にアクセスして string と認識されることを確認する
// data.存在しないプロパティ にアクセスしたらエラーになることを確認する
```

**型アサーションの限界**

```ts
// 型アサーションは TypeScript に「信じてくれ」と伝えるだけ
// 実際のデータが型と一致しているかはチェックしない

// 試しに意図的に間違った型を書いてみる：
type WrongUser = { id: number; height: number }; // 実際のデータに height はない
const wrong = (await response.json()) as WrongUser;
console.log(wrong.height); // undefined になるが TypeScript はエラーにしない
// → コンパイルは通る、でも実行時は undefined
```

### ④ ジェネリクスを使った fetch ラッパーを作る

```ts
// 型アサーションを毎回書くのは冗長なので、ラッパー関数を作る

// fetchJson<T>(url: string): Promise<T> という関数を書く
// 内部で fetch → response.json() → as T を行う
// 呼び出し側では型引数で T を指定する

// 使い方のイメージ：
// const user = await fetchJson<User>("https://jsonplaceholder.typicode.com/users/1");
// → user は User 型として扱える
```

**なぜジェネリクスにするか**

`as User` を毎回書くと URL と型の対応が散在する。ラッパーに閉じ込めると「この URL からは User が返る」という意図が1か所にまとまる。

### ⑤ `unknown` を使った安全なパターンと比較する

```ts
// ④ の型アサーション版（危険）と、unknown を使う安全版を比べる

// 安全版：
// response.json() を unknown で受け取る
// typeof / in を使って必要なフィールドが存在するか確認する
// 確認が取れたら User として扱う

// 例：
async function safeFetchUser(url: string): Promise<User | null> {
  const data: unknown = await (await fetch(url)).json();

  // data が期待する形かチェックする
  // id / name / email / username を確認する
  // 問題なければ data as User を return する
  // チェックを通らなければ null を return する
}
```

**型アサーション vs unknown の使い分け**

| パターン | 安全性 | コード量 | 使う場面 |
|---|---|---|---|
| `as T` | 低（信頼前提） | 少ない | 自社APIで型定義済み、スキーマ管理されている |
| `unknown` + 手動チェック | 高 | 多い | 外部APIで信頼できない、学習目的 |
| Zod などのライブラリ | 高 | 中程度 | 実務（ほぼこれ一択） |

---

## 確認ポイント

**`response.json()` の戻り値がなぜ `any` なのか？**

HTTP レスポンスの中身はコンパイル時には不明。TypeScript はファイルの型情報しか見られないため、実行時にしかわからないデータには `any` を返す。`response.json()` は仕様として `Promise<any>` と定義されている

**型アサーション（`as T`）は何をしているか？**

「このデータは T 型だ、TypeScript はチェックしなくていい」と伝えるだけ。実際のデータが T と合っているかは検証しない。間違った型をつけてもコンパイルは通り、実行時に初めて壊れる

**ジェネリクスの型引数 `<T>` は型アサーションと何が違うか？**

型引数は「呼び出し側が型を指定できる汎用的な形にする」仕組みで、型アサーション自体は内部で同様に行われる。ジェネリクスは型アサーションを1か所に集約して再利用しやすくするためのパターン

**実務で外部APIのレスポンスに型をつけるときのベストプラクティスは？**

Zod などのバリデーションライブラリでスキーマを定義し、`parse()` でランタイム検証する。型アサーションだけでは実行時の型ずれを防げないため、外部データには必ずバリデーションを挟む
