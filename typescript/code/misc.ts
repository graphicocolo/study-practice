// JavaScript練習問題23選｜初心者向け基礎文法の実践課題集
// https://codequest.work/javascript-practice-problems-beginner/

// 中級編：条件分岐とループ
// 8. 奇数・偶数の判定
// 「数値が奇数なら “奇数”、偶数なら “偶数” と表示してください。」
function evenOddJudge (value: number): string {
  // if (value / 2 === 0) { // 割り算の商を返す
  // 解答
  if (value % 2 === 0) { // 割り算の余りを返す
    return "偶数";
  } else {
    return "奇数";
  }
}
console.log(evenOddJudge(12));

// 9. while文の利用
// 「1から5までの数値を while文を使って表示してください。」
// 自分のコード：表示とインクリメントが同時に行われておりわかりにくい
let n: number = 1;
while (n < 6) {
  console.log(n++); // 結果は同じ なぜ？
  // n++（後置インクリメント）の挙動がポイント
  // n++ は「現在の値を返してから、インクリメントする」という2段階の動作をします。
  // console.log(n++);は...
  // ① console.log に n の現在値（1）を渡す
  // ② その後に n を 1 増やす → n は 2 になる
  // これは解答のこの2行と完全に同じ動作です
  // console.log(n++) は1行の中で「出力」と「値の変更」という2つのことを同時にやっています。
  // - n++ の副作用（値の書き換え）が console.log の引数の中に隠れている
  // - 読んだだけでは「出力してからインクリメント」なのか「インクリメントしてから出力」なのか判断しにくい
  // - もし n++ を ++n（前置）に変えると動作が変わるが、見た目は似ている

  // 解答
  // console.log(n);
  // n++;
}

// 10. 配列のループ処理
// 「配列 numbers = [1, 2, 3, 4, 5] をループで順番に表示してください。」
// 自分のコード：不要な()と{}がある
const numbers = [6, 7, 8, 9, 10];
[...numbers].forEach((number) => {console.log(number)});
// 解答
// [...numbers].forEach(number => console.log(number));

// 11. 三項演算子の利用
// 「age が20以上なら “大人”、それ未満なら “子供” と表示してください。」
// 自分のコード：関数にしている
function ageJudge(age: number): void {
  age >= 20 ? console.log("大人") : console.log("子供");
}
ageJudge(14);
// 解答
// let age = 18;
// console.log(age >= 20 ? "大人" : "子供");

// 12. 配列から最大値を探す
// 「配列 numbers = [10, 20, 30, 5, 25] の最大値を表示してください。」
// 自分のコード：Math.max() を知らなかった...（イディオムに出てきてるのに） まわりくどい
const randomNumbers = [10, 20, 30, 5, 25];
const sortedNumbers = [...randomNumbers].sort((a, b) => b - a);
console.log(sortedNumbers[0]);
// 解答
// console.log(Math.max(...randomNumbers));

// 13. オブジェクトの利用
// 「オブジェクト person に name と age を追加し、表示してください。」
// 自分のコード：オブジェクトが複数行に渡っている 表示するのはプロパティではなくオブジェクト
const person = {
  name: "Mike",
  age: 25
}
console.log(person.name, person.age)
// 解答
// const person = { name: "Mike", age: 30 };
// console.log(person);

// 14. フィルタリング処理
// 「配列 numbers = [1, 2, 3, 4, 5] から偶数だけを取り出して表示してください。」
// 自分のコード：filter()を使うならスプレッド構文は不要 表示するのは配列なので間違っている
const baseNumbers: number[] = [1, 2, 3, 4, 5];
[...baseNumbers].forEach(number => number % 2 === 0 && console.log(number));
// 解答 filterは非破壊的メソッド
// let evenNumbers = numbers.filter(num => num % 2 === 0);
// console.log(evenNumbers);