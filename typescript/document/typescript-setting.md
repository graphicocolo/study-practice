# TypeScript を素で使う場合の典型設定

バンドラー（Vite など）を使わず TypeScript を直接使う場合、用途によって設定が3パターンに分かれる。

---

## パターン A：Node.js スクリプト（CJS）

`tsc` でコンパイル → `node dist/index.js` で実行する最もシンプルな構成。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

`tsc --init` のデフォルトに近い。Node.js で素の TypeScript を始める場合の出発点。

---

## パターン B：Node.js（ESM）

`package.json` に `"type": "module"` を追加するセット。`NodeNext` が現在の推奨。

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

`module: "NodeNext"` にすると `package.json` の `"type"` フィールドを見て CJS/ESM を判断する（→ [[typescript-cjs-vs-esm]] 参照）。

`moduleResolution` は「import 文のパスをどう解決するか」の設定で、`module` の値に合わせてセットで変える必要がある。

---

## パターン C：バンドラー経由（Vite や webpack を使うが React 以外）

`tsc` は型チェックのみ、変換はバンドラーに任せる構成。Vite の自動設定もほぼこれ。

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "isolatedModules": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
```

`moduleResolution: "bundler"` は TypeScript 5.0 で追加された設定。「バンドラーが解決するから `.js` 拡張子の省略を許可する」など、バンドラー前提の緩い解決ルールになる。

---

## 実例：Viteが生成したtsconfig.jsonを分類する（study18）

`npm create vite@latest -- --template vanilla-ts` で生成された `tsconfig.json` を例に、各設定が「何のために存在するか」を4つのグループに分類する。TypeScriptにまだ精通していない段階では、「この設定は変更が必要か」の感覚をつかむのにこの分類が役立つ。

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**① Viteが動くために必要な設定（フレームワークに関係なく共通）**

- `moduleResolution: "bundler"` / `module: "esnext"` — Node方式ではなく、バンドラー方式でimportを解決させる
- `types: ["vite/client"]` — `import.meta.env` や `.svg`/`.css` のimportをTypeScriptに教える、Vite専用の型定義
- `noEmit: true` — 実際のJS変換・バンドルはVite（esbuild/rolldown）側がやるので、TypeScriptは型チェックだけに専念させる
- `allowImportingTsExtensions: true` / `moduleDetection: "force"` — bundlerモード特有の付随設定

→ これらはVanillaでもReactでもVueでも、**Viteを使う限り基本セット**（パターンCの中身そのもの）。

**② ブラウザで動かすために必要な設定（フレームワーク関係なく「ブラウザ向け」なら共通）**

- `lib: ["ES2023", "DOM"]` — `document` や `window` のようなブラウザAPIの型を認識させる

**③ フレームワーク固有で変わる部分**

Reactの場合（`--template react-ts`）は、ここに以下が**追加**される。

- `"jsx": "react-jsx"` — `.tsx` の中でJSX構文（`<div>...</div>`）を書けるようにする設定。Vanilla-tsにはJSXがないので不要
- `lib` に `"DOM.Iterable"` が足されることが多い（`document.querySelectorAll` の戻り値をfor-ofで回せるようにする等）

**④ プロジェクトの好み・規約で変えてよい設定（Vite/フレームワークとは無関係）**

- `target`（どのJSバージョンに出力するか。対応ブラウザ次第）
- `noUnusedLocals` / `noUnusedParameters` / `noFallthroughCasesInSwitch`（厳しさの好み）
- `skipLibCheck` / `verbatimModuleSyntax`

**まとめ**

テンプレートが生成した①②③は、そのプロジェクト種別に対する必須〜準必須の設定。④は好みで後から調整してよい部分。他のテンプレートの `tsconfig.json` を見たときも「これはVite用か、フレームワーク用か、好みか」で仕分けすると理解しやすい。

---

## まとめ：どれを選ぶか

```
Node.js でそのまま実行したい
  ├── CJS でいい        → module: "commonjs"
  └── ESM を使いたい   → module: "NodeNext" + package.json に "type": "module"

バンドラー（Vite/webpack）を使う
  └── module: "ESNext" + moduleResolution: "bundler"
