# 課題：`Partial` / `Required` / `Pick` / `Omit` / `Record` / `readonly`

**目標：** TypeScript が標準提供するユーティリティ型を使って、既存の型を「加工・再利用」する発想を身につける

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study11-utility-types.ts
```

---

## 前提知識

ユーティリティ型とは「型を受け取って別の型を返す、TypeScript 標準のツール」。
一から書き直さず、既存の型をベースに変形できる。

| 型 | 効果 | よく使う場面 |
|---|---|---|
| `readonly` | プロパティを変更不可にする | 設定値・定数オブジェクト |
| `Partial<T>` | 全プロパティをオプション（`?`）にする | 更新リクエストの入力型 |
| `Required<T>` | 全プロパティを必須にする（`Partial` の逆） | バリデーション後の確定型 |
| `Pick<T, K>` | 指定したプロパティだけ残す | 外部公開・表示用の型 |
| `Omit<T, K>` | 指定したプロパティだけ除く | 機密フィールドの除去 |
| `Record<K, V>` | キーと値の型を指定してオブジェクト型を作る | 辞書・マップ構造 |

---

## やること

### ① `readonly` の挙動を確認する

```ts
// 以下の型を定義する
// type Config = { apiUrl: string; timeout: number }

// readonly をつけたバージョン ReadonlyConfig も定義する

// ReadonlyConfig のオブジェクトを作り、プロパティに再代入してみる
// → TypeScript はエラーを出すか？

// ポイント：readonly はあくまでコンパイル時の制約。
// JavaScript に変換されると readonly は消える（実行時には変更できてしまう）
```

**`readonly` と `const` の違い**

| | 対象 | 再代入 | ネストした値 |
|---|---|---|---|
| `const` | 変数 | 不可 | 変更できる |
| `readonly` | オブジェクトのプロパティ | 不可 | 変更できる |

どちらも「参照」を固定するだけで、オブジェクトの中身の変更（ミューテーション）は防げない。
中身ごと凍らせたいなら `Object.freeze()` または全プロパティを `readonly` にする。

---

### ② `Partial<T>` の挙動を確認する

```ts
// 以下のベース型を定義する
// type User = { id: number; name: string; email: string; role: string }

// Partial<User> 型の変数に、フィールドを一部だけ持つオブジェクトを代入してみる
// - name だけ持つ
// - email と role だけ持つ
// - 何も持たない（空オブジェクト）
// → どのパターンも型エラーなしで通るか確認する

// 次に User 型（Partial でないほう）で同じことを試す
// → 何が起きるか？
```

**`Partial` の典型的な使いどころ：更新処理の入力型**

```ts
// 更新 API はすべてのフィールドを送る必要はない
// → 変えたいフィールドだけ送れるように Partial を使う
function updateUser(id: number, updates: Partial<User>) {
  // updates.name だけ届くこともあるし、複数届くこともある
}
```

---

### ③ `Required<T>` で `Partial` を元に戻す

```ts
// 全フィールドがオプションの型を定義する
// type DraftPost = { title?: string; body?: string; publishedAt?: Date }

// Required<DraftPost> 型の変数を作り、フィールドを1つ省略してみる
// → TypeScript はエラーを出すか？

// ポイント：Required は Partial と逆の変換。
// 「下書き型 → 公開済み型」のような「確定後に全フィールドが揃う」場面で使う
```

---

### ④ `Pick` と `Omit` を比較する

```ts
// 以下の型を定義する
// type Employee = {
//   id: number
//   name: string
//   department: string
//   salary: number
//   ssn: string   // 社会保障番号（機密）
// }

// 外部に公開していい型を2通りの方法で作る：
// パターンA：Pick で「残したいもの」を列挙する
//   → id / name / department だけ残す
// パターンB：Omit で「除きたいもの」を列挙する
//   → salary と ssn だけ除く

// 両方の結果が同じ形になることを確認する
```

**Pick と Omit の使い分け**

| 状況 | 選ぶ型 |
|---|---|
| 残したいプロパティの数が少ない | `Pick` |
| 除きたいプロパティの数が少ない | `Omit` |
| 将来プロパティが増えたとき自動で含めたい | `Omit`（除外リストだけ管理すればいい） |

---

### ⑤ `Record<K, V>` でマップ構造を作る

```ts
// 以下の Union 型を定義する
// type Lang = "ja" | "en" | "zh"

// Record<Lang, string> 型の変数に各言語のラベルを代入する
// → ja / en / zh の3キーすべてが揃わないとエラーになることを確認する

// 次に、Lang に "ko" を追加してみる
// → Record を使った変数でどんなエラーが出るか？

// ポイント：Record のキーに Union 型を使うと、
// 「全パターンを書き漏らすとエラー」という網羅チェックになる
```

**`Record` vs インデックスシグネチャの違い**

```ts
// インデックスシグネチャ：キーの型だけ縛る（どんな文字列でもOK）
type A = { [key: string]: string };

// Record：キーに使える値を Union 型で限定できる
type B = Record<"ja" | "en", string>;
// → "ja" と "en" 以外のキーはエラーになる
```

---

### ⑥ ユーティリティ型を組み合わせる

```ts
// 以下のベース型を使う
// type Article = {
//   id: number
//   title: string
//   body: string
//   author: string
//   createdAt: Date
//   updatedAt: Date
// }

// 次の3つの型をユーティリティ型で作る：
//
// 1. CreateArticleInput
//    → id / createdAt / updatedAt はサーバー側が自動付与するので除く
//    （Omit を使う）
//
// 2. UpdateArticleInput
//    → title と body だけ変更可能で、どちらも省略OK
//    （Pick と Partial を組み合わせる）
//
// 3. ArticleSummary
//    → 一覧表示用なので body（本文）は除く
//    （Omit を使う）
```

**組み合わせのパターン**

```ts
// Pick してから Partial にする例：
type UpdateArticleInput = Partial<Pick<Article, "title" | "body">>;

// 内側から読む：
// Pick<Article, "title" | "body"> → title と body だけ持つ型
// Partial<...>                    → それをオプションにする
```

---

## 確認ポイント

**`Partial` と `Required` はどんな場面で使い分ける？**

`Partial` は「全部そろっていなくてもいい」入力（更新リクエストなど）に使う。`Required` は「全部そろっていないといけない」確定後のデータに使う。下書き→公開のような「状態の変化」を型で表すときに両方がセットで役立つ

**`Pick` と `Omit` のどちらを選ぶかの判断基準は？**

残したいプロパティが少ない → `Pick`、除きたいプロパティが少ない → `Omit`。また、ベース型にプロパティが増えたとき「新しいものを自動で含めたい」なら `Omit`（除外リストだけ管理すればいい）

**`Record<K, V>` と `{ [key: string]: V }` の違いは？**

インデックスシグネチャはキーに任意の文字列が来る。`Record` は Union 型をキーにすることで「この値だけ・全部書け」と強制できる。⑤で確認したように、`Record<"ja" | "en" | "zh", string>` は3キーすべて書かないとエラーになる

**ユーティリティ型は自分でも作れる？**

作れる。`Partial<T>` の中身を覗くと `{ [P in keyof T]?: T[P] }` と書いてある。これは Mapped Types（マップ型）と呼ばれる TypeScript の機能で、フェーズ3以降で出てくる
