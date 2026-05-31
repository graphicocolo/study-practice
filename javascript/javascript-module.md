# JavaScript モジュール（`<script type="module">`）

## `<script src="...">` と `<script type="module">` の違い

| | `<script src="...">` | `<script type="module">` |
|---|---|---|
| トップレベル変数 | グローバル（`window` に乗る） | モジュール内のみ |
| strict モード | 手動で `"use strict"` | 自動 |
| `defer` | 手動で属性追加 | 自動 |

---

## トップレベル変数のスコープ

```js
// <script src="..."> の場合
let timeId; // → window.timeId としてブラウザコンソールからアクセスできる

// <script type="module"> の場合
let timeId; // → モジュール内だけで使える。window.timeId は undefined
```

同じファイル内のイベントリスナー同士は、モジュールスコープの変数を共有できる。

```js
let timeId; // モジュールスコープ

window.addEventListener("DOMContentLoaded", () => {
  timeId = setInterval(...); // 代入できる
});

window.addEventListener("beforeunload", () => {
  clearInterval(timeId); // 参照できる ✅
});
```

---

## strict モードが自動で有効になる

`"use strict"` を書かなくても strictモードになる。

`setTimeout` の `function` 内で `this` を使うと `undefined` になる（→ [[javascript-timeoutinterval]] の `this` 問題を参照）。

```js
// type="module" では自動で strict モード
setTimeout(function() {
  console.log(this); // undefined（strict モード）
}, 1000);

// アロー関数なら問題なし
setTimeout(() => {
  console.log(this); // 外側のスコープの this
}, 1000);
```

---

## `defer` が自動で有効になる

`<script type="module">` は常に `defer` 扱いなので、HTMLに `defer` を書かなくてもDOMが読み込まれてから実行される。

```html
<!-- defer を書かなくても同じ動作 -->
<script type="module" src="main.js"></script>
```

---

## 実務では `type="module"` が推奨

グローバル変数の意図しない上書きを防げるため。
