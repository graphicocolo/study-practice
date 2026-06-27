// ① `response.json()` が `any` になることを確認する
// async function fetchUser() {
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
//     if (!response.ok) {
//       throw new Error(`レスポンスステータス: ${response.status}`);
//     }
//     const result = await response.json(); // result は any
//     console.log(result);
//   } catch (error) {
//     console.error(error); // error は unknown
//   }
// }

// ② APIレスポンスの型を定義する
type User = {
  id: number;
  name: string;
  email: string;
  username: string;
}

// 間違った型
type WrongUser = { id: number; height: number }

// ③ 型アサーション（`as`）で型をつける
async function fetchUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }
    // const wrong = (await response.json()) as WrongUser;
    // console.log(wrong.height); // コンパイルは通る、でも実行時は undefined
    const result = (await response.json()) as User;
    console.log(result.name);
    // console.log(result.phone); // プロパティ 'phone' は型 'User' に存在しません。
  } catch (error) {
    console.error(error); // error は unknown
  }
}

// ④ ジェネリクスを使った fetch ラッパーを作る
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`レスポンスステータス: ${response.status}`);
  }
  return (await response.json()) as T;
  // 以下にするとエラー補足時の戻り値がないことでエラーが出る
  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error(`レスポンスステータス: ${response.status}`);
  //   }
  //   return (await response.json()) as T;
  // } catch (error) {
  //   console.error(error);
  // }
}
try {
  const user = await fetchJson<User>("https://jsonplaceholder.typicode.com/users/1");
} catch (error) {
  console.log(error);
}

// ⑤ `unknown` を使った安全なパターンと比較する
async function safeFetchUser(url: string): Promise<User | null> {
  // `response.json()` は仕様として `Promise<any>` と定義されている
  // : unknown にすると、TypeScript が「型が確定していないので as User できない」と判断し、typeof + in によるナローイングが必須になります。これが「as T より安全」と言える理由
  const data: unknown = await (await fetch(url)).json();
  if (typeof data === "object" && data !== null && "id" in data && "name" in data && "email" in data && "username" in data) {
    return data as User;
  } else {
    return null;
  }
}
try {
  const user = await safeFetchUser("https://jsonplaceholder.typicode.com/users/1");
} catch (error) {
  console.log(error);
}