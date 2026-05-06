import { API_KEY } from "./constants.js";
// コードの構成
// 1. HTML要素を取得
// 2. API呼び出し
// 3. 各関数を作成
//  - submit ボタン状態の切り替え setSubmitEnabled()
//  - 天気エリア表示判定 weatherDisplayIsVisible()
//  - 空文字バリデーション validateNotEmpty()
//  - ステータスバリデーション notIsValidateStatus()
// 4. イベントリスナー
//  - input
//  - blur
//  - submit
//  - reset

// 1. HTML要素を取得
/** @type {HTMLTextAreaElement | null} */ 
const cityInput = document.querySelector('#city-input');
/** @type {HTMLParagraphElement | null} */
const cityInputError = document.querySelector('#city-input-error');
/** @type {HTMLFormElement | null} */ 
const weatherForm = document.querySelector("#weather-form");
/** @type {HTMLButtonElement | null} */
const submitButton = document.querySelector("button[type='submit']");
/** @type {HTMLButtonElement | null} */
const resetButton = document.querySelector("button[type='reset']");
/** @type {HTMLDivElement | null} */
const weatherDisplayElement = document.querySelector('#display-weather');
/** @type {HTMLParagraphElement | null} */
const cityNameElement = document.querySelector('#city-name');
/** @type {HTMLParagraphElement | null} */
const weatherConditionElement = document.querySelector('#weather-condition');
/** @type {HTMLParagraphElement | null} */
const temperatureElement = document.querySelector('#temperature');
/** @type {HTMLImageElement | null} */
const weatherIconElement = document.querySelector('#weather-icon');

// 2. API呼び出し
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      notIsValidateStatus();
      throw new Error(`レスポンスステータス: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("エラー:", error);
  }
}

// 3. 各関数を作成
/**
 * submit ボタン状態の切り替え
 * @param {boolean} enabled 活性化状態かどうか
 */
function setSubmitEnabled(enabled) {
  submitButton.disabled = !enabled;
  submitButton.classList.toggle("bg-gray-400", !enabled);
  submitButton.classList.toggle("cursor-not-allowed", !enabled);
  submitButton.classList.toggle("bg-gray-800", enabled);
  submitButton.classList.toggle("cursor-pointer", enabled);
}
setSubmitEnabled(false); // 初期状態は非活性化

/**
 * 天気エリア表示判定
 * @returns {boolean} 判定結果
 */
function weatherDisplayIsVisible() {
  return !weatherDisplayElement.classList.contains("hidden");
}

/**
 * 空文字バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @returns {boolean} バリデーション結果
 */
function validateNotEmpty(element) {
  return element.value.trim() !== "";
}

/**
 * ステータスバリデーション
 */
function notIsValidateStatus() {
  cityInputError.textContent = "入力された都市名が見つかりませんでした";
}

// 4. イベントリスナー
cityInput.addEventListener("input", () => {
  const isValid = validateNotEmpty(cityInput);
  setSubmitEnabled(isValid);
  isValid && (cityInputError.textContent = "");
  if (weatherDisplayIsVisible()) {
    weatherDisplayElement.classList.add("hidden");
  }
})

cityInput.addEventListener("blur", () => {
  const isValid = validateNotEmpty(cityInput);
  !isValid && (cityInputError.textContent = "都市名を入力してください");
  isValid && (setSubmitEnabled(true), cityInputError.textContent = "");
  // weatherDisplayElement が表示されている間はフォーカスが外れてもエラーを出さないようにしたい
  if (weatherDisplayIsVisible()) {
    cityInputError.textContent = "";
  }
})

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateNotEmpty(cityInput)) {
    cityInputError.textContent = "都市名を入力してください";
    return;
  }

  // いったん前に表示されていたアイコン要素をリセットする必要がある
  cityNameElement.textContent = "";
  weatherConditionElement.textContent = "";
  temperatureElement.textContent = "";
  weatherIconElement.replaceChildren();

  const city = cityInput.value.trim();
  const weatherData = await fetchWeatherData(city);
  cityNameElement.textContent = weatherData.name;
  weatherConditionElement.textContent = weatherData.weather[0].description;
  temperatureElement.textContent = weatherData.main.temp;
  const iconCode = weatherData.weather[0].icon;
  const iconElement = document.createElement("img");
  iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconElement.appendChild(iconElement);
  weatherDisplayElement.classList.remove("hidden");

  // 後処理
  cityInput.value = "";
  setSubmitEnabled(false);
})

weatherForm.addEventListener("reset", () => {
  cityInput.value = "";
  cityInputError.textContent = "";
  weatherIconElement.replaceChildren();
  setSubmitEnabled(false);
  if (weatherDisplayIsVisible()) {
    weatherDisplayElement.classList.add("hidden");
  }
})