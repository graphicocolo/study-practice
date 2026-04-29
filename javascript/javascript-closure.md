# JavaScript 実践 クロージャ

## 実例

### カスタムフック内での関数参照（useTaxCalculator.ts）

`const` のアロー関数は巻き上げ（hoisting）されないが、以下のコードは正常に動作する。

```typescript
export function useTaxCalculator() {
  // ① handleBlur が「定義」される（関数の中身はまだ実行されない）
  const handleBlur = (value: string) => {
    setIsTouched(true)
    validateAndSetError(value) // ← この行はまだ実行されない
  }

  // ② validateAndSetError が定義される
  const validateAndSetError = (value: string) => {
    // ...
  }

  // ③ return でコンポーネントへ渡す
  return { handleBlur, validateAndSetError, ... }
}
```

**理由：クロージャ**

- ①の時点で `handleBlur` の関数本体は実行されない
- `validateAndSetError` を呼び出す処理は、コンポーネントが `handleBlur` を呼んだときに初めて実行される
- コンポーネントが `handleBlur` を呼ぶのは `useTaxCalculator()` が return した後なので、その時点では ② がすでに完了している
- アロー関数は変数を「値」ではなく「参照」でキャプチャするため、後から代入された値も正しく参照できる

**`const` に巻き上げはない（temporal dead zone）**

```typescript
// これはエラーになる
console.log(foo) // ReferenceError: Cannot access 'foo' before initialization
const foo = () => {}
```

`function` 宣言と異なり、`const` のアロー関数は宣言より前に参照すること自体がエラーになる。
今回エラーにならないのは、`handleBlur` が `validateAndSetError` を参照しているだけで、定義時点では実行していないから。これがクロージャです。

クロージャとは「外側のスコープの変数を記憶した関数」のことです。「閉じ込める」のは処理ではなく、変数（環境） です。**「外側の変数を参照し続ける」仕組み**がクロージャ

## 参照

- [クロージャ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Closures)
- [一時的なデッドゾーン (TDZ)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let#一時的なデッドゾーン_tdz)
- [Hoisting (巻き上げ、ホイスティング)](https://developer.mozilla.org/ja/docs/Glossary/Hoisting)