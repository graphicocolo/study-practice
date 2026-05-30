// 引数と戻り値に型をつけた関数を1つ書いて、呼び出す
function calcAddition(var1: number, var2: number): number {
  return var1 + var2;
}
console.log(calcAddition(1, 2)); // → 3

// 文字列を受け取るはずの変数・引数に、数値を渡してみる
// → エラーメッセージを読んで、何と言っているか確認する
function greet(userName: string): string {
  return `${userName}さん、ようこそ`;
}
// console.log(greet(12345)); // → 12345さん、ようこそ → ターミナルでエラーは出なかった
// 型 'number' の引数を型 'string' のパラメーターに割り当てることはできません。

// npx tsc --noEmit を実行してエラー確認
// study01-whatists.ts:12:19 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// 存在しないプロパティにアクセスしてみる（例: user.namee のタイポ）
// → JavaScript だと undefined になるが、TypeScript では？
type User = {
  name: string;
  age: number;
}
const user: User = {
  name: 'Mike',
  age: 20,
}
// console.log(user.namae); // → undefined
// npx tsc --noEmit を実行してエラー確認
// study01-whatists.ts:25:18 - error TS2551: Property 'namae' does not exist on type 'User'. Did you mean 'name'?