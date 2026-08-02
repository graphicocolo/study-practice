// claude からの問題

// お題2（2026-08-01、JSへの自信を確認するために出題）
//
// クロージャでカウンターを作る
//
// 外部からは直接カウントの値を書き換えられない、以下の仕様の関数を書いてください。
//
// const counter = createCounter();
// counter.increment(); // 1
// counter.increment(); // 2
// counter.decrement(); // 1
// counter.getValue();  // 1
//
// - createCounter() は increment / decrement / getValue を持つオブジェクトを返す
// - カウントの値は外部から直接アクセスできない（counter.count のような形で触れない）
//
// 17時まで時間が取れないため、ひとまずここまで。続きはまた後で。

// ここに解答
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Closures#実践的なクロージャ
// クロージャの本質 外側の関数のスコープに変数を閉じ込め、返されたオブジェクトの関数だけがそこにアクセスできる
function createCounter() {
  let count = 0;
  function calc(val) {
    count += val;
  }
  return {
    increment() {
      calc(1);
    },
    decrement() {
      calc(-1)
    },
    getValue() {
      return count;
    }
  }
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
counter.getValue();  // 1

// 2026.08.02 本日の claude からの問題
//
// 配列メソッド（filter + reduce）で条件付き集計を書く 目安：20分
//
// 以下の購入履歴データがある
// const purchases = [
//   { item: "コーヒー", price: 400, category: "drink" },
//   { item: "サンドイッチ", price: 550, category: "food" },
//   { item: "紅茶", price: 380, category: "drink" },
//   { item: "ドーナツ", price: 250, category: "food" },
//   { item: "オレンジジュース", price: 420, category: "drink" },
// ];
//
// 1. category が "drink" のものだけを抽出した配列 drinks を作る
//
// 2. drinks の price を合計した数値 totalDrinkPrice を求める（reduce を使う）
//
// 3. 合計金額が 1000 円を超えていたら "drink代がかさんでいます"、
//    超えていなければ "drink代は適正範囲です" という文字列を
//    console.log で出力する
//
// 確認ポイント（解いた後に自分で考えてみる）
// - filter は元の配列を変更している？それとも新しい配列を返している？
// 新しい配列を返している
// - reduce の第2引数（初期値）を省略するとどうなる？
// 初期値がない場合、配列の要素0であるオブジェクトそのものが初期値として使用され、意図した値が返らない（[object Object]380420のような形で返ってくる）
// - ここで forEach ではなく reduce を使う理由を説明できる？
// forEach は返り値がないから

// ここに解答
const purchases = [
  { item: "コーヒー", price: 400, category: "drink" },
  { item: "サンドイッチ", price: 550, category: "food" },
  { item: "紅茶", price: 380, category: "drink" },
  { item: "ドーナツ", price: 250, category: "food" },
  { item: "オレンジジュース", price: 420, category: "drink" },
];
const drinks = purchases.filter((purchase) => purchase.category === "drink");
const totalDrinkPrice = drinks.reduce((accumulator, drink) => {
  accumulator += drink.price;
  return accumulator;
}, 0);
if (totalDrinkPrice > 1000) {
  console.log(`drink代がかさんでいます${totalDrinkPrice}`);
} else {
  console.log(`drink代は適正範囲です${totalDrinkPrice}`);
}
