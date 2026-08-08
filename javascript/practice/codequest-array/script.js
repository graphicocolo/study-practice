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
/** @type {HTMLUListElement | null} */
const beforeList2 = document.getElementById("beforeList2");
/** @type {HTMLUListElement | null} */
const afterList2 = document.getElementById("afterList2");


// 2. 変数・初期値を定義
// Q1. map 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成
const products = [
  { name: "Tシャツ", price: 2000 },
  { name: "パーカー", price: 5000 },
  { name: "キャップ", price: 1500 },
  { name: "スニーカー", price: 8000 }
];
// Q2. filter ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
const users = [
  { name: '田中', age: 25, active: true },
  { name: '佐藤', age: 17, active: true },
  { name: '鈴木', age: 30, active: false },
  { name: '高橋', age: 22, active: true },
  { name: '伊藤', age: 19, active: true }
];
// Q3. find / findIndex 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
const orders = [
  { id: 101, status: 'completed', total: 3000 },
  { id: 102, status: 'completed', total: 1500 },
  { id: 103, status: 'pending', total: 4200 },
  { id: 104, status: 'pending', total: 800 },
  { id: 105, status: 'cancelled', total: 2000 }
];
// Q4. reduce カートの商品リストから、合計金額を計算
const cart = [
  { name: 'ノートPC', price: 120000, quantity: 1 },
  { name: 'マウス', price: 3000, quantity: 2 },
  { name: 'キーボード', price: 8000, quantity: 1 },
  { name: 'モニター', price: 35000, quantity: 2 }
];

// Q5. some / every 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const passwords = ['abc', 'password123', 'hello', 'securePass!', '12345678'];

// Q1. map 自分の解答 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成
// ↓このように書くと、配列自体は新しくても、中のproductオブジェクトは元のproductsと同じ参照なので、元のデータが書き換わってしまう
// const testProducts = products.map((product) => {
//   product.price = Math.round(product.price * 1.1);
//   return product;
// });
// 今回はオブジェクトの中身を書き換える必要があるため、スプレッドコピーをする
// 別の書き方
// ブロックボディ（{ } + return）
// アロー関数の本体を { } で囲んでいる＝「関数の中身をこれから書きます」という宣言。複数行の処理を書けるが、値を返すには明示的に return が必要。
// const productsTaxIn = products.map((product) => {
//   return { ...product, price: Math.round(product.price * 1.1) };
// });
// 2つ目：コンシスボディ（式を直接返す）
// { } を省略して、式1つだけを本体にした書き方。return は不要（式の評価結果が自動で返る）。
// 2つ目のコードは () で { } を包むことで「これはオブジェクトです」とJSに伝えている
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
// Q1. map 解答 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成 
// const taxIncluded = products.map(item => ({
//   ...item,
//   price: item.price * 1.1
// }));
// console.log(taxIncluded);

// Q2. filter 自分の解答 ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
// 今回はオブジェクトの中身を書き換える必要はなく条件でデータを抽出しているだけなため、スプレッドコピー不要
const overTwentyAndActivedUsers = users.filter((user) => user.age >= 20 && user.active);
users.forEach((user) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${user.name} ${user.age} ${user.active ? "アクティブ" : ""}`;
  beforeList2.appendChild(listItem);
});
overTwentyAndActivedUsers.forEach((user) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${user.name} ${user.age} ${user.active ? "アクティブ" : ""}`;
  afterList2.appendChild(listItem);
});
// Q2. filter 解答 ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
// const activeAdults = users.filter(user => user.age >= 20 && user.active);
// console.log(activeAdults);

// Q3. find / findIndex 自分の解答 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
const pendingOrderIndexFirst = orders.findIndex(order => order.status === "pending");
// console.log(pendingOrderIndexFirst)
const pendingOrderFirst = orders.find((order, idx) => idx === pendingOrderIndexFirst && order);
console.log(`注文ID：${pendingOrderFirst.id} 注文合計価格：${pendingOrderFirst.total}円`);
// Q3. find / findIndex 解答 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
// const pendingOrder = orders.find(order => order.status === 'pending');
// const pendingIndex = orders.findIndex(order => order.status === 'pending');
// console.log(pendingOrder);
// console.log(pendingIndex);

// Q4. reduce 自分の解答 カートの商品リストから、合計金額を計算
const totalPrice = cart.reduce(
  (accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity),
  0
);
console.log(totalPrice);
// Q4. reduce 解答 カートの商品リストから、合計金額を計算
// const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
// console.log(total);

// Q5. some / every 自分の解答 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const isOnePassed = passwords.some(password => password.length >= 8) ? "1つは8文字以上です" : "8文字以上のものはありません";
console.log(isOnePassed);
const isAllPassed = passwords.every(password => password.length >= 8) ? "全て8文字以上です" : "全て8文字以上ではありません";
console.log(isAllPassed);
// Q5. some / every 解答 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const hasLong = passwords.some(pw => pw.length >= 8);
const allLong = passwords.every(pw => pw.length >= 8);
console.log(hasLong, allLong);

// 3. 関数を定義


// 4. イベントリスナー
