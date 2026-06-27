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
