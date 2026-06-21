// JavaScript練習問題23選｜初心者向け基礎文法の実践課題集
// https://codequest.work/javascript-practice-problems-beginner/
// 上級編：関数とオブジェクト応用

// 15. 配列の合計値
// 「配列 numbers = [1, 2, 3, 4, 5] の合計値を求めてください。」
// 自分のコード
type ArrayDatas<T> = Array<T>;
const numbers: ArrayDatas<number> = [1, 2, 3, 4, 5];

// 自分のコード 1回目
// function addNumbers (numbers: ArrayDatas<number>) {
  // どの組み込み関数を使用するか
  // map 配列が返ってくる 最後は単一の値を返したいので不適
  // forEach 副作用（合計値を保存）が目的なので適する
  // for...of 汎用的なので適する

  // sum += numbers[i]; で IDEのエラーが消えない オブジェクトは 'undefined' である可能性があります。
  // エラー修正のヒント1：return の位置
  // for ループの中に return があると、最初の1回で関数を抜けてしまいます。sum を返すなら、ループが終わった後に return してください。
  // エラー修正のヒント2：ループの範囲
  // i < times - 1 だと最後の要素（index 4）がループに含まれません。全要素を足すなら < times - 1 ではなく別の条件にする必要があります。
  // エラー修正のヒント3：TypeScriptエラー（本質）
  // .some() でチェックしても、TypeScript はループ内の numbers[i] の型を number に絞り込んでくれません。hasEmpty チェックは型エラーの解決にならないです。
  // インデックスアクセス（numbers[i]）の代わりに for...of を使うと、要素が直接 number 型として取れるのでエラーが消えます。
  // for (const n of numbers) {
  // // n は number 型
  // }
  // const times = numbers.length;
  // let sum = 0;
  // const hasEmpty = numbers.some((v) => v === undefined);
  // if (hasEmpty) return;
  // for (let i = 0; i < times - 1; i++) {
  //   return sum += numbers[i];
  // }
// }
// 自分のコード 2回目
function addNumbersWithForOf (numbers: ArrayDatas<number>): number {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum;
}
console.log(addNumbersWithForOf(numbers));

// 自分のコード 3回目
function addNumbersWithForEach (numbers: ArrayDatas<number>): number {
  let result = 0;
  numbers.forEach((n) => {
    result += n;
  });
  return result;
}
console.log(addNumbersWithForEach(numbers));

// 解答例
// let sampleNumbers: ArrayDatas<number> = [1, 2, 3, 4, 5];
// acc → 累積値 num → 今の要素
// acc + num の結果が次の回の acc として引き継がれていきます。最終的に返ってきた 15 が sum に入ります。
// let sum: number = sampleNumbers.reduce((acc, num) => acc + num, 0);
// reduce 配列を1つの値にまとめる処理（合計・最大など）
function addNumbersWithReduce (numbers: ArrayDatas<number>): number {
  let sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum;
}
console.log(addNumbersWithReduce(numbers));

// 16. 配列の重複を削除する
// 配列 numbers = [1, 2, 2, 3, 4, 4, 5] から重複を取り除いて表示してください。

const duplicatedNumbers: ArrayDatas<number> = [1, 2, 2, 3, 4, 4, 5]

// 自分のコード 1回目
// function deleteDuplicationItemInArray (numbers: ArrayDatas<number>): ArrayDatas<number> | undefined {
  // 型 '(a: number, b: number) => number | undefined' の引数を型 '(a: number, b: number) => number' のパラメーターに割り当てることはできません。
  // 型 'number | undefined' を型 'number' に割り当てることはできません。
    // 型 'undefined' を型 'number' に割り当てることはできません

//   const result = [...numbers].sort((a, b) => {
//     if (a === b) return;
//     return a - b;
//   });
//   return result;
// }

// エラー修正のヒント1：アプローチの方向修正
// A. Set を使う
// Set は重複を持てないデータ構造です。配列を Set に変換するだけで重複が消えます。あとは配列に戻す方法を調べてみてください。
// new Set([1, 2, 2, 3]) // → {1, 2, 3}
// B. filter を使う
// indexOf は配列の中で最初に一致した要素のインデックスを返します。これを使うと「今の位置が最初の出現位置かどうか」を判定できます。
// [1, 2, 2, 3].indexOf(2) // → 1（最初に2が出てくる位置）
// エラー修正のヒント2：sort のコールバックについて
// return;（値なしの return）は undefined を返すことになり、sort が正しく動きません。sort のコールバックは必ず数値（負・0・正）を返す必要があります。今回は sort を使わない方向で考えてみてください。

