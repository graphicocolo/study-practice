import { add } from "./math.js";
console.log(add(1, 2));

// module を "commonjs"
// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// const math_1 = require("./math");
// console.log((0, math_1.add)(1, 2));

// module を "ESNext"
// import { add } from "./math";
// console.log(add(1, 2));

console.log(process.env.PATH);
// インストール前：
// 名前 'process' が見つかりません。ノードの型定義をインストールする必要がありますか? `npm i --save-dev @types/node` を試してから、tsconfig の型フィールドに 'node' を追加してみてください。
// インストール後：
// エラーなし

console.log(__dirname);

declare module "my-legacy-lib" {
  // モジュールが export する関数・型を宣言する
  export function doSomething(value: string): number;
  export const version: string;
}

import { doSomething } from "my-legacy-lib";