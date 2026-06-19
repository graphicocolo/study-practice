// ① `readonly` の挙動を確認する
type Config = { apiUrl: string; timeout: number };
type ReadonlyConfig = Readonly<Config>; // 読み取り専用プロパティであるため、'timeout' に代入することはできません。
// type ReadonlyConfig = {
//   readonly apiUrl: string;
//   readonly timeout: number;
// }; // 読み取り専用プロパティであるため、'timeout' に代入することはできません。

const testConfig: ReadonlyConfig = { apiUrl: "https://example.com/api", timeout: 10 };
console.log(testConfig.timeout = 5);
// npx tsx study11-utility-types.ts では実行
// npx tsc --noEmit ではエラー

// ② `Partial<T>` の挙動を確認する
type User = { id: number; name: string; email: string; role: string };
type OptionalUser = Partial<User>;
// 以下 npx tsc --noEmit ではエラーなし
const nameOnlylUser: OptionalUser = { name: "Alice" }
const emailAndRoleOnlylUser: OptionalUser = { email: "test@example.com", role: "user" };
const emptyUser: OptionalUser = {};

const nameOnlylUserNotPartial: User = { name: "Alice" } // 型 '{ name: string; }' には 型 'User' からの次のプロパティがありません: id, email, role
const emailAndRoleOnlylUserNotPartial: User = { email: "test@example.com", role: "user" }; // 型 '{ email: string; role: string; }' には 型 'User' からの次のプロパティがありません: id, name
const emptyUserNotPartial: User = {}; // 型 '{}' には 型 'User' からの次のプロパティがありません: id, name, email, role

// ③ `Required<T>` で `Partial` を元に戻す
type DraftPost = { title?: string; body?: string; publishedAt?: Date };
type PublicPost = Required<DraftPost>;
const post: PublicPost = {
  title: "test post title",
  body: "test post body",
} // プロパティ 'publishedAt' は型 '{ title: string; body: string; }' にありませんが、型 'Required<DraftPost>' では必須です。

// ④ `Pick` と `Omit` を比較する
type Employee = {
  id: number
  name: string
  department: string
  salary: number
  ssn: string   // 社会保障番号（機密）
}
// 外部に公開していい型を2通りの方法で作る：
// パターンA：Pick で「残したいもの」を列挙する
//   → id / name / department だけ残す
// パターンB：Omit で「除きたいもの」を列挙する
//   → salary と ssn だけ除く

// 両方の結果が同じ形になることを確認する
type PublicEmployee = Pick<Employee, "id" | "name" | "department">;
type NotHavePrivateEmployee = Omit<Employee, "salary" | "ssn">;
const a: PublicEmployee = { id: 1, name: "Alice", department: "Dev" };
const b: NotHavePrivateEmployee = a; // 代入できればどちらも同じ形

// ⑤ `Record<K, V>` でマップ構造を作る
// type Lang = "ja" | "en" | "zh";
type Lang = "ja" | "en" | "zh" | "ko";
const languageSet: Record<Lang, string> = {
  ja: "Japan",
  en: "English",
  zh: "China"
} // プロパティ 'ko' は型 '{ ja: string; en: string; zh: string; }' にありませんが、型 'Record<Lang, string>' では必須です。

// ⑥ ユーティリティ型を組み合わせる
type Article = {
  id: number
  title: string
  body: string
  author: string
  createdAt: Date
  updatedAt: Date
}
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
type CreateArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;
type UpdateArticleInput = Partial<Pick<Article, "title" | "body">>; // 内側から読む：まず Pick それを Partial でオプションにする
type ArticleSummary = Omit<Article, "body">;