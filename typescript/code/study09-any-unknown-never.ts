// ① `any` の挙動を確認する
// any 型の変数を宣言して、以下をすべて試す
// - string を代入する
// - number を代入する
// - 存在しないメソッドを呼び出す（例：.toUpperCase() を number に対して）
// → TypeScript はエラーを出すか？
// ポイント：any はコンパイラの目を「閉じさせる」型
let anyVar: any;
anyVar = "何でも代入";
anyVar = 12345;
// anyVar.toUpperCase(); // TypeError: anyVar.toUpperCase is not a function → 実行時エラー

// ② `unknown` の挙動を確認する
// unknown 型の変数に string を代入する
// そのまま .toUpperCase() を呼び出してみる
// → TypeScript はエラーを出すか？

// 次に typeof で型を絞り込んでから .toUpperCase() を呼び出す
// → 今度はどうなるか？

// ポイント：unknown は「使う前に型を確認させる」型

let unknownVar: unknown;
unknownVar = "型はunknown";
// unknownVar.toUpperCase(); // 'unknownVar''は 'unknown' 型です。 → 実行前にすでにエラー
if (typeof unknownVar === "string") {
  console.log(unknownVar.toUpperCase());
}

// ③ `any` と `unknown` の違いを関数で比較する
// 引数を any で受け取る関数 processAny を書く
// 引数をそのまま .toUpperCase() して返す
// → 型エラーは出るか？実行時エラーは出るか？

// 引数を unknown で受け取る関数 processUnknown を書く
// typeof で string か確認してから .toUpperCase() して返す
// string でない場合は "文字列ではありません" を返す
// → any との違いは何か？

function processAny (v: unknown) {
  if (typeof v === "string") {
    console.log(v.toUpperCase());
    return;
  }
  console.log("文字列ではありません"); //  → 実行時エラーが出ない
}
processAny(12345);
processAny("文字列test");

// ④ `never` が現れるパターン①：網羅チェック（exhaustive check）
// 以下の型を定義する
// type Shape = "circle" | "square" | "triangle"

// Shape を受け取って面積の計算方法を返す関数 describeShape を書く
// switch 文で各 case を処理する
// default 節に以下を書いて「到達不能」を保証する：
//   const _exhaustive: never = shape;

// ポイント：Shape に新しい値（例 "hexagon"）を追加したとき、
// default の never 代入がエラーになることを確認する
// → 型で「追加したら必ず全 case を書け」と強制できる

// type Shape = "circle" | "square" | "rightTriangle" | "hexagon";
type Shape = "circle" | "square" | "rightTriangle";
function describeShape (shape: Shape, v1: number, v2?: number) {
  switch (shape) {
    case "circle":
      console.log((v1 ** 2) * 3.14);
      break;
    case "square":
      if (v2) {
        console.log(v1 * v2);
        return;
      }
      console.log("正しい値を入力してください");
      break;
    case "rightTriangle":
      if (v2) {
        console.log((v1 * v2) / 2);
        return;
      }
      console.log("正しい値を入力してください");
      break;
    // switch 文で3つ全部 case に書いたので、`default` に来る時点で TypeScript は「`circle` でも `square` でも `rightTriangle` でもない → 残りの型は何もない → `never`」と判断する
    // type Shape に `"hexagon"` を追加すると
    // `"hexagon"` の case を書いていないので、`default` に来うる = `shape` の型は `"hexagon"` が残る
    default:
      // `_exhaustive` の先頭 `_` は「使わない変数」の慣習的な表記
      const _exhaustive: never = shape; // 型 '"hexagon"' を型 'never' に割り当てることはできません。

      // 変数自体は使わないが、**↑この代入式が型チェックのトリガー**になっている
  }
}
describeShape("circle", 3);

// ⑤ `never` が現れるパターン②：絶対に返らない関数
// 必ず例外を投げる関数 fail を書く
// 引数に message: string を受け取り、throw new Error(message) する
// 戻り値の型を never と明示する

// never を戻り値にする条件：
// - throw で必ず終わる関数
// - while(true) など無限ループで絶対に return しない関数

function fail (message: string): never {
  throw new Error(message);
}
// fail("例外を投げる");

// ⑥ `unknown` の実用例：外部データの受け取り
// JSON.parse() の戻り値は any
// 以下の流れを実装する：

// 1. JSON 文字列 '{"name":"Alice","age":30}' を JSON.parse で読み込む
// 2. 結果を unknown 型の変数に代入する
// 3. typeof / in 演算子を使って name が string であることを確認する
// 4. 確認できたら name を string として扱う

// ポイント：外部データは「信用できない」ので unknown が適切
// any を使うと確認を怠っても型エラーが出ない

const json = '{"name":"Alice","age":30}';
const data: unknown = JSON.parse(json);

// 自分のコード
// console.log(typeof data.name);
// console.log(typeof "string" in readData.name);
// const parsedName: string = data.name;

// 修正後
// study-basic/typescript/typescript-typeassertion.md の 型アサーションが許容される、または必要なケース
// **外部ライブラリや API からのデータ**: 外部から取得したデータ（JSON API レスポンスなど）の型が TypeScript コンパイラには不明な場合、開発者がそのデータの構造を確信している場合にアサーションを使用することがあります。
// にあたる
if (typeof data === "object" && data !== null && "name" in data) {
  const obj = data as { name: unknown }; // ここで型アサーション（型の上書き）
  if (typeof obj.name === "string") {
    const parsedName: string = obj.name;
    console.log(parsedName);
  }
}

// typeof チェックを通過すると TypeScript は「実行時に確認したんだから信用する」と判断し、data の型を unknown から object に絞り込みます。これが narrowing（型の絞り込み） の仕組みです。

// なぜ as が必要か
// "name" in data のチェックを通過した後、TypeScript が data を絞り込む型は object です。しかし object 型はプロパティへのアクセスを許可しません。
// if ("name" in data) {
// data.name; // エラー：object 型にはプロパティアクセスができない
// }
// data as { name: unknown } は何をしているか
// 「TypeScript よ、この値を { name: unknown } 型として扱え」と開発者が宣言しています。
// const obj = data as { name: unknown };
// "name プロパティが存在する" ことだけを宣言
// name の中身の型は unknown のまま（まだわからない）
// name の型を string ではなく unknown にしているのがポイントです。{ name: string } と書いてしまうと「name は必ず string」と断言することになり、次の typeof obj.name === "string" チェックが不要になってしまいます。
// 段階的に型を絞り込んでいる、というイメージ