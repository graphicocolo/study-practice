// ① `type` でオブジェクトの型を定義する
// 以下のプロパティを持つ型を type で定義する
// - id: number
// - name: string
// - email: string
// 定義した型を使ってオブジェクトを1つ作る
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: "Mike",
    email: "test1@example.com"
  },
  {
    id: 2,
    name: "Alice",
    email: "test2@example.com"
  },
  {
    id: 3,
    name: "Smith",
    email: "test3@example.com"
  }
];

// ② `interface` で同じ型を定義する
// ①と同じプロパティ構成を interface で書き直す
// 名前は別にして（例：UserType と UserInterface）
// 両方でオブジェクトを作って、使い勝手に違いがあるか確認する
interface LoggedInUser {
  id: number;
  name: string;
  email: string;
};

const loggedInUsers: LoggedInUser[] = [
  {
    id: 4,
    name: "Joe",
    email: "test4@example.com"
  },
  {
    id: 5,
    name: "Sue",
    email: "test5@example.com"
  },
  {
    id: 6,
    name: "Bob",
    email: "test6@example.com"
  },
];

// ③ `interface` の宣言マージを試す
// interface は同じ名前で2回定義するとマージされる
// 以下を実際に書いて、エラーにならないか確認する
interface Animal {
  name: string;
};
interface Animal {
  age: number;
};

const animals: Animal[] = [
  {
    name: "dog", // name のみだと IDE でエラー
    age: 5,
  },
];

// ④ `type` で同じことをしようとする
// ③と同じことを type で試す
// type Animal = { name: string };
// type Animal = { age: number };  // これを書くとどうなるか確認する
type OtherAnimal = { name: string };
// type OtherAnimal = { age: number }; // IDE でエラー 識別子 'OtherAnimal' が重複しています。
// > 型エイリアスは継承は行えません。代わりに交差型(&)を使用することで、継承と似たことを実現できます。
// type Animal = {
//   name: string;
// };
// type Creature = {
//   dna: string;
// };
// type Dog = Animal &
//   Creature & {
//     dogType: string;
//   };

// ⑤ `type` でしか書けないものを書く
// ユニオン型を type で定義する（interface では書けない）
// 例：'grid' か 'list' のどちらかを表す型
type SampleUnion = "grid" | "list";
// プリミティブの別名を type で定義する
// 例：string の別名として ID 型を作る
type Str = string;

// ⑥ どちらを使うか判断する
// 迷ったら？プロジェクトの慣例に従う。React では `type` 統一が多い。混在は避ける

// Q1: オブジェクトの型定義には type と interface どちらを使うべきか？
// A1: 拡張する可能性がある場合は interface、そうでない場合は type
// Q2: ユニオン型を作りたいときはどちらを使うべきか？
// A2: type
// Q3: なぜ「どちらかに統一する」ことが大事なのか？
// A3: どちらかに統一する必要があるのか？拡張する可能性がある場合は interface、そうでない場合は type とするので良いのではないか？
// ↓
// この疑問は自然で正しい感覚です。ただ、「場合によって使い分ける」より「統一する」が推奨される理由があります：
// - コードを読む人が「なぜここだけ interface なんだろう？」と意図を読もうとしてしまう
// - 「拡張するかどうか」は後から変わることが多く、使い分けの判断コストが積み重なる
// - React コミュニティでは type に統一するのが慣例になっているため、チームに合わせた方が摩擦が少ない
// **統一の目的は「読み手の認知コストを下げること」**です。A3 の答えとしては「混在させると読み手が使い分けの意図を探してしまうため、どちらかに統一して認知コストを減らすことが大事」が完答です。