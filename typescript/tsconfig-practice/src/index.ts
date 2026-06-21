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