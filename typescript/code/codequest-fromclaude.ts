// claude からの問題

// オブジェクト calculator に add メソッドを追加し、2つの数値を足し算して結果を返せるようにしてください。

// ここに calculator を定義
// 自分の解答1
// これだと壊れたクラス定義
// const calculator(var1: number, var2: number): number = {
//   add() {
//     return this.var1 + this.var2;
//   }
// }
// 自分の解答2
// これだとアロー関数
// const calculator = (var1: number, var2: number): number => {
//   return var1 + var2;
// }
// 自分の解答3
// クラスとは異なり、呼び出さずそのまま使う実体（オブジェクトリテラル）
// add はそのプロパティとして持つアロー関数（呼ばれるたびにvar1, var2を引数として受け取る）
const calculator = { add: (var1: number, var2: number):number => var1 + var2 }

console.log(calculator.add(2, 5)); // → 7

