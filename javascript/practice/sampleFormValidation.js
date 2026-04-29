// フォームのバリデーション
// Constraint Validation APIを使用して、フォームの入力値を検証する例

// コードの構成
// 1. HTMLの要素を取得
// 2. バリデーションを設定
// 3. フォームのリセットイベントをキャッチして、各入力欄をクリアする

// HTML要素を取得
/** @type {HTMLInputElement | null} */ 
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
/** @type {HTMLFormElement | null} */
const form = document.querySelector("#validateForm");
/** @type {HTMLParagraphElement | null} */
const resultText = document.querySelector("#result-text");

// 入力フィールドの情報をオブジェクトの配列としてまとめる
const inputFields = [
  { element: usernameInput, name: "ユーザー名" },
  { element: emailInput, name: "メールアドレス" },
  { element: passwordInput, name: "パスワード" }
];

/**
 * バリデーションメッセージを設定
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "ユーザー名", "メールアドレス"）
 * @returns {void}
 */
function setValidationMessage(element, fieldName) {
  if (element.validity.valueMissing) {
    element.setCustomValidity(`${fieldName}は必須項目です`);
  } else if (element.validity.typeMismatch) {
    element.setCustomValidity(`${fieldName}の形式が正しくありません`);
  } else {
    element.setCustomValidity(""); // バリデーションOK時は空文字にリセット
  }
}

// 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新
inputFields.forEach(({ element, name }) => {
  element.addEventListener("input", () => setValidationMessage(element, name));
});

// フォームが送信されたときの処理
form.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  // フォームが有効な場合は、入力された値を表示
  if (form.checkValidity()) {
    resultText.textContent = `ユーザー名: ${usernameInput.value}, メールアドレス: ${emailInput.value}`;
  } else {
    resultText.textContent = ""; // バリデーションエラーがある場合は結果をクリア
  }
});

// フォームがリセットされたときの処理
form.addEventListener("reset", () => {
  resultText.textContent = ""; // 結果欄をクリア
});