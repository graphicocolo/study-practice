# 課題：TypeScript + Vite でのプロジェクト構成

**目標：** Vite を使った TypeScript プロジェクトの雛形を自分で作り、生成されるファイルがそれぞれ何をしているかを理解する。卒業制作（天気アプリの TS 移行）の土台になる回

---

## 準備

`study-practice/typescript/practice/` に新しいプロジェクトを作成：

```
study18-vite-app/
```

---

## 前提知識

| 用語 | 一言で言うと |
|---|---|
| Vite | 開発サーバー + バンドラー。保存した瞬間に画面へ反映される（HMR） |
| `vite.config.ts` | Vite 自体の設定ファイル（プラグイン・ビルド設定など） |
| `tsconfig.json` | TypeScript コンパイラの設定ファイル（型チェックのルール） |
| HMR（Hot Module Replacement） | ページ全体を再読み込みせず、変更箇所だけ差し替える仕組み |

---

## やること

### ① Vite プロジェクトを作成する

```bash
# study-practice/typescript/practice/ に移動してから実行
# npm create vite@latest study18-vite-app -- --template vanilla-ts

# プロンプトが出たら指示に従って進める
# 作成後：
# cd study18-vite-app
# npm install
# npm run dev
```

ブラウザで表示された URL を開き、`src/main.ts` を編集して保存する。
→ ブラウザをリロードしなくても変更が反映されることを確認する（これが HMR）

### ② 生成されたファイル構成を確認する

```
study18-vite-app/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    └── ...
```

- `index.html` を開いて、`<script>` タグがどのファイルを読み込んでいるか確認する
  → `src="/src/main.ts"` のように **`.ts` ファイルが直接指定されている**ことに注目する
  → 通常のブラウザは `.ts` を読めないはずなのに、なぜ動くのか？（Vite が開発時に裏側で変換している）

### ③ `tsconfig.json` の中身を読む

```bash
# study18-vite-app/tsconfig.json を開く
```

- study12（`tsconfig.json` の基本設定）で学んだ `strict` / `target` / `module` を探す
- 見慣れない項目があれば、コメントで役割をメモしておく（例：`isolatedModules`, `moduleDetection` など）
- study17 で確認した `isolatedModules` の設定値が何になっているか確認する
  → Vite プロジェクトでこの値がどちらに設定されていることが多いか、その理由も考える

### ④ `vite.config.ts` の中身を読む

```bash
# study18-vite-app/vite.config.ts を開く
```

- `defineConfig` が何をしているか調べる（型補完を効かせるためのヘルパー関数）
- `plugins` に何が入っているか確認する

### ⑤ 型エラーを意図的に起こしてみる

```ts
// src/main.ts に以下を追加する
// const count: number = "文字列"; // 型エラーになるはず

// npm run dev の状態のまま保存する
// → ターミナル・ブラウザにどうエラーが表示されるか確認する
// → tsc を手動実行したときのエラーメッセージと比べて何が違うか
```

**ポイント：Vite は型チェックをしない**

Vite の開発サーバーは高速化のため、TypeScript を「型チェックなしで JS に変換するだけ」（トランスパイルのみ）で済ませている。型エラーがあっても `npm run dev` の画面上には出てこないことがある。

```bash
# 型エラーだけを検出したい場合は tsc を単体で使う
npx tsc --noEmit
```

`--noEmit` は「型チェックだけ行い、`.js` ファイルは出力しない」オプション。Vite の高速さと、tsc の厳密な型チェックは役割分担されている。

### ⑥ ビルドしてみる

```bash
# npm run build
# dist/ フォルダの中身を確認する
```

- `src/main.ts` は `dist/` の中でどんなファイル名・中身になっているか確認する
- ファイルサイズや内容が開発時の `main.ts` とどう違うか（圧縮・バンドルされていることを確認する）

---

## 確認ポイント

**Vite の開発サーバーは何をしてくれる？**

保存した瞬間にブラウザへ変更を反映する（HMR）。`.ts` ファイルをブラウザが解釈できる形にその場で変換して配信する

**`npm run dev` 中に型エラーがあっても画面が壊れないことがあるのはなぜ？**

Vite はトランスパイル（構文変換）のみを行い、型チェックは基本的に行わないため。型チェックを厳密に行いたい場合は `tsc --noEmit` を別途実行する必要がある

**`tsconfig.json` と `vite.config.ts` の役割の違いは？**

`tsconfig.json` は TypeScript コンパイラ（型チェック・構文変換のルール）の設定。`vite.config.ts` は Vite 自体（開発サーバー・ビルド・プラグイン）の設定。別々のツールの設定ファイルが並んで存在している

**`npm run build` の後、`.ts` ファイルはどうなる？**

型情報がすべて取り除かれ、複数ファイルがバンドルされた `.js` として `dist/` に出力される。ブラウザは `.js` しか読めないため、最終的に配布されるのは型のない JavaScript
