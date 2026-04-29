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