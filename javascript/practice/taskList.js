// コードの構成
// 1. HTML要素を取得
// 2. リストデータとなる配列を用意
// 3. 各関数を作成
//  - submit ボタン状態の切り替え setSubmitEnabled()
//  - 空文字バリデーション validateNotEmpty()
//  - 配列の内容をHTMLに反映 renderTasks()
//  - 新しいタスクを配列に追加 addTask()
//  - 配列からタスクを削除する関数を作成 removeTask()
//  - タスクの完了状態を切り替える toggleTaskDone()（オプション）
// 4. イベントリスナー
//  - DOMContentLoaded
//  - blur
//  - input
//  - submit
//  - reset

// HTML要素を取得
/** @type {HTMLTextAreaElement | null} */ 
const taskInput = document.querySelector('#task-input');
/** @type {HTMLFormElement | null} */ 
const taskForm = document.querySelector("#task-form");
/** @type {HTMLButtonElement | null} */
const submitButton = document.querySelector("button[type='submit']");
/** @type {HTMLButtonElement | null} */
const resetButton = document.querySelector("button[type='reset']");
/** @type {HTMLParagraphElement | null} */
const taskInputError = document.querySelector("#task-input-error");
/** @type {HTMLDivElement | null} */
const displayList = document.querySelector("#display-list");

// リストデータを格納する配列
// const だと再代入できないため、let にする
const initialTasks = [
  { id: 1, title: "牛乳を買う", done: false },
  { id: 2, title: "コードを書く", done: true },
  { id: 3, title: "散歩する", done: false },
];
let tasks = [...initialTasks];

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

/**
 * submit ボタン状態の切り替え
 * @param {boolean} enabled 活性化状態かどうか
 */
function setSubmitEnabled(enabled) {
  submitButton.disabled = !enabled;
  submitButton.classList.toggle("bg-gray-400", !enabled);
  submitButton.classList.toggle("cursor-not-allowed", !enabled);
  submitButton.classList.toggle("bg-sky-600", enabled);
  submitButton.classList.toggle("cursor-pointer", enabled);
}
setSubmitEnabled(false); // 初期状態は非活性化

/**
 * 空文字バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @returns {boolean} バリデーション結果
 */
// function validateNotEmpty(element, errorElement) {
//   if (element.value.trim() === "") {
//     errorElement.textContent = "タスクタイトルを入力してください";
//     return false;
//   }
//   return true;
// }
// ↓判定結果だけを返す関数に修正
function validateNotEmpty(element) {
  return element.value.trim() !== "";
}

/**
 * 配列の内容をHTMLに反映する関数
 * @param {Array} array オブジェクトの配列
 */
function renderTasks(array) {
  displayList.replaceChildren(); // 既存のリストをクリア
  if (array.length === 0) {
    return;
  }
  // ul 要素を作成
  const taskList = document.createElement("ul");
  displayList.appendChild(taskList);
  array.forEach((task) => {
    // li 要素を作成して、タスクのタイトルを表示する
    const taskItem = document.createElement("li");
    taskItem.setAttribute("data-id", task.id);
    taskItem.setAttribute("class", "p-2 border-b-1 flex justify-between items-center");
    const taskTextItem = document.createElement("div");
    taskItem.appendChild(taskTextItem);
    const taskInnerText = document.createElement("span");
    taskInnerText.setAttribute("class", "mr-2");
    task.done && taskInnerText.setAttribute("style", "text-decoration: line-through;");
    taskInnerText.textContent = task.title;
    taskTextItem.appendChild(taskInnerText);
    const taskButtonItem = document.createElement("div");
    taskItem.appendChild(taskButtonItem);
    // 完了状態を切り替えるボタンを作成して、li 要素に追加する
    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("class", "btn btn-primary btn-sm txt-white txt-xs bg-green-700 font-bold mr-2");
    toggleButton.textContent = task.done ? "未完了にする" : "完了にする";
    toggleButton.addEventListener("click", () => {
      toggleTaskDone(task.id);
    });
    taskButtonItem.appendChild(toggleButton);
    // 削除するボタンを作成して、li 要素に追加する
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger btn-sm txt-white txt-xs bg-red-700 font-bold");
    deleteButton.textContent = "削除する";
    deleteButton.addEventListener("click", () => {
      removeTask(task.id);
    });
    taskButtonItem.appendChild(deleteButton);
    // 作成した li 要素を ul 要素に追加する
    taskList.appendChild(taskItem);
  });
}

/**
 * 新しいタスクを配列に追加する関数
 * @param {string} title タスクタイトル
 */
function addTask(title) {
  const newTask = {
    id: Date.now(), // ユニークなIDを生成（簡易的な方法）
    title: title,
    done: false,
  };
  tasks = [newTask, ...tasks ]; // 既存のタスクに新しいタスクを追加
  renderTasks(tasks); // タスクを追加した後にリストを再描画
}

/**
 * 配列からタスクを削除する関数
 * @param {number} id タスクID
 */
function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id); // 削除するタスク以外を新しい配列にする
  renderTasks(tasks); // タスクを削除した後にリストを再描画
}

/**
 * タスクの完了状態を切り替える関数
 * @param {number} id タスクID
 */
function toggleTaskDone(id) {
  // {} で関数ブロックを書いた場合は明示的に return が必要です。このままだと全タスクが undefined になります。  
  // tasks = tasks.map((task) => {
  //   task.id === id ? { ...task, done: !task.done } : task
  // });
  // {}をこのまま使う場合は下記のように return を追記する
  // tasks = tasks.map((task) => {
  //   return task.id === id ? { ...task, done: !task.done } : task
  // });
  tasks = tasks.map((task) => 
    task.id === id ? { ...task, done: !task.done } : task
  );
  renderTasks(tasks); // タスクの完了状態を切り替えた後にリストを再描画
}

// ページが読み込まれたときに配列の内容をHTMLに反映
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(tasks);
});

// blur イベント
// macOS ではボタンクリック時に relatedTarget が null になるため、mousedown フラグで代替する
let isResetClicking = false;
resetButton.addEventListener("mousedown", () => { isResetClicking = true; });
resetButton.addEventListener("mouseup", () => { isResetClicking = false; });
taskInput.addEventListener("blur", () => {
  if (isResetClicking) return;
  // validateNotEmpty(taskInput) ? setSubmitEnabled(true) : taskInputError.textContent = "タスクタイトルを入力してください";
  const isValid = validateNotEmpty(taskInput);
  taskInputError.textContent = isValid ? "" : "タスクタイトルを入力してください";
  setSubmitEnabled(isValid);
});
// input イベント
taskInput.addEventListener("input", () => {
  if (taskInputError.textContent !== "") {
    taskInputError.textContent = "";
  }
  const isValid = validateNotEmpty(taskInput);
  taskInputError.textContent = isValid ? "" : "タスクタイトルを入力してください";
  setSubmitEnabled(isValid);
});

// フォームの送信イベントを処理
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  addTask(taskInput.value);
  taskInput.value = ""; // 入力フィールドをクリア
  setSubmitEnabled(false); // 非活性化
});

// フォームのリセットイベントを処理
// blur イベント直後に直接リセットボタンをクリックすると一瞬エラーメッセージが表示されてしまう
taskForm.addEventListener("reset", () => {
  taskInputError.textContent = "";
  setSubmitEnabled(false); // 非活性化
  tasks = [...initialTasks]; // タスクの配列を初期化
  renderTasks(tasks);
});