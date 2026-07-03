# 課題：モジュールの型（`import` / `export` の型）

**目標：** `import type` / `export type` の意味と使い分けを理解し、型を安全にモジュール間で共有できるようになる

---

## 準備

`study-practice/typescript/code/` に新しいファイルを **3つ** 作成：

```
study15-types.ts       ← 型定義だけを置くファイル
study15-utils.ts       ← 関数を置くファイル
study15-main.ts        ← import して使うファイル
```

---

## 前提知識

TypeScript のモジュールには「値」と「型」の2種類がある。

| 種類 | 実態 | 例 |
|---|---|---|
| 値（value） | 実行時に存在する | 関数・変数・クラス |
| 型（type） | コンパイル後に消える | `type` / `interface` |

通常の `import` は値も型もまとめて取り込む。`import type` は **型だけ** を取り込む。

---

## やること

### ① 型定義ファイルを作る（`study15-types.ts`）

```ts
// ユーザー情報を表す型 User を定義して export する
// プロパティ：id（number）/ name（string）/ role（"admin" | "viewer"）

// API レスポンスの共通ラッパー型 ApiResponse<T> を定義して export する
// プロパティ：data（T）/ status（number）/ message（string）
```

**ポイント：** `type` で定義したものは JavaScript にコンパイルしても何も残らない。型定義ファイルはランタイムコストがゼロ。

---

### ② 関数ファイルを作る（`study15-utils.ts`）

```ts
// study15-types.ts から User を import する（通常の import）
// ユーザー一覧を受け取って role が "admin" のものだけを返す関数 filterAdmins を書く
// 引数の型・戻り値の型に User を使う

// study15-types.ts から ApiResponse を import する（通常の import）
// User[] を受け取って ApiResponse<User[]> を返す関数 wrapResponse を書く
// status は 200、message は "OK" で固定してよい
```

---

### ③ `import type` を使う（`study15-main.ts`）

```ts
// study15-types.ts から User を import type で取り込む
// study15-utils.ts から filterAdmins と wrapResponse を import する

// ダミーデータ users（User[] 型）を作る
// id: 1, name: "Alice", role: "admin"
// id: 2, name: "Bob",   role: "viewer"
// id: 3, name: "Carol", role: "admin"

// filterAdmins に渡して結果を console.log する
// wrapResponse に渡して結果を console.log する
```

コンパイルして動作確認：

```
// 「実行エラーがないか手軽に確認する」ためのコマンド
// 今の tsconfig.json は module: "nodenext" になっていて、そのまま型チェックすると .js 拡張子の要件や import type の強制が入ります。コマンドラインで --module commonjs を上書きすることで、拡張子なしの import が書けるシンプルな環境で確認できるようにしています。
npx tsc study15-main.ts --module commonjs --target es2017 --noEmit
// npx tsc TypeScript コンパイラを実行する
// study15-main.ts このファイルを対象にする
// --module commonjs import 文を require() 形式に変換するルールを使う
// --target es2017 出力する JS のバージョンを ES2017 にする
// --noEmit JS ファイルは出力しない（型チェックだけ行う）

// 実際は以下でコマンド実行
npx tsc study15-main.ts --module commonjs --target es2017 --noEmit --ignoreConfig
// 何も返ってこなかった→型エラーなし = 成功
```

---

### ④ `import` と `import type` の違いを確認する

```ts
// study15-main.ts で試す

// 以下のコードは何行目でエラーになるか？

import type { User } from "./study15-types";

const u: User = { id: 1, name: "Test", role: "viewer" }; // ← これは OK か？
console.log(User); // ← これはどうなるか？
```

**解説**

`import type` で取り込んだものは **型としてしか使えない**。値として参照（`console.log(User)`）しようとするとコンパイルエラーになる。

| 操作 | `import` | `import type` |
|---|---|---|
| 型アノテーションに使う | OK | OK |
| 値として参照する（関数呼び出しなど） | OK | **エラー** |
| コンパイル後の JS に残る | 残る（値の場合） | 残らない |

---

### ⑤ `export type` で型だけを再エクスポートする

`study15-utils.ts` に以下を追加する：

```ts
// study15-types.ts から User を import して、
// export type { User } で外部に公開する
// （utils 経由で型を配れるようにする）

// ポイント：utils を使う側は types.ts を直接 import しなくてよくなる
```

`study15-main.ts` の import を書き換えて、`study15-types.ts` ではなく `study15-utils.ts` から `User` を取り込んでみる。

---

### ⑥ 型と値が同名のとき（クラスの場合）

```ts
// study15-types.ts に追加

// class UserRecord を定義する
// プロパティ：id（number）/ name（string）
// constructor で id と name を受け取って this に代入する
// メソッド display() を定義する（console.log で id と name を出力）

// export する（export type ではなく通常の export）
```

```ts
// study15-main.ts に追加

// UserRecord を import する（通常の import）
// new UserRecord(1, "Alice") でインスタンスを作る
// display() を呼ぶ

// 次に UserRecord を import type に変えてみる
// → new UserRecord(...) の行は何というエラーになるか？
```

**ポイント：** クラスは「型」と「値」の両方を持つ特殊なもの。

| import の種類 | 型として使う | `new` でインスタンス化 |
|---|---|---|
| `import` | OK | OK |
| `import type` | OK | **エラー** |

クラスを `import type` で取り込むと、型としては使えるがインスタンス化できない。

---

## 確認ポイント

**`import type` を使う理由は何？**

型だけのインポートであることを明示できる。ビルドツール（esbuild・SWC など）が「この import はランタイムに不要」と判断してコードを消せるため、バンドルサイズや循環参照の解消に有効。TypeScript の `verbatimModuleSyntax` オプションを有効にすると、型のインポートには必ず `import type` を使うことが強制される

**型定義ファイル（types.ts）を別にする意味は？**

ロジックと型定義を分けることで、型だけ使いたいモジュールが関数の実装を読み込まずに済む。大きなプロジェクトで依存関係をシンプルに保つための設計

**クラスを `import type` で取り込んだとき `new` できないのはなぜ？**

`new` はランタイムの操作。`import type` で取り込んだものはコンパイル後に消えるため、実行時には存在しない。型チェックには使えるが、実際の処理には使えない

**`export type { X } from "./module"` は何をしているか？**

別モジュールの型を一度受け取って、そのまま外に公開（再エクスポート）している。値は何も持ち込まない型の中継地点
