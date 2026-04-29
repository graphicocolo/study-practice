// コードの構成
// 1. HTMLの要素を取得
// 2. フォームの送信イベントを処理して、ローカルストレージにデータを保存
// 3. ページが読み込まれたときにローカルストレージからデータを読み込んで表示する
// 4. フォームのリセットイベントを処理して、ローカルストレージからデータを削除する

// HTML要素を取得
/** @type {HTMLTextAreaElement | null} */ 
const memoInput = document.querySelector('#memo');
/** @type {HTMLFormElement | null} */ 
const memoForm = document.querySelector("#memo-form");
/** @type {HTMLParagraphElement | null} */
const statusMessage = document.querySelector("#status");

// ここに早期リターンがあっても良い
// 書き方1
// if (!memoInput || !memoForm || !statusMessage) {
//   console.error("必要なHTML要素が見つかりませんでした");
//   // 必要な要素がない場合はこれ以上処理を続けない
//   throw new Error("必要なHTML要素が見つかりませんでした");
// ↑例外を投げてスクリプト全体を停止。ブラウザの DevTools コンソールに赤いエラーとしてスタックトレース付きで表示される
// }
// 書き方2
// if (!memoInput || !memoForm || !statusMessage) {
//   console.error("必要なHTML要素が見つかりませんでした");
//   // 必要な要素がない場合はこれ以上処理を続けない
//   return;
// return の場合、構文エラーとなる（このコードがトップレベル（関数の外）にあるため）
// }

// 書き方2の場合、ここはスクリプトのトップレベル（module スコープ）なので関数の中ではない。トップレベルでは return は使えないため、ここで処理を止めたい場合は throw が唯一の手段となる

// フォームが送信されたときの処理
memoForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  const memo = memoInput.value; // 入力されたメモの内容を取得
  if (!memo) {
    statusMessage.textContent = "メモが入力されていません"; // ステータスメッセージを表示
    return; // メモが空の場合は保存せずに終了
  }
  try {
    localStorage.setItem("memo", memo); // ローカルストレージにデータを保存
    statusMessage.textContent = "メモを保存しました"; // ステータスメッセージを表示
  } catch (error) {
    statusMessage.textContent = "メモの保存に失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージへの保存に失敗しました:", error); // エラーをコンソールに表示
  }
});

// ページが読み込まれたときにローカルストレージからデータを読み込んで表示する
window.addEventListener("DOMContentLoaded", () => {
  try {
    const savedMemo = localStorage.getItem("memo"); // ローカルストレージからデータを取得
    memoInput.value = savedMemo ?? ""; // テキストエリアに保存されたメモを表示
    savedMemo !== null ? statusMessage.textContent = "保存されたメモを読み込みました" : statusMessage.textContent = "保存されたメモはありません"; // ステータスメッセージを表示
  } catch (error) {
    statusMessage.textContent = "メモの読み込みに失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージからの読み込みに失敗しました:", error); // エラーをコンソールに表示
  }
});

// フォームのリセットイベントを処理
memoForm.addEventListener("reset", () => {
  try {
    localStorage.removeItem("memo"); // ローカルストレージからデータを削除
    statusMessage.textContent = "メモを削除しました"; // ステータスメッセージを表示
  } catch (error) {
    statusMessage.textContent = "メモの削除に失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージからの削除に失敗しました:", error); // エラーをコンソールに表示
  }   
});