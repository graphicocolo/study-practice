# 課題：`tsconfig.json` の基本設定

**目標：** `tsconfig.json` の役割と主要オプションを理解し、プロジェクトの目的に合った設定を自分で選択できるようになる

---

## 準備

`study-practice/typescript/` に作業用ディレクトリを作成して、TypeScript をインストールする：

```bash
mkdir tsconfig-practice && cd tsconfig-practice
npm init -y
npm install --save-dev typescript
npx tsc --init
```

これで `tsconfig.json` が生成される。

---

## 前提知識

`tsconfig.json` は TypeScript コンパイラ（`tsc`）への設定ファイル。
「どの TypeScript ファイルを」「どんな JavaScript に」「どこへ」変換するかを定義する。

| オプション | 役割 | よく使う値 |
|---|---|---|
| `strict` | 厳格な型チェックをまとめて有効にする | `true` |
| `target` | 変換先の JavaScript バージョン | `"ES2020"` / `"ESNext"` |
| `module` | モジュール形式 | `"commonjs"` / `"ESNext"` |
| `outDir` | コンパイル後の JS を置く場所 | `"./dist"` |
| `rootDir` | TypeScript ソースの場所 | `"./src"` |
| `include` | コンパイル対象ファイルのパターン | `["src/**/*"]` |
| `exclude` | コンパイルから除外するパターン | `["node_modules"]` |

---

## やること

### ① `tsc --init` で `tsconfig.json` を生成して中身を読む

```ts
// tsconfig-practice/ ディレクトリで以下を実行する
// npx tsc --init

// 生成された tsconfig.json を開いて以下を確認する：
// - デフォルトで有効になっているオプションはどれか？
// - コメントアウトされているオプションはどれか？
// - strict はデフォルトで true か false か？
```

**`tsc --init` が生成するファイルの構造**

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    ...
  }
}
```

`compilerOptions` の中にすべての設定が入る。
コメントアウト行は「使えるが今は無効」なオプション。

---

### ② `strict` を切り替えて型チェックの変化を確認する

```ts
// tsconfig-practice/src/strict-test.ts を作成して以下を書く：

// 引数の型アノテーションを書かない関数
// function greet(name) {
//   return "Hello, " + name;
// }

// strict: true の状態で npx tsc --noEmit を実行する
// → エラーが出るか？どんなエラーか確認する

// 次に tsconfig.json の strict を false に変えて同じコマンドを実行する
// → 挙動はどう変わるか？
```

**`strict` が有効にするチェック一覧**

`strict: true` は以下の複数オプションをまとめて有効にするショートカット：

| チェック名 | 内容 |
|---|---|
| `noImplicitAny` | 型推論できない引数に `any` が暗黙的に入るのを禁止 |
| `strictNullChecks` | `null` / `undefined` を別の型として扱う |
| `strictFunctionTypes` | 関数の引数の型の反変性チェック |
| `strictPropertyInitialization` | クラスのプロパティが必ずコンストラクタで初期化されることを要求 |

実務では `strict: true` が標準。個別に無効にしたいときだけ上書きする。

---

### ③ `target` を変えてコンパイル結果を比較する

```ts
// tsconfig-practice/src/target-test.ts を作成して以下を書く：

// const greet = (name: string) => `Hello, ${name}`;
// const nums = [1, 2, 3];
// const doubled = nums.map(n => n * 2);

// tsconfig.json の target を "ES5" にして npx tsc を実行する
// → dist/ に生成された JS を確認する
//   （アロー関数・テンプレートリテラルがどう変換されるか見る）

// 次に target を "ES2020" に変えて同じことをする
// → 生成された JS に違いはあるか？
```

**`target` の選び方**

| 環境 | 推奨 `target` |
|---|---|
| Node.js（最新） | `"ES2020"` 以上 |
| ブラウザ（モダンのみ） | `"ES2020"` / `"ESNext"` |
| ブラウザ（古いのも含む） | `"ES5"` （ただし Babel に任せることが多い） |
| Vite + React | `"ESNext"` |

`target` が低いほど古いブラウザで動くが、コードが冗長になる。
Vite などバンドラーを使う場合はバンドラー側がトランスパイルするため `"ESNext"` で問題ない。

---

### ④ `outDir` / `rootDir` でファイル構成を整える

```ts
// tsconfig.json を以下のように設定する：
// {
//   "compilerOptions": {
//     "rootDir": "./src",
//     "outDir": "./dist"
//   },
//   "include": ["src/**/*"]
// }

