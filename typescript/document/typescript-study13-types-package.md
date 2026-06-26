# 課題：外部ライブラリの型定義（`@types/xxx`）

**目標：** なぜ `@types/xxx` が必要なのかを理解し、型定義ファイル（`.d.ts`）の読み方と、ライブラリの型が「ある・ない」の見分け方を身につける

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study13-types-package.ts
```

また、このディレクトリに `tsconfig.json` がない場合は `tsc --init` で作成しておく。

---

## 前提知識

| 状況 | 何が起きるか |
|---|---|
| JavaScript ライブラリ（型定義なし） | `import` すると TypeScript がエラー or `any` 扱いになる |
| `@types/xxx` をインストール | 型定義が追加され、補完・型チェックが効くようになる |
| ライブラリ自身が型を持つ（bundled types） | `@types/xxx` は不要。そのまま使える |

`@types/xxx` は **DefinitelyTyped** というコミュニティリポジトリで管理されている。
ライブラリ本体には含まれていない「後付けの型定義」が `@types` パッケージとして公開されている。

---

## やること

### ① 型定義の「ある・なし」を npm で確認する

まず、ターミナルで以下を調べる（インストールはしない、確認だけ）：

```bash
# ライブラリの型定義パッケージを探す
npm info @types/lodash
npm info @types/express

# 以下はライブラリ自身が型を持つ（@types は不要）
npm info axios | grep types
npm info zod | grep types
```

```ts
// 調べてわかったことをコメントで書いてみる：

// lodash の型定義は？ → @types/lodash が存在する / しない
// 存在する
// express の型定義は？ → @types/express が存在する / しない
// 存在する
// axios の型定義は？ → axios 本体に含まれている / 別パッケージ
// 何も返ってこない
// zod の型定義は？ → zod 本体に含まれている / 別パッケージ
// keywords: typescript, schema, validation, type, inference

// axios と zod は、npm のパッケージページ（npmjs.com）で確認し、TypeScript icon, indicating that this package has built-in type declarations と記載あり
```

**ポイント：型定義の場所を確認する方法**

`package.json` の `"types"` または `"typings"` フィールドを持つライブラリは、自前で型を持っている。
npm のパッケージページ（npmjs.com）では、ライブラリ名の横に `TS` バッジが表示される。

### ② `@types` をインストールして違いを体感する

作業用ディレクトリで `@types/node` をインストールする（Node.js の型定義）：

```bash
npm install --save-dev @types/node
```

```ts
// インストール前後で以下を試す：

// Node.js の process オブジェクトにアクセスする
// console.log(process.env.PATH);
// → インストール前：process の型が unknown or エラー
// → インストール後：process の型が NodeJS.Process になり補完が効く

// __dirname を使う
// console.log(__dirname);
// → インストール前後でエラーが変わるか確認する
```

**`devDependencies` に入れる理由**

型定義はビルド・開発時だけ必要で、実行時（本番）には不要。
そのため `--save-dev`（`-D`）でインストールする。

| フラグ | 入る場所 | 本番に含まれるか |
|---|---|---|
| `--save`（デフォルト） | `dependencies` | 含まれる |
| `--save-dev` / `-D` | `devDependencies` | 含まれない |

### ③ `.d.ts` ファイルを読んでみる

`node_modules/@types/node/` を開いて、実際の型定義ファイルを見てみる：

```bash
# ファイル一覧を確認
ls node_modules/@types/node/

# process の型定義を一部見てみる
head -50 node_modules/@types/node/globals.d.ts
```

```ts
// .d.ts ファイルを読んで、以下を確認してコメントに書く：

// declare keyword が多用されている → それは何を意味するか？
// declareキーワードを使うことでTypeScriptに変数、関数、クラスなどがJavaScript内に「存在する」ことを伝えることができ、これを「アンビエント宣言」と呼ぶ

