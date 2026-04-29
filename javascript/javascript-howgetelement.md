# JavaScript 実践 `querySelector` と `getElementById` の使い分け

```js
// id属性を持つDOMに対して、どちらを使用して要素を取得すれば良いかその使い分け
document.querySelector()
document.getElementById()
```

getElementById() が向いている場面

- id属性で単一要素を取得するだけの場面
- 意図が明確（「idで取得している」と一目でわかる）

querySelector() が向いている場面

- class、属性、階層など複雑なセレクタが必要な場面
- プロジェクト全体で書き方を統一したい場合

実際のプロジェクトでは多くの現場では querySelector() に統一 するパターンが多いです。理由は：

```js
// querySelector に統一すると、セレクタの種類が変わっても書き方が一貫する
const price = document.querySelector("#price"); // id
const buttons = document.querySelectorAll(".btn"); // class
const selected = document.querySelector("[data-active]"); // 属性

// getElementById だと、取得方法がバラバラになる
const price = document.getElementById("price"); // id
const buttons = document.getElementsByClassName("btn"); // class
const selected = document.querySelector("[data-active]"); // 属性
```

querySelector / querySelectorAll に統一した方が、CSSセレクタの知識だけで全パターンに対応できるので、コードの一貫性が保てます。