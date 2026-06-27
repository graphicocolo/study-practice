# CommonJS と ESM（Node.js のモジュール方式）

## 2つのモジュール方式

Node.js には歴史的な経緯から2つのモジュール方式がある。

| 方式 | 正式名称 | 読み込み構文 | top-level await |
|---|---|---|---|
| CJS | CommonJS | `require()` / `module.exports` | 使えない |
| ESM | ECMAScript Modules | `import` / `export` | 使える |

CJS は Node.js が最初から持っていた方式。ESM は JavaScript の標準仕様（ES2015）として後から導入された。

**モジュール形式について**

- CommonJS (CJS) Node.js 独自のモジュール形式（require / module.exports）
- ESM JavaScript 標準のモジュール形式（import / export）、ES2015 で登場
- ESNext tsconfig の module 設定値。「最新の ESM 構文のまま出力する」という意味 tsconfig のオプション値

ESNext は独立したモジュール形式ではなく、「import / export を変換せずそのまま出力する」という tsconfig の指示です。つまり ESM の一種で、バンドラー（Vite, webpack）が後処理することを前提にしています。

---

## どちらが使われるかを決める：`package.json` の `"type"` フィールド

```json
{
  "type": "commonjs"  // → .ts / .js ファイルを CJS として扱う（デフォルト）
}
```

```json
{
  "type": "module"    // → .ts / .js ファイルを ESM として扱う
}
```

`"type"` フィールドを書かなかった場合のデフォルトは `"commonjs"`。

---

## `tsconfig.json` の `"module": "nodenext"` との関係

`"module": "nodenext"` にすると、TypeScript は Node.js の挙動に合わせて CJS / ESM を判断する。
その判断基準がまさに `package.json` の `"type"` フィールド。

```
tsconfig.json の "module": "nodenext"
  ↓
package.json の "type" を見る
  → "commonjs" → CJS として型チェック
  → "module"   → ESM として型チェック（top-level await OK）
```

`"module": "nodenext"` は「Node.js の実際の動作に正直に合わせる」設定なので、
実行環境（Node.js）と型チェック（TypeScript）の挙動が一致する。

---

## top-level await が使えない理由

CJS はファイル全体を関数でラップして同期的に実行する仕組みのため、
ファイルのトップレベルで `await` を使う手段がない。

ESM は非同期ロードを前提として設計されているため、top-level await が使える。

```ts
// CJS（"type": "commonjs"）→ エラー
const user = await fetchJson<User>(url);
// エラー：現在のファイルは CommonJS モジュールであり、最上位レベルでは 'await' を使用できません

// ESM（"type": "module"）→ OK
const user = await fetchJson<User>(url);
```

---

## 「スクリプト vs モジュール」との違い

[[typescript-moduleandscript]] で扱ったスクリプト vs モジュールとは別のレイヤーの話。

| レイヤー | 区別 | 決まり方 |
|---|---|---|
| TypeScript / JS の概念 | スクリプト vs モジュール | `import`/`export` があるか |
| Node.js の実行方式 | CJS vs ESM | `package.json` の `"type"` フィールド |

TypeScript の「モジュール」（`import`/`export` があるファイル）は CJS でも ESM でも成立する。
CJS vs ESM は「Node.js がそのモジュールをどうロードするか」の話。

---

## まとめ

- `"type": "module"` にすると ESM になり、top-level await が使えるようになる
- `"module": "nodenext"` の tsconfig は `package.json` の `"type"` を見て CJS / ESM を判断する
- 現代の TypeScript プロジェクトでは `"type": "module"` が標準になりつつある
- CJS vs ESM は TypeScript のスクリプト vs モジュールとは別のレイヤー（Node.js の実行方式の話）