// interface と type が混在している → 何が interface で何が type か？
// interface で書かれているものはユーティリティ型が多い → 別の型を作成可能で拡張性あり。オブジェクトの「形（shape）」を表すものに使われる
// type で書かれているものはユニオン型が多い。ユニオンや交差型など、構造ではなく「型の演算」に使われる

// namespace が使われている → namespace とは何か？（調べてよい）
// namespaceキーワードを使うことで名前空間を定義し、名前空間を定義することで、型名の衝突を避けることができる
```

**`.d.ts` ファイルとは**

実装コード（`.js`）を持たず、型情報だけを宣言するファイル。
TypeScript コンパイラが「この関数はこういう型だ」と知るための設計図。

```ts
// .d.ts の基本構造（例）
declare function greet(name: string): string;
declare const VERSION: string;
declare interface User {
  id: number;
  name: string;
}
```

`declare` は「この名前はどこかで実装されている、型だけ宣言する」という意味。

### ④ bundled types のライブラリと @types の違いを比べる

```bash
# axios をインストール（bundled types を持つライブラリの例）
npm install axios
```

```ts
import axios from "axios";

// axios.get() にカーソルを当てて型情報を確認する
// → @types のインストールなしに型が効いているか？

// node_modules/axios/index.d.ts が存在するか確認する
// → ライブラリ本体に .d.ts が含まれているはず
```

```bash
# node_modules/axios/package.json の "types" フィールドを確認
cat node_modules/axios/package.json | grep '"types"'
```

```ts
// 確認してわかったこと：
// axios は package.json の "types" フィールドで型定義ファイルを指定している
// → TypeScript が自動的にそのファイルを読む
// → @types/axios は不要（存在しない）
```

### ⑤ 型定義がないライブラリへの対処：`declare module`

型定義が存在しないライブラリを使うとき、暫定的に自分で宣言する方法がある。

```ts
// study13-types-package.ts とは別に
// src/types/my-legacy-lib.d.ts という形で作るのが実務の慣習だが、
// ここでは同ファイル内で試す

// 架空のモジュール "my-legacy-lib" の型定義を自分で書く
declare module "my-legacy-lib" {
  // モジュールが export する関数・型を宣言する
  export function doSomething(value: string): number;
  export const version: string;
}

// これで import できるようになる（実際のファイルはなくてよい）
// import { doSomething } from "my-legacy-lib";
```

**実務での使いどころ**

| 状況 | 対処法 |
|---|---|
| `@types/xxx` がある | `npm install -D @types/xxx` |
| `@types/xxx` がなく、型定義を書く時間がある | `declare module` で最低限の型を書く |
| 急ぎで使いたい（型チェックを妥協する） | `// @ts-ignore` または `any` で一時回避（技術的負債） |

---

## 確認ポイント

**`@types/xxx` と `xxx` 本体の型の違いは何？**

`xxx` 本体が JavaScript で書かれている場合、型情報が含まれていない。`@types/xxx` はその型情報を別パッケージとして提供したもの。`xxx` 本体が TypeScript で書かれているか、`package.json` に `"types"` フィールドがある場合は `@types` 不要

**なぜ `--save-dev` でインストールするのか？**

型定義はコンパイル時（開発時）にだけ必要で、実行時の JavaScript には型情報が残らない。本番バンドルに含める必要がなく、`devDependencies` に置くことで本番の依存関係を軽くできる

**`.d.ts` ファイルの `declare` は何をしているか？**

「この名前の値・関数・クラスは実装ファイル（`.js`）の中に存在する、型だけをここで宣言する」という意味。TypeScript に「型は知っているが実装コードはここにない」と伝えるためのキーワード

**ライブラリに `@types` が必要かどうか調べる方法は？**

① npm のパッケージページで `TS` バッジを確認する、② `npm info @types/xxx` でパッケージが存在するか確認する、③ ライブラリの `package.json` に `"types"` または `"typings"` フィールドがあるか確認する
