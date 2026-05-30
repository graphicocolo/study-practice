// ① 型アノテーションを省いて変数を宣言する
// 型を書かずに変数を宣言して、値を代入する
// → その後、違う型の値を代入しようとするとどうなるか確認する
let stringText = "Type is string.";
stringText = 12345; // 型 'number' を型 'string' に割り当てることはできません。

// ② 関数の戻り値を推論させる
// 戻り値の型アノテーションを書かずに関数を作る
// → IDEで関数名にカーソルを当てて、推論された型を確認する
function calcMultiplication(a: number, b: number) {
  return a * b;
}

// ③ 推論が「広くなりすぎる」パターン
// let で宣言した変数と、const で宣言した変数に同じ文字列を代入する
// → IDEでそれぞれの型がどう推論されるか比べる
// （ヒント：const と let で推論結果が違う）
let varString1 = "テキスト1"; // let varString1: string と推論される
const varString2 = "テキスト1"; // let varString2: "テキスト1" と推論される

// ④ 推論できない場合を作る
// 値を代入せずに変数を宣言する（初期値なし）
// → 型がどうなるか確認する
// → その変数に string を代入しようとしたらどうなるか
let uninitializedVar; // let uninitializedVar: any と推論される
uninitializedVar = "No Value";
console.log(uninitializedVar); // ここでは let uninitializedVar: string と推論される