// ③ `import type` を使う（`study15-main.ts`）

// import type { User } from "./study15-types.js";
// import { filterAdmins, wrapResponse } from "./study15-utils.js";

// const users: User[] = [
//   {
//     id: 1,
//     name: "Alice",
//     role: "admin",
//   },
//   {
//     id: 2,
//     name: "Bob",
//     role: "viewer",
//   },
//   {
//     id: 3,
//     name: "Carol",
//     role: "admin",
//   },
// ];

// console.log(filterAdmins(users));
// console.log(wrapResponse(users));

// ④ `import` と `import type` の違いを確認する

// import type { User } from "./study15-types.js";

// const u: User = { id: 1, name: "Test", role: "viewer" }; // ← これは OK か？
// console.log(User); // ← これはどうなるか？ エラーになる 'User' は型のみを参照しますが、ここで値として使用されています。

// ⑤ `export type` で型だけを再エクスポートする

// types から直接ではなく、utils を経由して型を import
// import { User } from "./study15-utils.js";

// ⑥ 型と値が同名のとき（クラスの場合）

// import type { UserRecord } from "./study15-types.js";
import { UserRecord } from "./study15-types.js";

// import type { UserRecord }...とした場合は下記エラー
// 'import type' を使用してインポートされたため、'UserRecord' は値として使用できません。
// 型としては使えるがインスタンス化できない
const u = new UserRecord(1, "Alice");
u.display();