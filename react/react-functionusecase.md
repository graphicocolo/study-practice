# React function宣言とアロー関数の使い分け

## 使い分けの基準

| 場所 | 書き方 | 理由 |
|------|--------|------|
| トップレベルの汎用関数 | `function` 宣言 | 独立した処理の単位 |
| フック本体 | `export function` | Reactの慣例 |
| フック内部の関数 | アロー関数 | スコープに属する処理 |

## `function` 宣言を使う場面

- フックそのもの（`export function useBmiCalculator`）
- ファイルのトップレベルに置く独立した関数

巻き上げが効くのでファイルのどこに書いても参照できること、「これは独立した処理の単位だ」という意図が読み手に伝わりやすい。

```ts
// トップレベルの汎用関数
function calculateBmi(weight: number, height: number): number { ... }
function validateInputToInteger(value: string, max: number) { ... }

// フック本体
export function useBmiCalculator() { ... }
```

## アロー関数を使う場面

- フック内部のハンドラーや小さなロジック

フック内部の関数はステートや他の関数を「閉じ込めて使う」クロージャとして機能する。アロー関数で書くことで「このスコープに属する処理」という意図が伝わりやすくなる。

```ts
export function useBmiCalculator() {
  const validateAndSetError = (value: string, max: number) => { ... }
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => { ... }
  const handleReset = () => { ... }
}
```