// src/ の中に .ts ファイルを置いて npx tsc を実行する
// → dist/ に .js ファイルが生成されることを確認する

// src/ の外（tsconfig-practice/ 直下）に .ts ファイルを置いて npx tsc を実行する
// → どんなエラーが出るか？

// "include": ["src/**/*"]
// - 「src/ ディレクトリ以下のすべてのファイル」という意味
// - compilerOptions の外、tsconfig.json のトップレベルに書く
// - include を省略すると TypeScript は tsconfig.json があるディレクトリ以下を全部対象にする
// - rootDir: "./src" と組み合わせて使うことで「src の外の .tsは無視する」と明示できる
```

**`rootDir` を設定する理由**

`rootDir` を指定しないと、TypeScript は `src/` 以外のファイルも拾って
`dist/` のディレクトリ構成が崩れることがある。
`rootDir` は「このディレクトリをルートとして dist/ に同じ構造で出力せよ」という指示。

---

### ⑤ `module` の違いを知る

```ts
// tsconfig.json の module を "commonjs" に設定した状態で
// src/ に以下の2ファイルを作成して npx tsc を実行する：

// math.ts
// export function add(a: number, b: number): number {
//   return a + b;
// }

// index.ts
// import { add } from "./math";
// console.log(add(1, 2));

// → dist/ に生成された JS の import/export がどう変換されているか確認する