// 自分のコード 2回目
function deleteDuplicationItemInArrayWithSet (numbers: ArrayDatas<number>): ArrayDatas<number> {
  // 自分のコード
  // const processed = new Set([...numbers]);
  // const result = [];
  // for (const n of processed) {
  //   result.push(n);
  // }
  // return result;

  // 修正後
  return [...new Set(numbers)]
}
console.log(deleteDuplicationItemInArrayWithSet(duplicatedNumbers))

// 自分のコード 3回目
// B. filter を使う を試す
// ヒント：filterのコールバックで「重複か？」を判定する
// indexOf が返す値の性質：
// [1, 2, 2, 3].indexOf(2)  // → 1（最初の 2 の位置）indexOf は 最初に見つかった位置 しか返しません
// filter のコールバックは何を受け取る？
// numbers.filter((item, index) => { ... }) item 要素 index 今の位置
// 考えるポイント：「今の位置 index が、その値が 最初に登場する位置 と等しいか？」
function deleteDuplicationItemInArrayWithFilter (numbers: ArrayDatas<number>): ArrayDatas<number> {
  // 自分のコード item が 0 だった場合、falsy となりバグが発生
  // const filtered = numbers.filter((item, index) => {
    
  //   if (index === numbers.indexOf(item)) {
  //     return item;
  //   }
  // });
  // return filtered;
  // 修正版
  // filter に 、boolean を返すコールバックを代入し、コールバック処理で true を返した要素だけに絞り込む
  return numbers.filter((item, index) => index === numbers.indexOf(item));
}
console.log(deleteDuplicationItemInArrayWithFilter(duplicatedNumbers));

// 解答例
let unique = [...new Set(duplicatedNumbers)];
console.log(unique);

// 17. 関数を返す関数
// 「関数 createMultiplier を作成し、引数に渡した数値で掛け算する関数を返してください。」

// 自分のコード 1回目
function createMultiplier(multiplier: number): (n: number) => number {
  return (n) => multiplier * n;
}
// 自分のコード 2回目
// 返り値の型を void にするとエラー この式は呼び出し可能ではありません。  型 'void' には呼び出しシグネチャがありません。
// エラーの理由：void は「何も返さない」という型だから
// 際に return (n) => ...で関数を返そうとすると型が合わずエラーになります。
// さらに、呼び出し側でもエラーが出ます：
// multiplication(3);  // エラー：void は呼び出せない
// void は「関数として使える」という情報を持っていないので、呼び出そうとすると「呼び出しシグネチャがありません」と怒られます。コメントのエラーメッセージはここから来ています。
// 関数も値の一種なので、関数の型を戻り値に書けば「関数を返す」と表現できます。
// function createMultiplier(multipleier: number): void {
//   return (n: number) => multipleier * n;
// }
const multiplication = createMultiplier(3);
console.log(multiplication(3));
console.log(multiplication(5));

// 解答例
function sampleCreateMultiplier(factor: number) {
  return function(x: number) {
    return x * factor;
  };
}
let double = sampleCreateMultiplier(2);
console.log(double(5));

// 18. オブジェクトのメソッド
// 「オブジェクト calculator に add メソッドを作成し、2つの数値を足し算してください。」

// 自分のコード 1回目
// let calculator: {
//   add(x: number, y: number): number;
// }
// console.log(calculator.add(3, 4)) // 変数 'calculator' は割り当てられる前に使用されています。

// 自分のコード 2回目
let calculator = {
  // return を書くなら {} が必要
  // add(x: number, y: number) {
  //   return x + y;
  // },
  // ↓これではなぜだめなのか？
  // add(x: number, y: number) => return x + y,
  // ↓これならOK
  add: (x: number, y: number) => x + y,
  // 1行なら return 省略
};
console.log(calculator.add(2, 5));

// 解答例
// let calculator = {
//   add: function(a, b) {
//     return a + b;
//   }
// };
// console.log(calculator.add(3, 5));

// 19. 配列の並び替え
// 「配列 numbers = [5, 2, 8, 1, 3] を昇順に並び替えて表示してください。」

// 自分のコード 1回目
const notFormattedNumbers: ArrayDatas<number> = [5, 2, 8, 1, 3];

function ascendingOrderedNumbers (numbers: ArrayDatas<number>): ArrayDatas<number> {
  return [...numbers].sort((a, b) => a - b);
}
console.log(ascendingOrderedNumbers(notFormattedNumbers));

