// コードの構成
// 1. HTML要素を取得
// 2. 変数・初期値を定義
// 3. 関数を定義
// 4. イベントリスナー

// 1. HTML要素を取得
/** @type {HTMLParagraphElement | null} */ 
const text1 = document.querySelector("#text1");
/** @type {HTMLButtonElement | null} */
const text1ActionButton = document.querySelector("button#btn1");
/** @type {HTMLParagraphElement | null} */ 
const box2 = document.querySelector("#box2");
/** @type {HTMLButtonElement | null} */
const box2ActionButton = document.querySelector("button#btn2");
/** @type {HTMLInputElement | null} */ 
const input3Input = document.querySelector("#input3");
/** @type {HTMLButtonElement | null} */
const output3ActionButton = document.querySelector("button#btn3");
/** @type {HTMLButtonElement | null} */
const output3ResetButton = document.querySelector("button#reset3");
/** @type {HTMLParagraphElement | null} */ 
const output3 = document.querySelector("#output3");
/** @type {HTMLParagraphElement | null} */ 
const error3 = document.querySelector("#error3");
/** @type {HTMLUListElement | null} */ 
const list4 = document.querySelector("#list4");
/** @type {HTMLButtonElement | null} */
const list4ActionButton = document.querySelector("button#btn4");
/** @type {HTMLButtonElement | null} */
const output4ResetButton = document.querySelector("button#reset4");
/** @type {HTMLUListElement | null} */ 
const list5 = document.querySelector("#list5");
/** @type {HTMLButtonElement | null} */
const list5ActionButton = document.querySelector("button#btn5");
/** @type {HTMLButtonElement | null} */
const output5ResetButton = document.querySelector("button#reset5");
/** @type {HTMLDivElement | null} */
const toggleBox6 = document.getElementById("toggleBox");
/** @type {HTMLButtonElement | null} */
const class6ActionButton = document.querySelector("button#btn6");
/** @type {HTMLDivElement | null} */
const modalWrap = document.getElementById("wrapModal");
/** @type {HTMLButtonElement | null} */
const modalOpenButton = document.getElementById("openModal");
/** @type {HTMLButtonElement | null} */
const modalCloseButton = document.getElementById("closeModal");

// 2. 変数・初期値を定義

// 3. 関数を定義
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
 *  2 つの値の間のランダムな整数を得る
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @returns {number} ランダムな整数
 */
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 上限を含み、下限も含む
}

// 4. イベントリスナー
text1ActionButton.addEventListener("click", () => {
  text1.textContent === "こんにちは！" ? text1.textContent = "さようなら！" : text1.textContent = "こんにちは！";
});

// 解答例
// document.getElementById('btn1').addEventListener('click', () => {
//   document.getElementById('text1').textContent = 'こんにちはJavaScript！';
// });

box2ActionButton.addEventListener("click", () => {
  if (box2ActionButton.textContent === "非表示にする") {
    box2ActionButton.textContent = "表示する";
    box2.classList.add("hidden");
  } else {
    box2ActionButton.textContent = "非表示にする";
    box2.classList.remove("hidden");
  }
});

// 解答例
// document.getElementById('btn2').addEventListener('click', () => {
//   document.getElementById('box2').style.display = 'none';
// });

output3ActionButton.addEventListener("click", () => {
  if (!validateNotEmpty(input3Input, "表示する値", error3)) return;
  error3.textContent = "";
  output3.textContent = input3Input.value;
});

output3ResetButton.addEventListener("click", () => {
  error3.textContent = "";
  output3.textContent = "";
  input3Input.value = "";
});

// 解答例
// document.getElementById('btn3').addEventListener('click', () => {
//   const inputValue = document.getElementById('input3').value;
//   document.getElementById('output3').textContent = inputValue;
// });

list4ActionButton.addEventListener("click", () => {
  const li = document.createElement("li");
  list4.appendChild(li);
  const list4TempArray = [...list4.children];
  list4TempArray.forEach((element, index) => {
    element.setAttribute("id", `item${index + 1}`);
    if (element.textContent === "") element.textContent = `新しい項目${index}`;
  });
});

output4ResetButton.addEventListener("click", () => {
  const list4TempArray = [...list4.children];
  if (list4TempArray.length === 1) return;
  list4.textContent = "";
  const li = document.createElement("li");
  li.textContent = "既存の項目";
  list4.appendChild(li);
});

// 解答例
// document.getElementById('btn4').addEventListener('click', () => {
//   const li = document.createElement('li');
//   li.textContent = '新しい項目';
//   document.getElementById('list4').appendChild(li);
// });

