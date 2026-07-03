// ② 関数ファイルを作る

// import { User, ApiResponse } from "./study15-types.js";

// ユーザー一覧を受け取って role が "admin" のものだけを返す関数 filterAdmins を書く
// 引数の型・戻り値の型に User を使う
// function filterAdmins(datas: User[]): User[] {
//   return datas.filter((data) => data.role === "admin");
// }

// User[] を受け取って ApiResponse<User[]> を返す関数 wrapResponse を書く
// status は 200、message は "OK" で固定してよい
// function wrapResponse(api: User[]): ApiResponse<User[]> {
//   return {
//     data: api,
//     status: 200,
//     message: "OK"
//   };
// }

// export { filterAdmins, wrapResponse };

// ⑤ `export type` で型だけを再エクスポートする

import { User } from "./study15-types.js";

export type { User };