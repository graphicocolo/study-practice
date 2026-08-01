// claude からの問題

// お題2（2026-08-01、就活相談の中でJSへの自信を確認するために出題）
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