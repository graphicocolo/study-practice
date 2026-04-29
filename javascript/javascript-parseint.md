# JavaScript 実践 `parseInt`

`const price = parseInt(priceInput.value, 10);` と `const price = Number.parseInt(priceInput.value, 10);` は何が違うのでしょうか

結論：同じものです

parseInt() と Number.parseInt() は全く同じ関数です。

`console.log(parseInt === Number.parseInt); // → true`

もともとJavaScriptには parseInt() というグローバル関数だけがありました。

その後、ES2015（ES6）で Number オブジェクトの中にも同じ関数が追加されました。理由は「数値に関する関数は Number にまとめた方が整理されるから」です。

```js
// 古くからある書き方
parseInt("1000", 10);

// ES2015 で追加された書き方
Number.parseInt("1000", 10);
```

## `Math.floor()` vs `parseInt()` の使い分け

### 目的が違う

| | `Math.floor()` | `parseInt()` |
|---|---|---|
| **目的** | 数値を切り捨て | 文字列→整数に変換 |
| **入力** | 数値 | 文字列（数値も可） |
| **負の数** | `-1.7` → `-2` | `-1.7` → `-1` |

### 負の数の挙動の違いが重要

```js
Math.floor(-1.7)  // → -2  (数直線で左方向に切り捨て)
parseInt('-1.7')  // → -1  (小数点以下を単純に切り落とす)

Math.floor(1.7)   // → 1
parseInt('1.7')   // → 1   (正の数では同じ結果)
```

### 税込計算での使い分け

```js
// ✅ Math.floor() を使う場面 → 計算結果を切り捨てたい
const tax = Math.floor(price * 1.1);  // 円未満切り捨て

// ✅ parseInt() を使う場面 → input の値を数値に変換したい
const price = parseInt(e.target.value, 10);  // "1000" → 1000
```

### コツまとめ

- **計算の途中・結果を整数にしたい** → `Math.floor()`
- **ユーザー入力（文字列）を数値に変換したい** → `parseInt()`（第2引数の `10` を忘れずに）
- `parseInt()` は変換が目的なので、その後に切り捨てが必要なら `Math.floor()` と組み合わせる

```js
// よくある組み合わせ
const price = Math.floor(parseInt(e.target.value, 10) * 1.1);
```

