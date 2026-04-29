# JavaScript 実践 `isNan`

`isNaN()` と `Number.isNaN()` も同じですか

NaN = 非数 = 数字ではない

これは違います。 parseInt のケースとは異なるので注意が必要です。

|    |  isNaN()  |  Number.isNaN()  |
| ---- | ---- | ---- |
|  動作  |  引数を数値に変換してから判定  |  変換せずそのまま判定  |
|  厳密さ  |  ゆるい  |  厳密  |

- isNaN() → 「数値として解釈できないか？」を判定
- Number.isNaN() → 「値が NaN そのものか？」を判定

**Number.isNaN() で true になるのは NaN を渡したときだけ**です。

```js
// 文字列 "hello"
isNaN("hello") // → true（"hello"を数値変換 → NaN → true）
Number.isNaN("hello") // → false（文字列はNaNそのものではない）

// 文字列 "123"
isNaN("123") // → false（"123"を数値変換 → 123 → NaNではない）
Number.isNaN("123")    // → false

// undefined
isNaN(undefined) // → true（undefinedを数値変換 → NaN → true）
Number.isNaN(undefined)// → false

// 本物の NaN
isNaN(NaN)  // → true
Number.isNaN(NaN)      // → true
```

現在の main.js について

`if (priceInput.value === "" || isNaN(priceInput.value)) {`

ここでは「ユーザーの入力が数値として解釈できないか」を判定したいので、isNaN() の方が意図に合っています。 もし Number.isNaN() に変えると、"hello" のような入力を弾けなくなります。