// ① `Array<T>` を読む
// 以下の2つの書き方は同じ意味
// string[] と Array<string> を両方書いて確認する
// number[] と Array<number> も同様に確認する
// さらに：string[] の変数に number を push しようとするとどうなるか確認する
const messages: string[] = [];
const greetings: Array<string> = [];
const counts: number[] = [];
const ids: Array<number> = [];

// const updateMessages = [...messages].push(0); // 型 'number' の引数を型 'string' のパラメーターに割り当てることはできません。
// const updateCounts = [...counts].push("ありがとう"); // 型 'string' の引数を型 'number' のパラメーターに割り当てることはできません。
// greetings, ids でも同様

// ② `Promise<T>` を読む
// 1秒後に文字列 "完了" を返す非同期関数 wait を書く
// 戻り値の型を Promise<string> と明示する
// async/await で呼び出して、返ってくる値の型が string になっているか確認する
function wait(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("完了"), 1000);
  });
}
async function textAccept() {
  return await wait();
}
// new Promise(...) 自体が Promise オブジェクトなので、wait() を呼び出すと Promise<string> が返ります。
// await wait() とすると Promise が解決されて中身の string（"完了"）が取り出せます。
// wait()         → Promise<string>（Promiseのまま）
// await wait()   → string（中身の "完了"）
textAccept();

// ③ ジェネリクス関数を書く（基本）
// 配列の先頭要素を返す関数 first を書く
// number[] を渡したら number が返る
// string[] を渡したら string が返る
// any を使わず、T を使って書くこと
// 使用例：
// first([1, 2, 3])    → 1（型は number）
// first(["a", "b"])   → "a"（型は string）

// <T> はジェネリクスを表す慣習的な書き方
// T は "Type" の頭文字で、型の仮引数によく使われる名前です。ただし T である必要はなく、任意の名前が使えます

// undefined 判定が必要なわけ
// first(); // そもそも関数を呼べない 関数を呼び出すが中まで到達せずエラー
// first([]); // undefined が返る これが | undefinedが必要な理由

function first<T>(arr: Array<T>): T | undefined {
  // if (!arr[0]) return; // 先頭要素が truthy かどうか確認したい、ということになる
  // [0] の場合 undefined になってしまう
  if (arr.length === 0) return; // 配列が空かどうか確認したい、とするのが良い
  return arr[0];
}
// const numberArray = [1, 2, 3];
first([1, 2, 3]);
first(["a", "b"]);
first([]);

// ④ ジェネリクス関数を書く（引数が2つ）
// 2つの値をタプル（組）にして返す関数 pair を書く
// 型引数を2つ（T, U）使うこと
// 使用例：
// pair("hello", 42)      → ["hello", 42]（型は [string, number]）
// pair(true, "yes")      → [true, "yes"]（型は [boolean, string]）

// 自分のコード
// function pair<T, U>(v1: T, v2: U): [T, U] | undefined {
//   if (v1 === undefined || v2 === undefined) return;
//   return [v1, v2];
// }
// undefined チェックが不要です
// pair("hello", 42) のように呼び出す限り、v1 と v2 は必ず渡されます。undefined になるケースがないので、チェックなしで [T, U] を返すだけで完結します。

// pair() のように引数なしで呼び出すと、TypeScript がその時点でエラーにする
// 関数の中まで到達しないので、undefined を返す処理は実行されません。「関数の中で undefined が返り得るか」ではなく「そもそも呼び出し自体がエラー」になります。

// 修正後
function pair<T, U>(v1: T, v2: U): [T, U] {
  return [v1, v2];
}
pair("hello", 42);
pair(true, "yes");

// ⑤ ジェネリクスを使った型定義
// キーが string、値が T の「ラベル付き結果」を表す type を定義する
// プロパティは label: string と value: T の2つ
// 使用例：
// const score: Labeled<number> = { label: "点数", value: 95 };
// const name: Labeled<string> = { label: "名前", value: "Alice" };
type Labeled<T> = {
  label: string;
  value: T;
}
const score: Labeled<number> = { label: "点数", value: 95 };
const name: Labeled<string> = { label: "名前", value: "Alice" };

// ⑥ 制約（extends）をつける
// オブジェクトの id プロパティを返す関数 getId を書く
// T は { id: number } を持つことを保証する（extends で制約をつける）
// id プロパティを持たないオブジェクトを渡すとエラーになることを確認する
// 使用例：
// getId({ id: 1, name: "Alice" })  → 1
// getId({ name: "Bob" })           → エラーになる

// 自分のコード
// 今の書き方は User 型に依存しているため、汎用性がありません。
// id が number 固定ならジェネリクスにする意味がない
// T でジェネリクスにするのは「型を呼び出す側が決めたい」とき
// type User<T extends number> = { // 「T は number 型でなければならない User 型」という意味
//   id: T;
//   name: string;
// }
// function getId({ id, name }: User<number>): number {
//   return id;
// }
// 動きはしますが、課題の意図と少しずれています
// 課題は「getId 関数自体をジェネリクスにする」ことでした。

// 修正後
// User 以外の「id を持つ任意のオブジェクト」にも使えるジェネリクス関数になります
type User<T> = {
  id: T;
  name: string;
}
// T は少なくとも id: number を持っている型でなければならない、という制約
// 「id: number を持つならどんな型でも受け付ける」という意味です。User 型に縛られず、id さえあれば何でも渡せるのがジェネリクスで制約をつける利点です。
function getId<T extends { id: number }>(obj: T): number {
  return obj.id;
}

getId({ id: 1, name: "Alice" });
getId({ id: 1 });
// getId({ name: "Bob" }); // オブジェクト リテラルは既知のプロパティのみ指定できます。'name' は型 '{ id: number; }' に存在しません。