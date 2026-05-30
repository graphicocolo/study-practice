// ① 配列の型定義
const animals: string[] = ["dog", "cat", "bird"]; // こちらの書き方の方が多く使われる
const foods: Array<string> = ["pasta", "soup", "bread"];
const scores: number[] = [50, 40, 100]; // こちらの書き方の方が多く使われる
const points: Array<number> = [30, 50, 40];

// ② 配列に違う型を混ぜようとする
// string[] の配列に number を push しようとするとどうなるか確認する
// const addedAnimals: string[] = [...animals].push(100); // 型 'number' を型 'string[]' に割り当てることはできません。← push メソッドは配列の長さを返すためコード自体が間違い
// animals.push(4); // 型 'number' の引数を型 'string' のパラメーターに割り当てることはできません。
animals.push("fish"); // 問題なし
// const addedAnimals: string[] = [...animals, 100]; // 型 'string | number' を型 'string' に割り当てることはできません。
const addedAnimals: (string | number)[] = [...animals, 100]; // 問題なし

// ③ オブジェクトの型定義
// 以下の情報を持つオブジェクトに型をつけて宣言する
// - id: number
// - name: string
// - isActive: boolean
const initializedUsers: { id: number, name: string, isActive: boolean }[] = [
  {
    id: 1,
    name: "Mike",
    isActive: true,
  },
  {
    id: 2,
    name: "John",
    isActive: false,
  },
  {
    id: 3,
    name: "Nancy",
    isActive: false,
  }
]

// ④ type を使って型に名前をつける
// ③で書いた型を、type キーワードで名前をつけて定義し直す
// その型を使ってオブジェクトを2つ作る
// ⑤ オブジェクトの配列
type User = {
  id: number
  name: string
  isActive: boolean
}
const users: User[] = [
  {
    id: 1,
    name: "Mike",
    isActive: true,
  },
  {
    id: 2,
    name: "John",
    isActive: false,
  },
  {
    id: 3,
    name: "Nancy",
    isActive: false,
  }
]
const authorizedUsers: User[] = [
  {
    id: 10,
    name: "Kevin",
    isActive: true,
  },
  {
    id: 11,
    name: "Alice",
    isActive: true,
  }
]

// 配列をループして、name だけ console.log で出力する
users.forEach((user) => console.log(user.name))