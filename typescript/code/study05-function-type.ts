// ① 引数に型をつける
// 2つの number を受け取り、合計を返す関数 add を書く
// 引数に型アノテーションをつけること
// IDE で補完（function にマウスホバーで戻り値の型が表示される）
// function calcAddition (a: number, b: number) {
//   return a + b;
// }
// ② 戻り値に型をつける
// ①の関数に、戻り値の型（: number）も明示的につけて書き直す
// 戻り値の型はどこに書くか確認すること
function calcAddition (a: number, b: number): number {
  return a + b;
}
console.log(calcAddition(1, 2));

// ③ string を返す関数
// name: string を受け取り、「こんにちは、〇〇さん」という文字列を返す関数 greet を書く
// 引数・戻り値の両方に型をつけること
function greetGenerate(name: string): string {
  return `こんにちは、${name}さん`;
}
console.log(greetGenerate("佐藤"));

// ④ 戻り値がない関数（void）
// message: string を受け取り、console.log で出力するだけの関数 printMessage を書く
// 何も返さない場合の戻り値の型は何か調べて書くこと
function printMessage(message: string): void {
  console.log(message);
}
printMessage("今日はゴミの日です");

// ⑤ アロー関数で書き直す
// ①〜④の関数をアロー関数の書き方に書き直す
// 型のつけ方はアロー関数でも同じか確認する
const calcAdditionInArrow = (a: number, b: number): number => a + b;
const greetGenerateInArrow = (name: string): string => `こんにちは、${name}さん`;
const printMessageInArrow = (message: string): void => {
  console.log(message);
};
console.log(calcAdditionInArrow(9, 8));
console.log(greetGenerateInArrow("山本"));
printMessageInArrow("買い物を忘れずに！");

// ⑥ 型が合わないとどうなるか確認する
// ①で作った add 関数に string を渡すとエラーになるか確認する
// エラーメッセージを読んで、何が問題かを理解する
// study05-function-type.ts:44:26 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
// 文字列型は数値型のパラメーターに割り当てることができない
// つまり数値型の引数に文字列型の引数は入れられない
// console.log(calcAddition("あ", "い")); // npx tsx では出力はされる あい
// TypeScript のコンパイルエラーがある状態で tsc を実行するとビルド自体が止まるため、通常は出力されない
// 現在の環境では、ライブラリによってコンパイルなしで動いている状態