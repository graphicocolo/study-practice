# モジュールとスクリプト

## スクリプトとモジュールの違い

TypeScript（および JavaScript）では、ファイルの扱いが2種類ある。

| 種別 | 条件 | スコープ |
|---|---|---|
| スクリプト | `import` / `export` が1つもない | グローバル（他ファイルと共有） |
| モジュール | `import` / `export` が1つ以上ある | ファイルごとに独立 |

```ts
// スクリプト扱い（import/export なし）
const testCases = [...];  // グローバルスコープに置かれる

// モジュール扱い（export があれば1行でよい）
export {};
const testCases = [...];  // このファイルだけのスコープ
```

---

## なぜスクリプトが存在するのか

ES2015（ES6）で `import` / `export` が導入される前は、すべての JS ファイルがスクリプトとして動いていた。

```html
<!-- 昔のブラウザでの読み込み方 -->
<script src="utils.js"></script>
<script src="main.js"></script>
<!-- 両ファイルの変数が同じグローバルスコープに存在する -->
```

TypeScript がスクリプト扱いをデフォルトにしているのは、この歴史的な互換性のため。

---

## 実務での使い分け

**実務ではモジュール一択。** 現代の TypeScript プロジェクト（Vite / Next.js / Node.js ESM）では、すべてのファイルをモジュールとして書くのが標準。

スクリプトを意図して使う場面は限られる：

- ブラウザのグローバル変数を拡張する型定義ファイル（`window.myApp` など）
- 古い CDN 読み込みのライブラリ（jQuery を `<script>` タグで読むなど）
- `declare` だけで構成された型定義ファイル（`.d.ts`）

---

## tsconfig.json でモジュールを強制する

```json
{
  "compilerOptions": {
    "moduleDetection": "force",
    "isolatedModules": true,
    "module": "ESNext"
  }
}
```

| 設定 | 値 | 効果 |
|---|---|---|
| `moduleDetection` | `"force"` | 全ファイルを自動的にモジュール扱いにする |
| `isolatedModules` | `true` | `import`/`export` がないファイルをエラーとして検出する |
| `module` | `"ESNext"` | `import` のまま出力する（バンドラー前提） |

Vite で `npx create-vite` した際の `tsconfig.json` は、ほぼこの構成になっている。

---

## 「グローバル」の範囲は環境によって異なる

「グローバルスコープ」の指す範囲は、実行環境ごとに違う。ドメインでもディレクトリでもない。

### ブラウザの場合：同一ページの `window`

同じ HTML ページで `<script>` タグ（`type="module"` なし）に読み込まれたファイルは、同じ `window` オブジェクトを共有する。

- 別ページ（別の HTML）には引き継がれない
- 同一ドメインでも別ページなら別の `window`
- ディレクトリ構造は関係ない

### TypeScript の型チェック（tsc）の場合：同一コンパイル対象

`tsconfig.json` の `include` で指定されたファイル群の中で、スクリプト扱いのファイルはすべて同じグローバル名前空間として処理される。

```
tsconfig.json
  └── include: ["src/**/*"]
        ├── password-strength.ts  ← const testCases が衝突
        └── phone-validation.ts   ← const testCases が衝突
```

ディレクトリが違っても `include` の対象に入っていれば衝突する。

### Node.js の場合：`global` オブジェクト（明示しない限り漏れない）

Node.js（CommonJS）では、各ファイルは内部的に関数でラップされるため、`const` / `let` は実際にはファイルスコープに収まる。本当のグローバルに変数が漏れるのは `global.myVar = ...` と明示したときだけ。

### まとめ

| 環境 | グローバルの範囲 |
|---|---|
| ブラウザ（script タグ） | 同一ページの `window` |
| TypeScript（tsc） | 同一 `tsconfig.json` のコンパイル対象 |
| Node.js（CommonJS） | `global` オブジェクト（明示しない限り漏れない） |

---

## `defer` と `type="module"` の違い

役割が異なる。`defer` は**実行タイミング**の制御、`type="module"` は**ファイルの扱い方**の制御。

### `defer`：実行タイミングを遅らせる

```html
<script defer src="main.js"></script>
```

- HTML の解析が終わってからスクリプトを実行する
- スコープはグローバルのまま（`window` を共有する）
- `import` / `export` は使えない
- 複数ある場合は記述順に実行される

`defer` がない場合、ブラウザは `<script>` タグを見つけた時点で HTML の解析を止めてスクリプトを実行する。`defer` はその割り込みを防ぐための属性。

### `type="module"`：ファイルをモジュールとして扱う

```html
<script type="module" src="main.js"></script>
```

- ファイル独自のスコープを持つ（`window` を汚染しない）
- `import` / `export` が使える
- 自動的に `defer` と同じタイミングで実行される（HTML 解析後）
- 常に strict モードで動く
- 同じファイルを複数回読み込んでも1回しか実行されない

### 比較表

| | `defer` | `type="module"` |
|---|---|---|
| 役割 | 実行タイミングの制御 | ファイルをモジュールとして扱う |
| スコープ | グローバル（`window` 共有） | ファイルスコープ（独立） |
| `import`/`export` | 使えない | 使える |
| 実行タイミング | HTML 解析後 | HTML 解析後（`defer` と同等） |
| strict モード | 自動にはならない | 常に有効 |

- defer → いつ実行するか（タイミング）の制御。スコープはグローバルのまま
- type="module" → ファイルをモジュールとして扱う（スコープ・import/export・strict モード）。タイミングは自動的に defer と同等になる

### 使い分け

「タイミングを遅らせたいだけ」なら defer、「モジュールとして動かしたい」なら type="module" という使い分け

- `import` / `export` を使いたい → `type="module"`
- レガシーコードで読み込み順だけ制御したい → `defer`
- Vite などのバンドラーを使う現代の開発では、`<script>` タグを手書きする機会はほぼなく、バンドラーが最適な属性を自動で付与する