```

React / Vite の組み合わせはパターン C の自動設定が最適化されているため意識しなくて済む。Node.js でバックエンドや CLI ツールを作るときはこの選択を自分でする必要が出てくる。

---

## package.json の設定

プロジェクトの全体的な挙動や、モジュールの種類をNode.jsに伝えます。

- "type": "module" : JavaScriptの標準規格（ES Modules / ESM）として扱います。import が使えます。
- "type": "commonjs" : 従来のNode.jsの規格（CommonJS）として扱います。require() が使われます。

## tsconfig.json の設定

TypeScriptに「どういう変換ルールでJavaScriptにするか」を指示します。主に以下の項目が重要です。

### 変換先（"target"）

出力されるJavaScriptのバージョンを指定します（例："ES2022", "ESNext"）。

### モジュールの解決方法（"module"）

package.json の "type" と深く連携します。

"type": "module" の場合：tsconfig の "module" も "NodeNext" または "ESNext" にします。

"type": "commonjs" の場合：tsconfig の "module" は "CommonJS" にします。

## 設定が迷子になった場合は、以下の手順でエラーを絞り込むのが一番の近道です。

### tsconfig.json を手動でいじりすぎない

最初からゼロで書こうとせず、TypeScript公式のtsconfigリポジトリ にあるような、用途に合わせたベーステンプレートを読み込む（"extends" を使う）のが最も確実で安全です。

[tsconfig/bases](https://github.com/tsconfig/bases)

### エラーを分ける

package.json の "type" と tsconfig.json の "module" の組み合わせは非常に重要です。以下の記事で実務のパターンが分かりやすく解説されています。

[実務におけるtsconfig設定](https://qiita.com/nao-United92/items/54261e2bbe926d7702b9)

---

## 補足：設定値の意味を整理する

### そもそも「モジュール」とは

一言でいうと「**ファイル同士が値をやり取りする仕組み**」。

```ts
// math.ts が「export（外に出す）」
export function add(a: number, b: number) { return a + b; }

// index.ts が「import（受け取る）」
import { add } from "./math";
```

この `import` / `export` の仕組み全体を「モジュールシステム」と呼ぶ。  
「モジュール = import/export があるファイル」とほぼ同義。

---

### `target` と `module` は別々の話

| 設定 | 何を制御するか |
|---|---|
| `target` | 出力する JS の**構文バージョン** |
| `module` | 出力する import 文の**形式** |

この2つは完全に独立している。

---

### `target: "ES2022"` vs `target: "ESNext"`

```
ES2022  → 2022年時点の JS 構文で出力（安定している）
ESNext  → 執筆時点の最新 JS 構文で出力（「常に最新」という意味）
```

実用上ほぼ同じ。Vite のようにバンドラーが後処理する環境では `ESNext`、安定を重視するなら `ES2022` を選ぶ程度の違い。

---

### `module: "NodeNext"` は ESM なのか？

「ESM かどうかを Node.js に決めさせる」設定。ESM そのものではない。

```
module: "NodeNext" を指定すると…

  package.json の "type" を見る
    → "module"   のとき → ESM として出力
    → "commonjs" のとき → CJS として出力（デフォルト）
```

「Node.js の実際のルールに従う」という設定なので、ESM を出したければ `package.json` に `"type": "module"` を書く必要がある。

対して `module: "ESNext"` は「とにかく ESM 形式で出力、後はバンドラーに任せる」という設定。

---

### 3つの `module` 値の違い

```
"commonjs"  → require() に変換（Node.js でそのまま実行できる）
"NodeNext"  → package.json を見て CJS か ESM か決める
"ESNext"    → import のまま出力（バンドラー前提）
```

Vite を使う React 開発では `target: "ESNext"` + `module: "ESNext"` がセットで設定されるが、これは「Vite がすべて処理してくれるから、TypeScript は変換しなくていい」という意味。

---

### `verbatimModuleSyntax`

「import/export をソースコードのまま（verbatim = 逐語的に）出力する」モード。

有効にすると、**型としてしか使わない import には必ず `import type` を書くことが強制される。**

```ts
import { User } from "./types";      // ← User が型だけなのでエラー
import type { User } from "./types"; // ← これが必須になる
```

なぜ強制されるか：バンドラーやランタイムが「この import は型だけなので消していい」と判断するには、明示的な `import type` が必要なため。

---

### `allowImportingTsExtensions`

import パスに `.ts` 拡張子を書くことを許可する設定。

```ts
// 通常（拡張子なし、または .js で書くのが慣習）
import { User } from "./types";

