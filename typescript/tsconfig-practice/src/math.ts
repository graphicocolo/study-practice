export function add(a: number, b: number): number {
  return a + b;
}

// module を "commonjs"
// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.add = add;
// function add(a, b) {
//     return a + b;
// }

// module を "ESNext"
// export function add(a, b) {
//     return a + b;
// }