// コードの構成
// 1. HTML要素を取得
// 2. 変数・初期値を定義
// 3. 関数を定義
// 4. イベントリスナー

// 1. HTML要素を取得
/** @type {HTMLButtonElement | null} */
const getApiWithPromiseButton = document.getElementById("btn1");
/** @type {HTMLButtonElement | null} */
const getApiWithAsyncButton = document.getElementById("btn2");
/** @type {HTMLButtonElement | null} */
const errorHandlingButton = document.getElementById("btn3");
/** @type {HTMLButtonElement | null} */
const getMultipleApiData = document.getElementById("btn4");
/** @type {HTMLButtonElement | null} */
const getSimultaneousApiData = document.getElementById("btn5");
/** @type {HTMLButtonElement | null} */
const getDelayApiData = document.getElementById("btn6");
/** @type {HTMLParagraphElement | null} */ 
const displayText6 = document.getElementById("msg6");

// 2. 変数・初期値を定義

// 3. 関数を定義
// fetchでAPIからデータ取得（Promise） 自分の解答
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
// fetchでAPIからデータ取得（Promise） 自分の解答
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
// fetchでAPIからデータ取得（Promise） 解答
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

// async/awaitでAPI取得 自分の解答
getApiWithAsyncButton.addEventListener("click", async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!response.ok) {
      throw new Error("エラー：レスポンスが返ってきませんでした");
    }
    const data = await response.json();
    alert(data.title);
  } catch (error) {
    alert(error);
  }
});

// async/awaitでAPI取得 解答
// document.getElementById('btn2').addEventListener('click', async () => {
//   try {
//     const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//     const data = await response.json();
//     alert('タイトル: ' + data.title);
//   } catch (error) {
//     alert('エラーが発生しました');
//   }
// });

// ネットワークエラーをハンドリング 自分の解答
// 存在しないURLにリクエストを送り、エラーをキャッチして適切に処理
errorHandlingButton.addEventListener("click", async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/invalid-url/");
    if (!response.ok) {
      throw new Error("レスポンスがありませんでした");
    }
    const data = await response.json();
    console.log(`取得データ${data}`);
  } catch(error) {
    console.error(`エラー：${error.message}`);
  }
})

// ネットワークエラーをハンドリング 解答
// document.getElementById('btn3').addEventListener('click', () => {
//   fetch('https://jsonplaceholder.typicode.com/invalid-url')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('レスポンスエラー');
//       }
//       return response.json();
//     })
//     .then(data => console.log(data))
//     .catch(error => {
//       alert('エラー: ' + error.message);
//     });
// });

// 複数のAPIを順番に取得する 自分の解答
getMultipleApiData.addEventListener("click", async () => {
  try {
    const response1 = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response1.ok) {
      throw new Error("レスポンス1がありませんでした");
    }
    const data1 = await response1.json();
    console.log(`レスポンス1：${data1.name}`);
    const response2 = await fetch("https://jsonplaceholder.typicode.com/users/2");
    if (!response2.ok) {
      throw new Error("レスポンス2がありませんでした");
    }
    const data2 = await response2.json();
    console.log(`レスポンス2：${data2.name}`);
  } catch(error) {
    console.error(error.message);
  }
});

// 複数のAPIを順番に取得する 解答
// document.getElementById('btn4').addEventListener('click', async () => {
//   try {
//     const response1 = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//     const data1 = await response1.json();
//     const response2 = await fetch('https://jsonplaceholder.typicode.com/todos/2');
//     const data2 = await response2.json();
//     alert(`1: ${data1.title}\n2: ${data2.title}`);
//   } catch (error) {
//     alert('取得失敗');
//   }
// });

// Promise.allで同時に取得 自分の解答
getSimultaneousApiData.addEventListener("click", () => {
  // ヒント1: fetch()自体がすでにPromiseを返すので、new Promise()で包む必要はない
  // ヒント2: fetch(...).json() はエラーになる。.json()はfetch()が解決した後のResponseオブジェクトのメソッド。
  //          → fetch(...).then(res => res.json()) のようにResponseを受け取ってから.json()を呼ぶ
  const promise1 = fetch("https://jsonplaceholder.typicode.com/todos/1").then(response => response.json());
  const promise2 = fetch("https://jsonplaceholder.typicode.com/todos/2").then(response => response.json());

  // ヒント3: Promise.all().then(values => ...) の values は「各Promiseが解決した値の配列」
  //          promise1.title のようにPromiseオブジェクトから直接読むことはできない
  //          → values[0].title, values[1].title のように取り出す
  Promise.all([promise1, promise2]).then(values => {
    console.log(`同時取得：${values[0].title + values[1].title}`);
  });
});

// Promise.allで同時に取得 解答
// document.getElementById('btn5').addEventListener('click', async () => {
//   try {
//     const [response1, response2] = await Promise.all([
//       fetch('https://jsonplaceholder.typicode.com/todos/1'),
//       fetch('https://jsonplaceholder.typicode.com/todos/2')
//     ]);
//     const data1 = await response1.json();
//     const data2 = await response2.json();
//     alert(`1: ${data1.title}\n2: ${data2.title}`);
//   } catch (error) {
//     alert('取得エラー');
//   }
// });

// setTimeoutで遅延表示 自分の解答
getDelayApiData.addEventListener("click", async () =>{
  displayText6.textContent = "3秒お待ちください...";
  setTimeout(() => {
    displayText6.textContent = "こんにちは";
  }, 3000);
});

// setTimeoutで遅延表示 解答
// document.getElementById('btn6').addEventListener('click', () => {
//   document.getElementById('msg6').textContent = '3秒待ってください...';
//   setTimeout(() => {
//     document.getElementById('msg6').textContent = 'こんにちは！';
//   }, 3000);
// });