// 次に module を "ESNext" に変えて同じことをする
// → 違いはあるか？
```

**`module` の選び方**

| 実行環境 | 推奨 `module` |
|---|---|
| Node.js（CommonJS） | `"commonjs"` |
| Node.js（ESM、package.json に `"type": "module"`） | `"NodeNext"` |
| Vite / webpack などバンドラー経由 | `"ESNext"` |

`"commonjs"` では `import` が `require()` に変換される。
`"ESNext"` では `import` のまま出力される。

---

## 確認ポイント

**`strict: true` を外してはいけない理由は？**

`strict` を無効にすると `noImplicitAny` や `strictNullChecks` も無効になる。「型がついているのにエラーが出ない」状態になり、TypeScript を使う意味が薄れる。既存プロジェクトへの移行期間以外は `true` のまま維持するのが基本

**`target` と `module` はセットで考える必要があるのか？**

別々の概念だが組み合わせに注意が必要。たとえば `target: "ES5"` にしても `module: "ESNext"` にすると ES5 ブラウザで動かない。環境（Node.js か ブラウザか）と実行方法（バンドラーあり・なし）をセットで判断する

**`tsc` と `tsx` / `ts-node` の関係は？**

`tsc` は TypeScript の公式コンパイラで、型チェックと JS 変換を行う。`tsx` / `ts-node` は開発時に「型チェックをスキップして素早く実行する」ためのツール。本番ビルドでは `tsc`（または Vite などのバンドラー）を使う

**`include` を書かないとどうなる？**

`tsconfig.json` が置かれたディレクトリ以下の `.ts` ファイルをすべて対象にする。`node_modules` の型定義が大量に処理対象に入ることがあるため、`include` で `src/**/*` に絞るのが安全

---

## ts ファイルをスクリプトとして扱うか、モジュールとして扱うか

TypeScript は、ファイルに `import` / `export` が**1つもない**場合、そのファイルを「スクリプト」として扱う。
スクリプト扱いのファイルはすべてグローバルスコープを共有するため、複数ファイルで同名の `const` を宣言するとエラーになる。

```
// 例：password-strength.ts と phone-validation.ts の両方に以下があるとエラー
const testCases = [...];
// → ブロック スコープの変数 'testCases' を再宣言することはできません
```

`import` / `export` が1つでもあれば「モジュール」として扱われ、ファイルごとに独立したスコープを持つ。
`export` するものがなくても `export {};` を書けばモジュール扱いになる。

---

### `moduleDetection`

「スクリプトかモジュールか」の判定ルールを変える設定。

```json
{
  "compilerOptions": {
    "moduleDetection": "force"
  }
}
```

| 値 | 動作 |
|---|---|
| `"legacy"`（デフォルト） | `import`/`export` がなければスクリプト扱い |
| `"force"` | すべてのファイルを自動的にモジュール扱い |

`"force"` にすると `export {}` を書かなくてもファイルごとにスコープが独立する。

---

### `isolatedModules`

`import` / `export` がないファイルをエラーとして検出する設定。
Vite などのバンドラーを使うプロジェクトではほぼ必須。

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

`export {}` を書き忘れたときにコンパイルエラーで気づける。

---

## スクリプトとモジュールの実務での使い分け

### 結論：実務では「モジュール」一択

現代の TypeScript プロジェクト（Vite / Next.js / Node.js ESM など）では、**すべてのファイルをモジュールとして書く**のが標準。スクリプトを意図的に使う場面は、ほぼない。

---

### なぜスクリプトが残っているのか

スクリプト（グローバルスコープ）は、ES Modules が登場する前の書き方。

```html
<!-- 昔のブラウザでの読み込み方 -->
<script src="utils.js"></script>
<script src="main.js"></script>
<!-- 両ファイルの変数が同じグローバルスコープに存在する -->
```

`import` / `export` のない TypeScript ファイルがスクリプト扱いになるのは、この歴史的な互換性のため。

---

### 実務でモジュールを使う理由

| 観点 | スクリプト | モジュール |
|---|---|---|
| スコープ | グローバル（全ファイル共有） | ファイルごとに独立 |
| 名前衝突 | 起きる | 起きない |
| 依存関係 | 暗黙（読み込み順に依存） | 明示（`import` で宣言） |
| ツール対応 | バンドラーで扱いにくい | Vite / webpack の前提 |

ファイルが増えるほどグローバルスコープの名前衝突リスクが上がるため、規模のあるプロジェクトではスクリプトは成立しない。

---

### スクリプトが使われる残りの場面

意図してスクリプトを使うケースは限られる：

- **ブラウザのグローバル変数を拡張する型定義ファイル**（`window.myApp` など）
- **古い CDN 読み込みのライブラリ**（jQuery を `<script>` タグで読むなど）
- `declare` だけで構成された型定義ファイル（`.d.ts`）

いずれも「意図してグローバルスコープを使う」特殊なケース。通常のアプリケーションコードでスクリプトを選ぶ理由はない。

---

### 実務プロジェクトでの設定方針

```json
{
  "compilerOptions": {
    "moduleDetection": "force",
    "isolatedModules": true,
    "module": "ESNext"
  }
}
```

この3つを組み合わせると「全ファイルをモジュールとして強制する」構成になる。
Vite で `npx create-vite` した際の `tsconfig.json` は、ほぼこの構成になっている。

---

## スクリプト vs モジュールは JavaScript の話でもある

スクリプト vs モジュールの区別は **ES2015（ES6）で `import` / `export` 構文が導入されたときに生まれた JavaScript 仕様**。TypeScript 固有の概念ではなく、TypeScript はその仕様をそのまま引き継いでいる。

ブラウザでは今も2種類の読み込み方が共存している：

```html
<script src="main.js"></script>               <!-- スクリプト：グローバルスコープ -->
<script type="module" src="main.js"></script>  <!-- モジュール：ファイルスコープ -->
```

Node.js でも同様で、`.js` ファイルは `package.json` に `"type": "module"` がなければ CommonJS（スクリプトに近い扱い）として動く。

### TypeScript が加えたのは `moduleDetection` だけ

| レイヤー | 仕様 |
|---|---|
| JavaScript | `import`/`export` があればモジュール、なければスクリプト |
| TypeScript | 上記を継承しつつ、`moduleDetection` で判定ルールを上書きできる |

TypeScript 独自の話は `moduleDetection` / `isolatedModules` という設定項目が存在するという点のみで、根っこの概念は JavaScript。フロントエンド開発者には常識レベルの知識。
