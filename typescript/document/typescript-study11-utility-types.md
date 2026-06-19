# TypeScript ユーティリティ型（Utility Types）

## 今日のゴール

- `readonly` / `Partial` / `Required` / `Pick` / `Omit` / `Record` を使い分けられる
- 既存の型を変形・再利用する発想が身につく

---

## ユーティリティ型とは

TypeScript が標準で用意している「型を加工するツール」。
`type` を一から書き直さずに、既存の型をベースに変形できる。

```ts
type User = { id: number; name: string; email: string };

// User の全プロパティを省略可能にした型が作れる
type PartialUser = Partial<User>;
// → { id?: number; name?: string; email?: string }
```

---

## 1. `readonly`

プロパティを**読み取り専用**にする。変更しようとするとコンパイルエラーになる。

```ts
type Point = { readonly x: number; readonly y: number };

const p: Point = { x: 10, y: 20 };
p.x = 99; // エラー：読み取り専用プロパティに代入できない
```

### 練習1

次の型を使って、変更不可な設定オブジェクトを定義してください。

```ts
type Config = {
  // TODO: apiUrl と timeout を readonly で定義する
};

const config: Config = { apiUrl: "https://api.example.com", timeout: 3000 };
// config.apiUrl = "other"; ← これがエラーになればOK
```

---

## 2. `Partial<T>`

型 `T` の全プロパティを**省略可能（optional）**にする。

```ts
type User = { id: number; name: string; email: string };
type PartialUser = Partial<User>;
// → { id?: number; name?: string; email?: string }
```

**よく使う場面：** 更新処理（全フィールドを送らなくていいケース）

### 練習2

次の関数の引数に `Partial` を使って、部分的な更新ができるようにしてください。

```ts
type Product = { id: number; name: string; price: number; stock: number };

// 更新したいフィールドだけ渡せる updateProduct 関数を書く
function updateProduct(id: number, updates: /* TODO */ ): Product {
  // 実装は省略してOK（型だけ考える）
  return { id, name: "dummy", price: 0, stock: 0, ...updates };
}

updateProduct(1, { price: 500 });          // priceだけ更新
updateProduct(2, { name: "新商品", stock: 10 }); // 2つ更新
```

---

## 3. `Required<T>`

型 `T` の全プロパティを**必須**にする（`Partial` の逆）。

```ts
type Config = { host?: string; port?: number };
type StrictConfig = Required<Config>;
// → { host: string; port: number }  ← ? が消える
```

### 練習3

次の型を `Required` で変換して、全フィールドが必須になることを確認してください。

```ts
type DraftPost = {
  title?: string;
  body?: string;
  publishedAt?: Date;
};

// DraftPost を全フィールド必須にした PublishedPost 型を作る
type PublishedPost = /* TODO */;

// これが型エラーにならなければOK
const post: PublishedPost = {
  title: "TypeScript 入門",
  body: "本文...",
  publishedAt: new Date(),
};
```

---

## 4. `Pick<T, K>`

型 `T` から**指定したプロパティだけ**を取り出す。

```ts
type User = { id: number; name: string; email: string; password: string };
type PublicUser = Pick<User, "id" | "name">;
// → { id: number; name: string }   ← password と email は消える
```

**よく使う場面：** 外部に返すデータからパスワードなどを除く

### 練習4

次の `Employee` 型から、表示用の型を `Pick` で作ってください。

```ts
type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;  // 非公開にしたい
  ssn: string;     // 非公開にしたい
};

// id / name / department だけ持つ型を Pick で作る
type PublicEmployee = /* TODO */;
```

---

## 5. `Omit<T, K>`

型 `T` から**指定したプロパティを除いた**型を作る（`Pick` の逆）。

```ts
type User = { id: number; name: string; email: string; password: string };
type SafeUser = Omit<User, "password">;
// → { id: number; name: string; email: string }
```

`Pick` と `Omit` の使い分け：
- 残したいプロパティが少ない → `Pick`
- 除きたいプロパティが少ない → `Omit`

### 練習5

練習4の `Employee` 型を今度は `Omit` で書き直してください。

```ts
// Omit を使って salary と ssn を除いた型を作る
type PublicEmployee2 = /* TODO */;
```

---

## 6. `Record<K, V>`

キーの型 `K`、値の型 `V` の**オブジェクト型**を作る。

```ts
type Role = "admin" | "editor" | "viewer";
type Permissions = Record<Role, boolean>;
// → { admin: boolean; editor: boolean; viewer: boolean }

const permissions: Permissions = {
  admin: true,
  editor: true,
  viewer: false,
};
```

**よく使う場面：** マップ・辞書構造を型安全に定義する

### 練習6

次の要件を `Record` で実装してください。

```ts
type Lang = "ja" | "en" | "zh";

// 各言語のラベルを持つオブジェクトの型を Record で定義する
const labels: /* TODO */ = {
  ja: "日本語",
  en: "English",
  zh: "中文",
};
```

---

## 総合練習

次のシナリオをユーティリティ型を使って実装してください。

```ts
type Article = {
  id: number;
  title: string;
  body: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
};

// 1. 新規作成用：id / createdAt / updatedAt は自動生成なので不要
type CreateArticleInput = /* TODO: Omit を使う */;

// 2. 更新用：title と body だけ変更可能（どちらも省略OK）
type UpdateArticleInput = /* TODO: Pick + Partial を組み合わせる */;

// 3. 一覧表示用：body は重いので除く
type ArticleSummary = /* TODO: Omit を使う */;
```

---

## まとめ

| ユーティリティ型 | 効果 |
|---|---|
| `readonly` | プロパティを読み取り専用にする |
| `Partial<T>` | 全プロパティを省略可能にする |
| `Required<T>` | 全プロパティを必須にする |
| `Pick<T, K>` | 指定プロパティだけ残す |
| `Omit<T, K>` | 指定プロパティだけ除く |
| `Record<K, V>` | キー・値の型を指定してオブジェクト型を作る |

---

## 次のステップ

`tsconfig.json` の基本設定（`strict` / `target` / `module`） → `typescript-study12-tsconfig.md`