// ついでに降順
function descendingOrderedNumbers (numbers: ArrayDatas<number>): ArrayDatas<number> {
  return [...numbers].sort((a, b) => b - a);
}
console.log(descendingOrderedNumbers(notFormattedNumbers));

// 解答例
// let numbers = [5, 2, 8, 1, 3];
// let sorted = [...numbers].sort((a, b) => a - b);
// console.log(sorted);

// 20. クラスの利用
// 「Person クラスを作成し、name プロパティと greet メソッドを追加してください。」

// 自分のコード 1回目
class Person {
  // JavaScript はこれで動くが
  // TypeScript はプロパティを先に宣言しないとエラー
  // ← ここに name の宣言が必要
  // constructor(name: string) {
  //   this.name = name;
  // }
  // ↓こう書くか
  // name: string;
  // constructor(name: string) {
  //   this.name = name;
  // }
  // ↓もしくはこう書くか
  // constructor(public name: string) {
  // } // {}は空で良い
  constructor(public name: string, public message: string) {}
  // ゲッター
  // get greet() {
  //   return `${this.name}さん、${this.message}`;
  // }
  // メソッド
  greet() {
    console.log(`${this.name}さん、${this.message}`);
  }
}
const morningGreeting = new Person("山田", "おはようございます");
;
morningGreeting.greet();

// 解答例
// class Person {
//   constructor(name) {
//     this.name = name;
//   }
//   greet() {
//     console.log(`Hello, my name is ${this.name}.`);
//   }
// }
// let person = new Person("Taro");
// person.greet();

// 21：FizzBuzz判定関数
// 1から100までの数値を順に表示してください。ただし、3の倍数のときは数値の代わりに “Fizz”、5の倍数のときは “Buzz”、3と5の両方の倍数のときは “FizzBuzz” と表示してください。

// 自分のコード 1回目 失敗例 正常に動かない
// let value: number = 0;
// function judgeFizzBuzz () {
//   for (let i = 0; i < 10; i++) {
//     value = i + 1;
//     if (value % 3 === 0) console.log("Fizz"); 
    // if (value % 5 === 0) console.log("Buzz"); 
    // if (value % 3 === 0 && value % 5 === 0) console.log("FizzBuzz");
//     console.log(value);
//   }
// }

// 自分のコード 2回目
// 一応きちんと動くがもう少しスマートにしたい
// 他の書き方が知りたい
// let count: number = 0;
// function judgeFizzBuzz () {
//   for (let i = 0; i < 100; i++) {
//     count = i + 1;
//     if (count % 15 === 0) {
//       console.log("FizzBuzz");
//     } else if (count % 5 === 0) {
//       console.log("Buzz");
//     } else if (count % 3 === 0) {
//       console.log("Fizz");
//     } else {
//       console.log(count);
//     }
//   }
// }
// judgeFizzBuzz();

// 自分のコード 3回目 アプローチA
// let count: number = 0;
// function judgeFizzBuzz () {
//   for (let i = 0; i < 100; i++) {
//     count = i + 1;
//     let result: string | number = "";
//     if (count % 3 === 0) result += "Fizz";
//     if (count % 5 === 0) result += "Buzz";
//     if (result === "") result = count;
//     console.log(result);
//   }
// }
// judgeFizzBuzz();

// 解答例 アプローチA
// for (let i = 1; i <= 100; i++) {
//   let result = "";
//   if (i % 3 === 0) result += "Fizz";
//   if (i % 5 === 0) result += "Buzz";
//   console.log(result || i);
// }

// 自分のコード 4回目 アプローチB
// const countNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
// [...countNumbers].forEach((countNumber) => {
//   let result: string | number = "";
//   if (countNumber % 3 === 0) result += "Fizz";
//   if (countNumber % 5 === 0) result += "Buzz";
//   if (result === "") result = countNumber;
//   console.log(result);
// });

// 解答例 アプローチB
// const results = Array.from({ length: 100 }, (_, i) => {
//   const n = i + 1;
//   let result = "";
//   if (n % 3 === 0) result += "Fizz";
//   if (n % 5 === 0) result += "Buzz";
//   return result || n;
// });
// results.forEach((r) => console.log(r));

// 自分のコード 5回目
// const countDisplayRules: [number, string][] = [
//   [15, "FizzBuzz"],
//   [3, "Fizz"],
//   [5, "Buzz"],
// ];
// const countNumbersArray = Array.from({ length: 100 }, (_, i) => i + 1);
// [...countNumbersArray].forEach((countNumber) => {
//   let result: string | number = countNumber;
//   for (const rule of countDisplayRules) {
//     if (countNumber % rule[0] === 0) {
//       result = rule[1];
      // return; // return だと該当する数字が表示されない
