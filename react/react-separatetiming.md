# React コンポーネント切り分けの実例

## 税込計算コンポーネントから関数を切り分け？

```ts
// study-app/react-practice/src/components/TaxCalculator.tsx
...
// 文字列を受け取り、検証し、数値にして返す関数
// 今回はtaxRateはセレクトボックスで固定されているため、priceのみ検証する
// サーバーにデータを送る場合はサーバー側で必ず検証する
function validateInputToInteger(value: string): { price: number } | { error: string } {
  if (value.trim() === '') return { error: '価格を入力してください' } // 空文字
  const num = Number(value) // Number() は数値に変換できない文字列を渡すと NaN を返す
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' } // 数値でない
  if (num < 1) return { error: '1以上の数値を入力してください' } // 0以下
  return { price: Math.floor(num) }
}

// 税込計算を行う関数
function calculateTaxInTotalPrice(price: number, taxRate: number): number {
  return Math.floor(price + (price * taxRate / 100))
}
...
```

この2つの関数を util ディレクトリに切り分けるべきか？

## 結論：今の段階では util に切り出すのは早い

### util に切り出すべき基準

| 条件 | 今の2関数 |
|---|---|
| 複数のコンポーネントで実際に使う | まだ1箇所のみ |
| ロジックが純粋（入力→出力のみ） | `validateInputToInteger` はTaxCalculator依存 |
| テストを書きたい | これが理由なら◯ |

### 各関数の問題点

**`calculateTaxInTotalPrice` は汎用関数に向いていない**

- 関数名が「税込計算」に特化していて他コンポーネントでの使い回しが想定しにくい
- 汎用関数として util に置くなら `addPercentage(value, rate)` のような純粋な計算関数にすべき

**`validateInputToInteger` は TaxCalculator の仕様に依存している**

- 「1以上」「切り捨て」「返り値の型が `{ price: number }`」など、税込計算フォーム固有の仕様が混入
- 汎用として使い回そうとすると引数でオプションを増やすことになりがち

### 今やるなら「カスタムフック」の方が筋がいい

```
src/
  hooks/
    useTaxCalculator.ts   ← state + ロジックをまとめる
  components/
    TaxCalculator.tsx     ← JSXだけ残す
```

- `useState` や `handleSubmit` などのロジックをカスタムフックに移す方が React らしい分離になる
- util は本当に複数箇所で使う計算が出てきたときに作るので十分

---

## 税込計算コンポーネントロジック部分をカスタムフック化

### 考え方：「`return` より上をごっそり別ファイルに移す」だけ

```tsx
export default function TaxCalculator() {

  // ↓ ここから return の直前まで = ロジック（フックに移す）
  const [price, setPrice] = useState('')
  // ... useState, handleSubmit, handleReset, validateAndSetError ...

  // ↓ ここから下 = JSX（コンポーネントに残す）
  return (
    <div>...</div>
  )
}
```

### 手順

**ステップ1：`src/hooks/useTaxCalculator.ts` を新規作成**

ロジック部分をそのまま貼り付け、JSXが使う変数・関数を `return {}` で返す。

```ts
import { useState } from 'react'

// validateInputToInteger と calculateTaxInTotalPrice もここに移す

export function useTaxCalculator() {
  const [price, setPrice] = useState('')
  const [taxRate, setTaxRate] = useState('8')
  const [totalPrice, setTotalPrice] = useState('ー')
  const [error, setError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false)

  const handleSubmit = ...
  const handleReset = ...
  const validateAndSetError = ...

  // JSX が必要なものを全部返す
  return { price, setPrice, taxRate, setTaxRate, totalPrice, error, isTouched, handleSubmit, handleReset, validateAndSetError }
}
```

**ステップ2：コンポーネント側はフックを呼ぶだけにする**

```tsx
import { useTaxCalculator } from '../hooks/useTaxCalculator'

export default function TaxCalculator() {
  const { price, setPrice, ... } = useTaxCalculator()

  return (
    <div>...</div>  // JSXはそのまま
  )
}
```

### やることまとめ（4ステップ）

1. `hooks/useTaxCalculator.ts` を作る
2. `return` より上のコードをそのまま移す（`useState` の import も一緒に）
3. JSXが使う変数・関数を `return {}` で返す
4. コンポーネント側で `useTaxCalculator()` を呼んで分割代入する

動作は変わらない。コードを移動させるだけ。

---

## フックの設計（何を公開すべきか）

