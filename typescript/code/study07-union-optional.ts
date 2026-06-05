// ① Union 型の基本
// string または number を受け付ける変数 id を宣言する
// string を代入して、次に number を代入してみる
// 関係ない型（boolean など）を代入するとどうなるか確認する
let id: string | number = "テキスト型を代入";
id = 3;
// id = true; // IDE でエラー 型 'boolean' を型 'string | number' に割り当てることはできません。

// ② Union 型を引数に使う
// string または number を受け取り、
// 「入力値：〇〇」という文字列を返す関数 printId を書く
// 引数の型を Union 型にすること
function printId (insertVar: string | number): string {
  return `入力値：${insertVar}`;
}
console.log(printId("abc"));
console.log(printId(1));

// ③ Union 型と `typeof` で分岐する
// ②の関数を改良する
// 引数が number のときは 0 埋め2桁（例：05）で返す
// 引数が string のときはそのまま返す
// typeof を使って型で分岐すること
function updatedPrintId (insertVar: string | number): string {
  // 関数に終了の return ステートメントがないため、戻り値の型には 'undefined' が含まれません。
  // という IDE のエラー（戻り値の: string の部分）
  // ↓こういう場合どうすれば良いか？
  // if (typeof insertVar === "string") return `入力値：${insertVar}`;
  // if (typeof insertVar === "number") {
  //   const parsedVar = insertVar.toString().padStart(2, "0");
  //   return `入力値：${parsedVar}`;
  // }
  if (typeof insertVar === "string") return `入力値：${insertVar}`;
  else {
    const parsedVar = insertVar.toString().padStart(2, "0");
    return `入力値：${parsedVar}`;
  }
  // もしくは
  // if (typeof insertVar === "string") {
  //   return `入力値：${insertVar}`;
  // } else (typeof insertVar === "number") {
  //   const parsedVar = insertVar.toString().padStart(2, "0");
  //   return `入力値：${parsedVar}`;
  // }
}
console.log(updatedPrintId("文字列"));
console.log(updatedPrintId(8));

// ④ Optional プロパティ（`?`）
// 以下のプロパティを持つ type を定義する
// - name: string（必須）
// - age: number（必須）
// - nickname: string（省略可能）
// nickname あり・なし両方のオブジェクトを作って、エラーにならないか確認する
type User = {
  name: string;
  age: number;
  nickname?: string; // nickname: string | undefined と同じ意味になる
}
const sampleUser: User = {
  name: "Hanna",
  age: 22,
};
const testUser: User = {
  name: "Tom",
  age: 20,
  nickname: "Tommy",
};

// ⑤ Optional 引数（`?`）
// name: string と greeting?: string を受け取る関数 greet を書く
// greeting が渡されたときは「greeting、name さん」
// 渡されなかったときは「こんにちは、name さん」を返す
function greet (name: string, greeting?: string) {
  if (greeting) { // オプショナルプロパティにアクセスする際は存在確認が必要
    return `${greeting}、${name} さん`;
  }
  return `こんにちは、${name} さん`;
}
console.log(greet("鈴木", "おはようございます"));
console.log(greet("川島"));

// ⑥ `undefined` との関係を確認する
// ④で定義した型の nickname プロパティにアクセスする
// nickname が undefined になり得ることを確認する
// nickname を使って文字列を組み立てるとき、そのままだと何が起きるか確認する
// （例：`${obj.nickname}さん` と書いたとき）
console.log(`${sampleUser.nickname}さん`); // undefinedさん となる
console.log(`${testUser.nickname}さん`); // Tommyさん となる