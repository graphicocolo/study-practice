// コードの構成
// 1. HTML要素を取得
// - <div> → HTMLDivElement
// - <ul> / <ol> → HTMLUListElement / HTMLOListElement
// - <li> → HTMLLIElement
// - <button> → HTMLButtonElement
// - <input> → HTMLInputElement
// - <p> → HTMLParagraphElement
// - 不明・汎用 → HTMLElement
// 2. 変数・初期値を定義
// 3. 関数を定義
// 4. イベントリスナー

// 1. HTML要素を取得
/** @type {HTMLUListElement | null} */
const beforeList1 = document.getElementById("beforeList1");
/** @type {HTMLUListElement | null} */
const afterList1 = document.getElementById("afterList1");


// 2. 変数・初期値を定義
// map 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成
const products = [
  { name: "Tシャツ", price: 2000 },
  { name: "パーカー", price: 5000 },
  { name: "キャップ", price: 1500 },
  { name: "スニーカー", price: 8000 }
];
// ↓このように書くと、配列自体は新しくても、中のproductオブジェクトは元のproductsと同じ参照なので、元のデータが書き換わってしまう
// const testProducts = products.map((product) => {
//   product.price = Math.round(product.price * 1.1);
//   return product;
// });

// map 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成 自分の解答
// 別の書き方
// const productsTaxIn = products.map((product) => {
//   return { ...product, price: Math.round(product.price * 1.1) };
// });
const productsTaxIn = products.map((product) => ({ ...product, price: Math.round(product.price * 1.1) }));
products.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${item.name}：${item.price}`;
  beforeList1.appendChild(listItem);
});
productsTaxIn.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${item.name}：${item.price}`;
  afterList1.appendChild(listItem);
});

// map 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成 解答
// const taxIncluded = products.map(item => ({
//   ...item,
//   price: item.price * 1.1
// }));
// console.log(taxIncluded);

// 3. 関数を定義


// 4. イベントリスナー
