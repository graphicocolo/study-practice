# JavaScript 実践 `window.addEventListener('DOMContentLoaded',`

jsファイルで、書き出しに `window.addEventListener('DOMContentLoaded',...` が不要な場合<br>
↓<br>
`<script src="main.js"></script>` が `</body>` の直前にある

```html
...
  </div>
  <script src="main.js"></script>
</body>
</html>
```

ブラウザはHTMLを上から順番に読み込みます。`<script>` が `</body>` の直前にあるということは、その時点でHTML内のすべての要素がすでにDOMとして生成済みです。

だから `document.querySelector("#price")` などが確実に要素を取得できます。

**`DOMContentLoaded` が必要になるケース**

もし `<script>` が `<head>` 内にあると：

```html
...
<head>
  <script src="main.js"></script>  <!-- ← bodyの前に実行される -->
</head>
<body>
  <input id="price">  <!-- ← まだ読み込まれていない！ -->
</body>
```

この場合、main.js が実行される時点ではまだ `<input id="price">` が存在しないので、querySelector が null を返します。それを防ぐために DOMContentLoaded で「DOM全体の読み込みが終わるまで待つ」必要があるわけです。

まとめ：`<script>` を `</body>` 直前に置けば、DOMは生成済みなので DOMContentLoaded は不要。

**defer**

```html
<head>
  <script src="main.js" defer></script>
</head>
```

defer を付けると、HTMLの解析が完了してからスクリプトを実行するという動作になるので、</body> 直前に置くのとほぼ同じ効果になります。

現在の主流は <head> 内に defer 付きで書く方法です。</body> 直前に置く方法は古いやり方で、どちらでも動きますが、defer の方がHTMLの構造として整理されていて好まれます。

## `DOMContentLoaded` と `window.onload` の違い

DOMContentLoaded は発火するタイミングが異なります。

```txt
イベントの発火タイミング

HTMLの受信・解析開始
       ↓
DOM構築完了（ツリー化）
       ↓
defer 属性付きはここで実行される
       ↓
DOMContentLoaded 発火  ← DOM操作はここから可能
       ↓
画像・CSS・外部リソースの読み込み完了
       ↓
load 発火
```

```js
// DOM構築が終わった時点で発火（画像等の読み込みを待たない）
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM ready");
}

// 画像・CSS等すべてのリソースが読み込み完了してから発火
window.addEventListener("load", (event) => {
  console.log("All resources loaded");
}
```

使い分け

- DOMContentLoaded — ボタンにクリックイベントをつける、要素のテキストを書き換える等、DOM操作が目的ならこちらが最適。ページ表示が速くなる
- load — 画像の幅・高さを取得したい等、外部リソースの読み込み完了が必要な場合に使う

実務では多くの場合 DOMContentLoaded で十分です。

VanillaJSのコードを書く際、最初にDOMContentLoadedの記述があった方が良いのか？

結論から言うと、<script> タグの配置次第です。

実務では `<head>` に defer をつけて配置 するか、`</body>` 直前に配置 するのが一般的なので、DOMContentLoaded を毎回書く必要はない

```html
<!-- <script> を </body> の直前に置く場合（現在の主流） -->
...
  <script src="app.js"></script>  <!-- DOM構築後に実行される -->
</body>
...
<!-- この場合、スクリプト実行時にはすでにDOMが構築済みなので DOMContentLoaded は不要 -->
```

```html
<!-- <script> を <head> 内に置く場合 -->
...
  <script src="app.js"></script>
</head>
...
<!-- この場合、DOM構築前に実行されるため、要素がまだ存在しません。DOMContentLoaded で囲む必要がある -->
```

```js
// app.js — 囲まないと要素が取得できない
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");
  btn.addEventListener("click", () => { ... });
}
```

```html
<!-- defer 属性を使う場合（モダンな方法） -->
...
  <script src="app.js" defer></script>
</head>
<!-- defer はDOM構築完了後に実行されることが保証されるので、DOMContentLoaded は不要です。<head> に書けて、かつ囲む必要もないので便利 -->
```