list5ActionButton.addEventListener("click", () => {
  const deleteElement = list5.lastElementChild;
  if (!deleteElement) return;
  list5.removeChild(deleteElement);
});

output5ResetButton.addEventListener("click", () => {
  // if (list5.lastElementChild) return; // これを追加すると、全部削除し終わった後だけリセットできる
  list5.textContent = "";
  const generateCount = 3;
  for (let i = 0;i < generateCount; i++) {
    const li = document.createElement("li");
    li.textContent = `${i + 1}つ目`;
    list5.appendChild(li);
  }
});

// 解答例
// document.getElementById('btn5').addEventListener('click', () => {
//   const list = document.getElementById('list5');
//   if (list.lastElementChild) {
//     list.removeChild(list.lastElementChild);
//   }
// });

class6ActionButton.addEventListener("click", () => {
  toggleBox6.classList.toggle("bg-orange-200");
});

// 解答例
// document.getElementById('btn6').addEventListener('click', () => {
//   document.getElementById('toggleBox').classList.toggle('active');
// });

document.getElementById("btn7").addEventListener("click", () => {
  const param = getRandomIntInclusive(1, 100);
  // const param = Math.floor(Math.random() * 100);
  document.getElementById("image7").setAttribute("src", `https://picsum.photos/200?random=${param}`);
});

// 解答例
// document.getElementById('btn7').addEventListener('click', () => {
//   document.getElementById('image7').src = 'https://picsum.photos/200?random=' + Math.floor(Math.random() * 100);
// });

// ↓これだと対応する要素のみが表示非表示切り替えとなり
// もう一つの要素は表示されっぱなしか非表示のまま
// tabButtons.forEach((tabButton) => {
//   tabButton.addEventListener("click", () => {
//     const value = tabButton.dataset.tab;
//     document.getElementById(value).classList.toggle("hidden");
//   });
// });

// 片方のボタンをクリックしたら対応要素の表示非表示が切り替わり
// さらにもう一つの要素も、対応要素とは表示非表示が逆に切り替わる必要がある
// しかしこれだとボタンと内容が増えた時にifが増えることになり煩雑
// const tabButtons = document.querySelectorAll("[data-tab]");
// tabButtons.forEach((tabButton) => {
//   tabButton.addEventListener("click", () => {
//     if (tabButton.dataset.tab === "tab1") {
//       document.getElementById("tab1").classList.remove("hidden");
//       document.getElementById("tab2").classList.add("hidden");
//     } else {
//       document.getElementById("tab2").classList.remove("hidden");
//       document.getElementById("tab1").classList.add("hidden");
//     }
//   });
// });
const tabButtons = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
tabButtons.forEach((tabButton) => {
  tabButton.addEventListener("click", () => {
    const target = tabButton.dataset.tab;
    tabContents.forEach((tabContent) => tabContent.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});

// 解答例
// const tabs = document.querySelectorAll('.tab');
// const contents = document.querySelectorAll('.tab-content');
// tabs.forEach(tab => {
//   tab.addEventListener('click', () => {
//     const target = tab.dataset.tab;
//     contents.forEach(content => content.classList.add('hidden'));
//     document.getElementById(target).classList.remove('hidden');
//   });
// });

modalOpenButton.addEventListener("click", () => {
  modalWrap.classList.remove("hidden");
});

modalCloseButton.addEventListener("click", () => {
  modalWrap.classList.add("hidden");
});

// ↓自分の解答
// これだとモーダルのコンテンツをクリックしてもモーダルが閉じてしまう
// modalWrap.addEventListener("click", () => {
//   modalWrap.classList.add("hidden");
// });
// 解答例
modalWrap.addEventListener("click", (e) => {
  if (e.target === modalWrap) {
    modalWrap.classList.add("hidden");
  }
});

// ↓自分の解答
// モーダルのコンテンツをクリックした場合は何もしない
// これはうまくいかなかった
// document.querySelectorAll(".modal-content").forEach((content) => {
//   content.addEventListener("click", () => {
//     return;
//   });
// });

// querySelectorAll は、該当する NodeList を返す
// btn に対応するコンテンツを特定する方法が必要
// data-target 属性や nextElementSibling など
// document.querySelectorAll(".accordion-btn").forEach((item) => {
//   item.addEventListener("click", () => {
//     document.querySelectorAll(".accordion-content").forEach((content) => {
//       content.classList.toggle("hidden");
//     });
//   });
// });

// querySelector は、文書内の最初の要素を返す
document.querySelector(".accordion-btn").addEventListener("click", () => {
  document.querySelector(".accordion-content").classList.toggle("hidden");
});

document.querySelectorAll(".faq-button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.faq;
    document.getElementById(target).classList.toggle("hidden");
  });
});
