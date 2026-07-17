// ① 数値 Enum の挙動を確認する
// enum Direction { Up, Down, Left, Right }
// console.log(Direction.Up); // 0 と表示
// console.log(Direction[0]); // Up と表示（リバースマッピング）

// ② 数値 Enum の並び順に注意する
// enum Direction { Up, Down, Left, Right }
// enum Direction { Up, Center, Down, Left, Right }
// console.log(Direction.Down); // Center を追加することで 1 から 2 に変わる

// ③ 文字列 Enum を書く
// enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
// console.log(Direction.Up); // UP が返る
// console.log(Direction[0]); // UP と undefined が返る
// 型 '0' の式を使用して型 'typeof Direction' にインデックスを付けることはできないため、要素は暗黙的に 'any' 型になります。
// プロパティ '0' は型 'typeof Direction' に存在しません。

// ④ Enum を関数の引数に使う
// enum Direction { Up, Down, Left, Right }
// function move(direction: Direction): { x: number, y: number } {
//   switch (direction) {
//     case Direction.Up:
//       return { x: 0, y: 1 };
//     case Direction.Down:
//       return { x: 0, y: -1 };
//     case Direction.Left:
//       return { x: -1, y: 0 };
//     case Direction.Right:
//       return { x: 1, y: 0 };
//     default:
//       // `_exhaustive` の先頭 `_` は「使わない変数」の慣習的な表記
//       // 変数自体は使わないが、**↑この代入式が型チェックのトリガー**になっている
//       const _exhaustive: never = direction;
//       return _exhaustive;
//   }
// }
// console.log(move(Direction.Down)); // { x: 0, y: -1 }
// console.log(move("Up")); // 型 '"Up"' の引数を型 'Direction' のパラメーターに割り当てることはできません。

// ⑤ Union 型リテラルで書き換える
// コード量が減り、直感的でわかりやすくなる
// type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
// function move(direction: Direction): { x: number, y: number } {
//   switch (direction) {
//     case "UP":
//       return { x: 0, y: 1 };
//     case "DOWN":
//       return { x: 0, y: -1 };
//     case "LEFT":
//       return { x: -1, y: 0 };
//     case "RIGHT":
//       return { x: 1, y: 0 };
//     default:
//       // `_exhaustive` の先頭 `_` は「使わない変数」の慣習的な表記
//       // 変数自体は使わないが、**↑この代入式が型チェックのトリガー**になっている
//       const _exhaustive: never = direction;
//       return _exhaustive;
//   }
// }
// console.log(move("LEFT"));

// ⑥ const enum を試す
const enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
console.log(Direction.Up); // UP が返る
// Direction は実行時残らない
// 「シンボル名（Direction.Up）」を実行前に「実際の値（"UP"）」へ置き換えてしまう
// 実行時のオブジェクト生成・プロパティアクセスのコストをゼロにしている

// npx tsc study17-enum.ts --module esnext --target esnext --ignoreConfig --outDir /tmp/out
// 出力された中身
// "use strict";
// console.log("UP" /* Direction.Up */); // UP が返る