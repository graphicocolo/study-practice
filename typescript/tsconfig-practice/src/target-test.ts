const greet = (name: string) => `Hello, ${name}`;
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// target を "ES5" コンパイル結果
// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// var greet = function (name) { return "Hello, ".concat(name); };
// var nums = [1, 2, 3];
// var doubled = nums.map(function (n) { return n * 2; });

// target を "ES2020" コンパイル結果
// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// const greet = (name) => `Hello, ${name}`;
// const nums = [1, 2, 3];
// const doubled = nums.map(n => n * 2);