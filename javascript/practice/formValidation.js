// フォームのバリデーション
// study-archive/javascript/javascript-formandvalidation.md の課題

// コードの構成
// 1. HTMLの要素を取得
// 2. 入力フィールドとエラーメッセージ欄をオブジェクトの配列としてまとめる
// 3. バリデーション関数を定義する（ユーザー名、メールアドレス、パスワードのバリデーション）
// 4. 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新する
// 5. フォームの送信イベントをキャッチして、全てのバリデーションがOKなら結果欄に成功メッセージを表示し、入力欄をクリアする。バリデーションNGなら結果欄は空にする
// 6. フォームのリセットイベントをキャッチして、各入力欄をクリアする

// HTML要素を取得
/** @type {HTMLInputElement | null} */ 
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
/** @type {HTMLFormElement | null} */
const form = document.querySelector("#validateForm");
/** @type {HTMLParagraphElement | null} */
const usernameError = document.querySelector("#username-error");
/** @type {HTMLParagraphElement | null} */
const emailError = document.querySelector("#email-error");
/** @type {HTMLParagraphElement | null} */
const passwordError = document.querySelector("#password-error");
/** @type {HTMLParagraphElement | null} */
const resultText = document.querySelector("#result-text");

// 入力フィールドの情報をオブジェクトの配列としてまとめる
const inputFields = [
  { element: usernameInput, name: "ユーザー名" },
  { element: emailInput, name: "メールアドレス" },
  { element: passwordInput, name: "パスワード" }
];

// バリデーションメッセージ欄をオブジェクトの配列としてまとめる
const errorFields = [
  { errorElement: usernameError },
  { errorElement: emailError },
  { errorElement: passwordError }
];

// valueMissingは、required属性があるinputで、値が入力されていない場合にtrueになる
// 今回のように、required属性をHTML側で設定せず、JavaScriptでバリデーションを行う場合は、valueMissingは使えない。setCustomValidityも同様。
/**
 * バリデーションメッセージを設定
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "ユーザー名", "メールアドレス"）
 * @returns {void}
 */
// function setValidationMessage(formElement, fieldName, errorElement) {
//   if (formElement.validity.valueMissing) {
//     errorElement.textContent = `${fieldName}は必須項目です`;
//     return;
//   }
//   return true;
// }

/**
 * 空文字バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @param {string} fieldName フィールド名（例: "ユーザー名", "メールアドレス"）
 * @param {HTMLParagraphElement} errorElement エラーメッセージを表示する  要素
 * @returns {boolean} バリデーション結果
 */
function validateNotEmpty(element, fieldName, errorElement) {
  if (element.value.trim() === "") {
    errorElement.textContent = `${fieldName}を入力してください`;
    return false;
  }
  return true;
}

/**
 * ユーザー名バリデーション
 * @returns {boolean} バリデーション結果
 */
function validateUsername() {
  // setValidationMessage関数を使う場合は、以下のように呼び出す（今回は使用しない）
  // const emptyResult = setValidationMessage(usernameInput, "ユーザー名", usernameError);
  // if (emptyResult !== true) return false;
  if (!validateNotEmpty(usernameInput, "ユーザー名", usernameError)) return false;
  if (usernameInput.value.length < 3) {
    usernameError.textContent = "ユーザー名は3文字以上で入力してください";
    return false;
  }
  // 一度エラーを出した後、修正して再送信すると成功してもエラーメッセージが残るため、バリデーションOK時はエラーメッセージをクリアする
  usernameError.textContent = ""; // バリデーションOK時はエラーメッセージをクリア
  return true;
}

/**
 * メールアドレスバリデーション
 * @returns {boolean} バリデーション結果
 */
function validateEmail() {
  if (!validateNotEmpty(emailInput, "メールアドレス", emailError)) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    emailError.textContent = "有効なメールアドレスを入力してください";
    return false;
  }
  emailError.textContent = ""; // バリデーションOK時はエラーメッセージをクリア
  return true;
}

/**
 * パスワードバリデーション
 * @returns {boolean} バリデーション結果
 */
function validatePassword() {
  if (!validateNotEmpty(passwordInput, "パスワード", passwordError)) return false;
  if (passwordInput.value.length < 8) {
    passwordError.textContent = "パスワードは8文字以上で入力してください";
    return false;
  }
  passwordError.textContent = ""; // バリデーションOK時はエラーメッセージをクリア
  return true;
}

// 入力イベントリスナーを追加して、リアルタイムでバリデーションメッセージを更新
// ↓冗長な書き方
// usernameInput.addEventListener("blur", () => validateUsername());
usernameInput.addEventListener("blur", validateUsername);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

// フォームが送信されたときの処理
form.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームのデフォルトの送信を防止、ページ遷移を防止

  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (isUsernameValid && isEmailValid && isPasswordValid) {
    resultText.textContent = "登録が完了しました！";
    inputFields.forEach(({ element }) => {
      element.value = ""; // 入力欄をクリア
    });
  } else {
    resultText.textContent = "";
  }
});

// フォームがリセットされたときの処理
form.addEventListener("reset", () => {
  inputFields.forEach(({ element }) => {
    if (element.value !== "") {
      element.value = ""; // 入力欄をクリア
    }
  });
  errorFields.forEach(({ errorElement }) => {
    if (errorElement.textContent !== "") {
      errorElement.textContent = ""; // エラーメッセージ欄をクリア
    }
  });
  if (resultText.textContent !== "") {
    resultText.textContent = ""; // 結果欄をクリア
  }
  return;
});