// このオプションがないと拡張子 .ts は書けない
import { User } from "./types.ts"; // ← allowImportingTsExtensions が必要
```

ただし、TypeScript が `.ts` → `.js` に変換する際に拡張子を書き換えられないため、**「JS ファイルは出力しない」という別のオプションと必ずセットで使う必要がある。**

---

### `noEmit`

TypeScript に **JS ファイルを一切出力させない** 設定。型チェックだけを行う。

```
noEmit: true の場合
  .ts ファイル → 型チェックのみ → .js は出力しない
```

Vite・esbuild・Babel など別のツールが JS 変換を担当するとき、TypeScript は「型チェック専用」にするために使う。`allowImportingTsExtensions` との組み合わせが許可される理由は「どうせ JS に変換しないので、拡張子の書き換え問題が起きない」から。

---

### `emitDeclarationOnly`

**`.d.ts`（型定義ファイル）だけを出力する** 設定。`.js` は出力しない。

```
emitDeclarationOnly: true の場合
  .ts ファイル → 型チェック → .d.ts のみ出力（.js は出力しない）
```

ライブラリを作るときに、JS 変換は別ツールに任せ、型定義だけ TypeScript に生成させる用途で使う。`noEmit` との違いは「`.d.ts` は欲しい」かどうか。

| オプション | .js 出力 | .d.ts 出力 |
|---|---|---|
| `noEmit: true` | なし | なし |
| `emitDeclarationOnly: true` | なし | あり |

---

### `rewriteRelativeImportExtensions`

TypeScript 5.7 で追加されたオプション。import パスの `.ts` 拡張子を、出力時に自動で `.js` に書き換える。

```ts
// ソースコード（書いたまま）
import { User } from "./types.ts";

// 出力された .js ファイル（TypeScript が自動で書き換える）
import { User } from "./types.js";
```

`noEmit` なしで `.ts` 拡張子を書きたいときに使う。

---

### `allowImportingTsExtensions` が必要な理由の構造

```
allowImportingTsExtensions: true
  ↓「.ts 拡張子で書いていいよ」

でも TypeScript は .ts → .js の変換時に拡張子を書き換えられない

解決策（どれか1つが必要）
  ├─ noEmit: true                        → そもそも .js を出力しない
  ├─ emitDeclarationOnly: true           → .d.ts だけ出力、.js は出さない
  └─ rewriteRelativeImportExtensions: true → 拡張子を .js に自動変換する
```

**実用上のシンプルな答え：** Deno など一部の環境を除き、import パスに `.ts` 拡張子は通常書かない。TypeScript は拡張子なしのパスを自動で解決する。

---

### `module: "NodeNext"` では import に `.js` 拡張子が必要

`module: "NodeNext"` は Node.js の ESM ルールに厳密に従う。Node.js ESM では import パスに**必ず拡張子が必要**で、かつ「出力後のファイル名」を書く規則がある。

TypeScript は `.ts` → `.js` にコンパイルするので、**ソースが `.ts` でも import には `.js` と書く。**

```ts
// NG（拡張子なし）
import { User } from "./types";

// OK（.js と書く ← ソースは .ts だが出力は .js になるから）
import { User } from "./types.js";
```

TypeScript は `.js` と書かれた import を「対応する `.ts` ファイルを探せ」と解釈するので、`.ts` ファイルが正しく解決される。

**なぜこうなっているか：**

```
module: "NodeNext" の設計思想
  → TypeScript が出力した .js を Node.js がそのまま実行できる状態にする
  → Node.js ESM は拡張子省略を許可しない
  → だから import も「実行時と同じパス」= .js で書く
```

**moduleResolution ごとの拡張子ルールまとめ：**

| moduleResolution | 拡張子 | 典型的な用途 |
|---|---|---|
| `node` / `bundler` | 省略可（`.js` 不要） | Vite・webpack などバンドラー経由 |
| `node16` / `nodenext` | `.js` 必須 | Node.js で直接実行する ESM |
