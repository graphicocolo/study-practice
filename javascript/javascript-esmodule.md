# ES Module（ESM）

JavaScript の公式モジュール仕様。ファイルを分割して `export` / `import` でやり取りする仕組みで、ES2015（ES6）で標準化された。

```js
// constants.js
export const API_KEY = "xxx";

// app.js
import { API_KEY } from "./constants.js";
```

## それ以前はどうだったか

ESM が登場する前、JavaScript にはモジュールの仕組みが言語仕様として存在しなかった。Node.js が独自に **CommonJS（CJS）** という仕様を作り、長く使われてきた。

```js
// CommonJS（Node.js 独自）
const { API_KEY } = require("./constants.js");
module.exports = { API_KEY };
```

## ESM の特徴

| | ES Module | CommonJS |
|---|---|---|
| 構文 | `import` / `export` | `require` / `module.exports` |
| 読み込みタイミング | 静的（実行前に解決） | 動的（実行時に解決） |
| ブラウザ対応 | ネイティブ対応 | 非対応（バンドラー必要） |
| 標準仕様 | JavaScript 公式 | Node.js 独自 |

## ブラウザで使うには

`<script>` タグに `type="module"` を付ける必要がある。これがないと `import` 文がエラーになる。

```html
<script type="module" src="app.js"></script>
```

`type="module"` をつけると `defer` は自動でかかる。