原則：コンポーネントは「何が起きたか（イベント）」を伝え、「どう状態を変えるか」はフックが決める、というカプセル化が設計の指針。

```ts
// study-app/react-practice/src/hooks/useTaxCalculator.ts
...
  // 入力フィールドがフォーカスを失ったときのイベントハンドラー
  const handleBlur = (value: string) => {
    setIsTouched(true)
    validateAndSetError(value)
  }
  return {...handleBlur,...} // study-app/react-practice/src/components/TaxCalculator.tsx で使うために setIsTouched を直接公開しない
...
```

**なぜ setIsTouched は公開すべきでないか**

isTouched には明確なビジネスルールがあります：

false → true になるのは「blur時」か「submit時」の2箇所だけ

このルールはフックの中で守られるべきです。もし setIsTouched をコンポーネントに渡してしまうと：

```ts
// コンポーネントが自由に呼べてしまう（意図しない使われ方が可能になる）
setIsTouched(true)  // ← なぜここで？というコードが書けてしまう
setIsTouched(false) // ← リセット以外でfalseにするのは本来おかしい
```

フックの設計として「isTouched をどこで・どのように変えるか」はフック内部の責務です。コンポーネントは「blurした」「submitした」というイベントを通知するだけで、状態の変え方はフックに任せるのが正しい分離です。

**`setPrice / setTaxRate` が公開されている理由**

「使うから渡している」という側面はありますが、正確には現時点ではそういう設計になっているということです。

実は onChange のロジックを見ると：

```ts
          onChange={(e) => {
            const value = e.target.value
            setPrice(value) // ← フックから受け取ったsetter
            if (isTouched) { // ← フックから受け取ったstate
              validateAndSetError(value) // ← フックから受け取った関数
            }
          }}
```

これは「価格が変わったときのロジック」がコンポーネント側に漏れ出している状態とも言えます。より厳密に設計するなら：

```ts
// useTaxCalculator.ts に閉じ込める案
const handlePriceChange = (value: string) => {
  setPrice(value)
  if (isTouched) {
    validateAndSetError(value)
  }
}

// TaxCalculator.tsx がシンプルになる
onChange={(e) => handlePriceChange(e.target.value)}
```

こうすれば setPrice も validateAndSetError も isTouched もコンポーネントに渡す必要がなくなります。

カスタムフックの公開設計：判断基準

| 状態/関数           | 公開すべきか             | 理由                                         |
| ------------------- | ------------------------ | -------------------------------------------- |
| setIsTouched        | 公開しない               | 変更タイミングのルールをフックで守る         |
| isTouched           | 公開する                 | コンポーネントが表示に使う（読み取り専用で参照） |
| setPrice            | 現状は公開、理想は非公開 | handlePriceChange に閉じ込めることができる   |
| setTaxRate          | 現状は公開、理想は非公開 | handleTaxRateChange に閉じ込めることができる |

原則：コンポーネントは「何が起きたか（イベント）」を伝え、「どう状態を変えるか」はフックが決める、というカプセル化が設計の指針。

さらにリファクタリングを考えると...

```ts
// study-app/react-practice/src/hooks/useTaxCalculator.ts
// 現状のreturn
  return {
    price,
    setPrice, // ← コンポーネントのonChangeロジックと混在
    taxRate,
    setTaxRate, // ← 同上
    totalPrice,
    error,
    isTouched, // ← onChangeの条件分岐に使われている
    handleBlur,
    handleSubmit,
    handleReset,
    validateAndSetError // ← onChangeの中で直接呼ばれている
  }
```

setPrice / setTaxRate / isTouched / validateAndSetError の4つは、コンポーネント側の onChange にロジックが漏れ出している原因です。

理想的なリファクタリング後のreturnはこうなります：

```ts
  return {
    price,
    taxRate,
    totalPrice,
    error,
    handlePriceChange, // ← setPrice + 条件付きvalidateAndSetError を内包
    handleTaxRate, // setTaxRate を内包
    handleBlur,
    handleSubmit,
    handleReset,
  }
```

コンポーネント側もシンプルになります：

```ts
onChange={(e) => handlePriceChange(e.target.value)}
// ↑ setPrice / isTouched / validateAndSetError を知らなくてよい

onChange={(e) => handleTaxRateChange(e.target.value)}
```

「コンポーネントはイベントを伝えるだけ、ロジックはフックが持つ」という原則を徹底した形です。