//       break;
//     }
//   }
//   console.log(result);
// });

// アプローチC：判定ロジックをデータで持つ 解答例
const countDisplayRules: [number, string][] = [
  [15, "FizzBuzz"],
  [3, "Fizz"],
  [5, "Buzz"],
];
Array.from({ length: 100 }, (_, i) => i + 1).forEach((n) => {
  const matched = countDisplayRules.find(([divisor]) => n % divisor === 0); // [divisor] とすることで、[15, "FizzBuzz"]の1番目の要素だけを分割代入できる
  // 2番目の要素だけを分割代入する場合
  // const [, label] = [15, "FizzBuzz"]; // label は "FizzBuzz"
  console.log(matched ? matched[1] : n);
});

// 解答例
// function fizzBuzz(number) {
//   if (number % 3 === 0 && number % 5 === 0) {
//     console.log("FizzBuzz");
//   } else if (number % 3 === 0) {
//     console.log("Fizz");
//   } else if (number % 5 === 0) {
//     console.log("Buzz");
//   } else {
//     console.log(number);
//   }
// }
// for (let i = 1; i <= 100; i++) {
//   fizzBuzz(i);
// }

// 22. フィボナッチ数列の生成
// 引数に渡した項数ぶんのフィボナッチ数列を配列で返す関数 generateFibonacci を作成してください。例えば generateFibonacci(10) なら [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] を返します。

// 基礎知識
// フィボナッチ数列とは、「ある項の数字が、必ず直前の2つの数字の和になる」という単純なルールで作られる数の並び
// 実例
// 数字の並びは以下のようになります。1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233...
// 並び順を見ると、前の2つの数字を足すことで次の数字が生まれていることがわかります。
// 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8, 5 + 8 = 13 ...以降も同様

// 自分のコード 1回目
// 1番目の処理
// 配列1番目に 0 を代入
// 2番目の処理
// 配列2番目に 0 を代入（前の2つの数字を足すことで次の数字が生まれているとして、最初の要素が 0 ならいつまで経っても 0 のままになってしまう...）
// ↓
// 3項目以降は「前の2つの和」で計算できますが、最初の2項（0と1）はルールから生まれた数ではなく、決め打ちの出発点となる
// つまり3項目から、「前2つの数字の和を代入」処理が適用される
// 1項目と2項目は特別
// function generateFibonacci (value: number): number[] | string {
//   if (value < 3) {
//     return "3以上を入力してください";
//   }; // エラーを文字列で返すのは TypeScript らしくない書き方
//   const resultArray = [0, 1];
//   for (let i = 0; i < value - 2; i++) {
    // ! を末尾につけることで「この値は null でも undefined でもないと自分が保証する」と TypeScript に伝える
//     const prev1 = resultArray[resultArray.length - 1]!;
//     const prev2 = resultArray[resultArray.length - 2]!;
//     const calcResult = prev1 + prev2;
//     resultArray.push(calcResult);
//   }
//   return resultArray;
// }
// console.log(generateFibonacci(5));

// 自分のコード 2回目
function generateFibonacci (value: number): number[] {
  const resultArray = [0, 1];
  if (value < 2) {
    return resultArray;
  }; 
  for (let i = 0; i < value - 2; i++) {
    const prev1 = resultArray[resultArray.length - 1]!;
    const prev2 = resultArray[resultArray.length - 2]!;
    const calcResult = prev1 + prev2;
    resultArray.push(calcResult);
  }
  return resultArray;
}
console.log(generateFibonacci(5));

// 解答例
// function generateFibonacci(n) {
//   if (n <= 0) return [];
//   if (n === 1) return [0];
//   const fib = [0, 1];
//   for (let i = 2; i < n; i++) {
//     fib.push(fib[i - 1] + fib[i - 2]);
//   }
//   return fib;
// }
// console.log(generateFibonacci(10));

// 23. 配列の重複除去
// 配列 [1, 2, 2, 3, 4, 4, 5] から重複する要素を取り除き、ユニークな値だけの配列を返す関数 removeDuplicates を作成してください。

// 自分のコード 1回目
function removeDuplicates (numbers: ArrayDatas<number>): ArrayDatas<number> {
  return [...new Set(numbers)]
}
console.log(removeDuplicates(duplicatedNumbers));