# JavaScript 実践 イベント

[DOM イベント](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Events)

## イベント発生時の処理の登録

要素には、クリックやマウスオーバーなど各種イベントが起きた時の処理を登録できる

```js
document.querySelector('#exec').addEventListener('click', () => {
  // クリック時の処理
});
```

## イベントリスナーとは

**「特定のイベントが起きたときに実行する関数」**のことです。

日常で例えると：

玄関のチャイムが鳴ったら → ドアを開ける

これをJavaScriptに置き換えると：

ボタンがクリックされたら → 計算処理を実行する

この「計算処理を実行する関数」がイベントリスナーです。

イベントを登録するとは

addEventListener で **「何が起きたら、何をするか」をブラウザに伝える**ことです。

```js
taxForm.addEventListener("submit", (event) => {
  // 計算処理
 });
```

taxForm          → taxFormに対して
.addEventListener → イベントリスナーを登録するよ
("submit",       → 監視するイベントは「submit」で、
(event) => {     → それが起きたらこの関数を実行してね
// 計算処理     → 実行する内容は計算処理だよ

この1文で、ブラウザに対してこう伝えています：

- 対象:  taxForm（フォーム要素）
- いつ:  "submit"（送信されたとき）
- 何を:  この関数を実行して

登録した後は、ブラウザがずっと監視してくれます。 ユーザーがボタンを押すたびに、登録した関数が自動的に呼ばれます。

今回の main.js での流れ

1. ページが読み込まれる
2. addEventListener でイベントを登録する（この時点では関数は実行されない）
3. ユーザーが「計算する」ボタンを押す
4. ブラウザが「submitイベントだ」と検知する
5. 登録しておいた関数が実行される
6. 結果が画面に表示される

ポイントは 2の時点では何も起きない ということです。あくまで「こうなったらこうして」という予約をしているだけで、実際にイベントが発生したときに初めて関数が呼ばれます。

## reset イベント

reset イベントの実行タイミング

reset イベントは**フォームがリセットされる「直前」**に発火します。つまり、イベントハンドラの中ではまだ入力欄の値はリセット前の状態です。

```html
...
  <div class="m-auto max-w-sm p-4">
    <h1 class="text-2xl font-bold mb-6">02-01 税込価格計算</h1>
    <form id="tax-form" class="form grid gap-6">
      <div class="grid gap-2 mb-1">
        <label for="price" class="form-label text-base">税抜価格 (円)</label>
        <input type="number" class="form-control" id="price" min="1" step="1" required>
      </div>
      <div class="grid gap-2 mb-1">
        <label for="tax-rate" class="form-label text-base">消費税率 (%)</label>
        <select id="tax-rate" class="select w-[180px]">
          <option value="8">8%</option>
          <option value="10">10%</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary font-bold text-base bg-sky-600">計算する</button>
      <button type="reset" class="btn btn-secondary font-bold text-base text-white bg-neutral-500">リセット</button>
    </form>
    <div id="result" class="mt-6 p-4 border border-sky-300 rounded">
      <h2 class="text-xl font-semibold mb-2 text-center text-sky-600">結果</h2>
      <p id="tax-in-price" class="text-xl text-center font-bold"></p>
  </div>
...
```

```js
taxForm.addEventListener("reset", (event) => {
  // この時点ではまだ priceInput.value は入力済みの値が残っている
  console.log(priceInput.value); // → リセット前の値

  // リセット「後」に処理したい場合は setTimeout を使う
  setTimeout(() => {
    console.log(priceInput.value); // → リセット後の値（空）
  });
});
```

今回のケースだと、結果欄（taxInPrice.textContent）をクリアしたいはずなので、こう書けます。

```js
taxForm.addEventListener("reset", () => {
  taxInPrice.textContent = "";
});
```

これは入力欄のリセットとは無関係なので、タイミングの問題は発生しません。入力欄のリセットは type="reset" ボタンがブラウザ側で自動的にやってくれます。

> reset イベントは**フォームがリセットされる「直前」**に発火します。つまり、イベントハンドラの中ではまだ入力欄の値はリセット前の状態です。

↑この文章の意味(**フォームがリセットされる「直前」**に発火する、ということ)

ブラウザの処理の流れ

リセットボタンが押されると、ブラウザは2つのステップを順番に実行します

1. reset イベントのハンドラを実行する（あなたが書いた処理）
2. 入力欄を空にする（ブラウザが自動でやる処理）

つまり あなたのコードが先に動き、その後にブラウザが入力欄をクリアする という順番です。

```js
taxForm.addEventListener("reset", () => {
  // ステップ1: ここが先に実行される
  // この時点ではブラウザはまだ入力欄をクリアしていない
  console.log(priceInput.value); // → "1000"（入力した値がまだ残っている）

  // リセット「後」に処理したい場合は setTimeout を使う
  setTimeout(() => {
    console.log(priceInput.value); // → リセット後の値（空）
  });
});
// ステップ2: ハンドラの実行が終わった後、ブラウザが入力欄を空にする
// → priceInput.value が "" になる
```

ただし、もし「リセット後の入力値を使って何かしたい」という場面があった場合、ハンドラ内で priceInput.value を見てもまだ古い値が入っているので注意が必要、という意味でした。

今回の用途（結果欄のクリア）では影響しません。

```js
taxForm.addEventListener("reset", () => {
  taxInPrice.textContent = "";  // これは問題なく動く
});
```

## イベントハンドラに渡される引数

event はイベントハンドラに自動的に渡される引数です。使うかどうかに関わらず、常に渡されています。

```js
// event を受け取るが、使わない → 書かなくてよい
taxForm.addEventListener("reset", () => {
  taxInPrice.textContent = "";  // これは問題なく動く
});

// event を受け取って、使う → 書く必要がある
taxForm.addEventListener("reset", (event) => {
  event.preventDefault(); // リセットを中止する等
  taxInPrice.textContent = "";
});
```

submit のときに event が必要だった理由

```js
taxForm.addEventListener("submit", (event) => {
  event.preventDefault(); // ← event を使っている
});
// submit では event.preventDefault() を呼んでページ遷移を防ぐ必要があったので、event を受け取る必要がありました
```

基準はシンプル

- event オブジェクトを使うなら書く
- event オブジェクトを使わないなら省略できる

JavaScriptの関数は、渡された引数を受け取らなくてもエラーになりません。これは reset に限らず、すべてのイベントリスナーで同じです。