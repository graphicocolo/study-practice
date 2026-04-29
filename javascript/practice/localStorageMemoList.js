// コードの構成
// 1. HTMLの要素を取得
// 2. フォームの送信イベントを処理して、ローカルストレージにデータを保存
// 3. ページが読み込まれたときにローカルストレージからデータを読み込んで表示する
// 4. フォームのリセットイベントを処理して、ローカルストレージからデータを削除する
// 考え方のポイント：ローカルストレージのデータとUIのリストアイテムは別物なので、両方を適切に管理する必要がある（何となく同じデータが反映されるように考えてしまうが、別物なのでそれぞれに対して追加したり削除したりする必要がある）

// HTML要素を取得
/** @type {HTMLTextAreaElement | null} */ 
const memoInput = document.querySelector('#memo');
/** @type {HTMLFormElement | null} */ 
const memoForm = document.querySelector("#memo-form");
/** @type {HTMLParagraphElement | null} */
const statusMessage = document.querySelector("#status");
/** @type {HTMLUListElement | null} */
const memoList = document.querySelector("#memo-list");

if (!memoInput || !memoForm || !statusMessage || !memoList) {
  console.error("必要なHTML要素が見つかりませんでした");
  throw new Error("必要なHTML要素が見つかりませんでした");
}

// ローカルストレージにメモを保存する関数
function saveMemoToLocalStorage(memo) {
  try {
    const savedMemos = localStorage.getItem("memos");
    const memos = savedMemos ? JSON.parse(savedMemos) : []; // 既存のメモをJSONから配列に変換、なければ空の配列を使用
    memos.push(memo); // 新しいメモを配列に追加
    localStorage.setItem("memos", JSON.stringify(memos)); // 配列をJSONに変換してローカルストレージに保存
    statusMessage.textContent = "メモを保存しました"; // ステータスメッセージを表示
  } catch (error) {
    statusMessage.textContent = "メモの保存に失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージへの保存に失敗しました:", error); // エラーをコンソールに表示
  }
}

// メモをリストに追加する関数
function addMemoToList(memo) {
  const listItem = document.createElement("li"); // 新しいリストアイテムを作成
  listItem.textContent = memo; // リストアイテムにメモの内容を設定
  const deleteButton = document.createElement("button"); // 削除ボタンを作成
  deleteButton.textContent = "削除"; // 削除ボタンのテキストを設定
  deleteButton.classList.add("btn", "btn-danger", "mt-2", "ml-2"); // 削除ボタンにクラスを追加
  deleteButton.addEventListener("click", () => {
    const index = Array.from(memoList.children).indexOf(listItem); // リストアイテムのインデックスを取得
    deleteMemoFromLocalStorage(index); // ローカルストレージからメモを削除
    listItem.remove(); // リストからメモを削除
  });
  listItem.appendChild(deleteButton); // 削除ボタンをリストアイテムに追加
  memoList.appendChild(listItem); // メモリストにリストアイテムを追加
}

// 特定のインデックスのメモをローカルストレージから削除する関数
function deleteMemoFromLocalStorage(index) {
  try {
    const savedMemos = localStorage.getItem("memos");
    if (savedMemos) {
      const memos = JSON.parse(savedMemos); // 既存のメモをJSONから配列に変換
      if (index >= 0 && index < memos.length) {
        memos.splice(index, 1); // 指定されたインデックスのメモを配列から削除
        localStorage.setItem("memos", JSON.stringify(memos)); // 配列をJSONに変換してローカルストレージに保存
        statusMessage.textContent = "メモを削除しました"; // ステータスメッセージを表示
      }
    }
  } catch (error) {
    statusMessage.textContent = "メモの削除に失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージからの削除に失敗しました:", error); // エラーをコンソールに表示
  }
}

// ローカルストレージのデータをリストに表示する関数
function displayMemosFromLocalStorage() {
  try {
    const savedMemos = localStorage.getItem("memos");
    const memos = savedMemos ? JSON.parse(savedMemos) : [];
    if (memos.length > 0) {
      memos.forEach((memo) => {
        addMemoToList(memo); // 各メモをリストに追加
      });
    } else {
      statusMessage.textContent = "保存されたメモはありません"; // ステータスメッセージを表示
    }
  } catch (error) {
    statusMessage.textContent = "メモの読み込みに失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージからの読み込みに失敗しました:", error); // エラーをコンソールに表示
  }
}

// フォームが送信されたときの処理
memoForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  const memo = memoInput.value; // 入力されたメモの内容を取得
  if (!memo) {
    statusMessage.textContent = "メモが入力されていません"; // ステータスメッセージを表示
    return; // メモが空の場合は保存せずに終了
  }
  saveMemoToLocalStorage(memo); // メモをローカルストレージに保存
  addMemoToList(memo); // メモをリストに追加
  memoInput.value = ""; // 入力フィールドをクリア
});

// ページが読み込まれたときにローカルストレージからデータを読み込んで表示する
window.addEventListener("DOMContentLoaded", () => {
  displayMemosFromLocalStorage(); // ローカルストレージのデータをリストに表示
});

// フォームのリセットイベントを処理
memoForm.addEventListener("reset", () => {
  if (memoList.children.length === 0) {
    statusMessage.textContent = "削除するメモがありません"; // ステータスメッセージを表示
    return; // メモがない場合は削除せずに終了
  }
  try {
    localStorage.removeItem("memos"); // ローカルストレージからデータを削除
    while (memoList.firstChild) {
      memoList.removeChild(memoList.firstChild); // メモリストから全ての子要素を削除
    }
    statusMessage.textContent = "メモを全て削除しました"; // ステータスメッセージを表示
  } catch (error) {
    statusMessage.textContent = "メモの削除に失敗しました"; // ステータスメッセージを表示
    console.error("ローカルストレージからの削除に失敗しました:", error); // エラーをコンソールに表示
  }   
});