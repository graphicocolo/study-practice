import { API_KEY } from "./constants.js";
// コードの構成
// 1. HTML要素を取得
// 2. API呼び出し

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
      throw new Error(`レスポンスステータス: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("エラー:", error);
  }
}
const weatherData = await fetchWeatherData("tokyo");
