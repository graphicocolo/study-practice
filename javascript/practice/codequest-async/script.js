// コードの構成
// 1. HTML要素を取得
// 2. 変数・初期値を定義
// 3. 関数を定義
// 4. イベントリスナー

// 1. HTML要素を取得
/** @type {HTMLButtonElement | null} */
const getApiWithPromiseButton = document.querySelector("#btn1");

// 2. 変数・初期値を定義

// 3. 関数を定義
// 自分の解答
// const fetchTodos = fetch("https://jsonplaceholder.typicode.com/todos?userId=1&id=1")
const fetchTodos = fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => {
    if (!response.ok) {
      throw new Error("エラー");
    }
    return response.json();
  })
  .then(data => {
    return data.title;
  })
  .catch(error => {
    console.error(error);
  })

// 4. イベントリスナー
// 自分の解答
// この書き方だと、fetchTodos の定義箇所で fetch したデータを使い回す
getApiWithPromiseButton.addEventListener("click", () => {
  // alert(fetchTodos);
  //  [object Promise] と表示されてしまう
  // alert(fetchTodos.then(title => title));
  //  [object Promise] と表示されてしまう
  // .then()という関数自体の戻り値は常にPromiseなので、titleは戻ってこず、Promiseという箱だけが返ってくる
  fetchTodos.then(title => alert(title));
  // 戻ってきたデータの中身に触れらるのはコールバック関数の内側だけ
})
// 解答
// この書き方だと、ボタンをクリックするたびにfetchでデータを呼び出している
// getApiWithPromiseButton.addEventListener("click", () =>{
//   fetch('https://jsonplaceholder.typicode.com/todos/1')
//     .then(response => response.json())
//     .then(data => {
//       alert('タイトル: ' + data.title);
//     })
//     .catch(error => {
//       alert('エラーが発生しました');
//     });
// });