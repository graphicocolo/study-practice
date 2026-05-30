// ① 変数に型アノテーションをつける
// string, number, boolean, null, undefined の変数をそれぞれ1つずつ宣言する

let message: string = "ありがとうございます";

let calcNumber:number = 10;

let isValid: boolean = true;

let initialValue: null = null;

let notExist: undefined = undefined;

// ② 意図的に型ミスを起こす
// `npx tsc --noEmit` でどんなエラーが出るか確認する。
// message = 12345;
// console.log(message); // study02-annotation.ts:13:1 - error TS2322: Type 'number' is not assignable to type 'string'.

// ③ null と undefined を使い分ける
// 「まだ値がない」状態を表す変数を2つ作る
// 1つは null を使い、もう1つは undefined を使う
// それぞれ console.log で出力する
const emptyValue1: null = null;
console.log(emptyValue1);
const emptyValue2: undefined = undefined;
console.log(emptyValue2);

// ④ 関数の引数・戻り値に型をつける
// function userProfile (name: string, age: number): string {
function userProfile (name: string, age: number) { // 戻り値の型省略の場合、TypeScript の型推論で string と判断
  return `ユーザー名：${name}さん、年齢：${age}歳`;
}
console.log(userProfile("Kate", 25));