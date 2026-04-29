# React `Create React App` と Vite

2026年2月現在、React を使って新たにプロジェクトを作成する際に `Create React App` は非推奨となっている

代わりにフレームワークを使用するか、Vite などのビルドツールを使用することが推奨されている

## `Create React App`

React のインストール方法についてネットで検索すると、昔の記事の中で `Create React App` で React をインストールする方法が散見される

少し前は、React をインストールするには多くのツールを組み合わせて自分で行う必要があったが導入のハードルは高かった

そこで半公式のような `Create React App` が広く使われるようになった

しかし現在では、`Create React App` には適切なメンテナンスが行われていないため、インストール方法としては非推奨となっている

## Vite

ビルドツール。React の導入もサポートしている

```zsh
npm create vite@latest my-app -- --template react-ts
```

**インストール後の生成ファイル**

tsconfig.json - 親（統括役）

- 自身には設定を持たず、tsconfig.app.json と tsconfig.node.json を束ねるだけ
- エディタはこのファイルを見て、プロジェクト全体の構成を把握する

tsconfig.app.json - アプリ本体のコード用

- src/ 以下のReactコード（.tsx, .ts）に適用
- jsx: "react-jsx" や DOM 型など、ブラウザ向けの設定がある

tsconfig.node.json - ビルド設定ファイル用

- vite.config.ts だけに適用（include: ["vite.config.ts"]）
- Node.js環境で動くファイル向けなので、DOM 型がなく node 型がある

|    |  tsconfig.app.json  |  tsconfig.node.json  |
| ---- | ---- | ---- |
|  対象  |  src/ (アプリコード)  |  vite.config.ts (ビルド設定)  |
|  実行環境  |  ブラウザ  |  Node.js  |
|  使える型  |  DOM, ES2022  |  node, ES2023  |

**`@`エイリアスを使う**

@/ は src/ の**別名（エイリアス）**です。

エイリアスとは、**「本体は別にあって、それを指す短い別名」**ということ

```json
// tsconfig.app.json - エディタの補完用
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

```ts
// vite.config.ts - ビルド時のパス解決用
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
 });
```