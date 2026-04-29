# JavaScript 実践 カリー化

## 概要

カリー化とは、複数の引数を受け取る関数を、**引数を1つずつ受け取る関数の連鎖**に変換することです。
JavaScriptに限らず、関数型プログラミング全般で使われる概念です。

目的は**「同じ構造を持つ関数を一つの雛形からまとめて作る」**こと

## 基本例

```js
// 通常の関数（引数を2つ同時に受け取る）
const add = (a, b) => a + b
add(1, 2) // 3

// カリー化（引数を1つずつ受け取る）
const curriedAdd = (a) => (b) => a + b
curriedAdd(1)(2) // 3

// 部分適用として使える
const addOne = curriedAdd(1)
addOne(2) // 3
addOne(5) // 6
```

### 平易な説明：「材料を一度に渡す」か「一つずつ渡す」かの違い

**日常の例：コーヒーの注文**

```
普通の関数 → 「トール、ラテ、砂糖あり」を一度に伝える

カリー化   → 「トール」と伝える
           → 「ラテ」と伝える
           → 「砂糖あり」と伝える
```

```js
// 普通：一度に全部渡す
const order = (size, type, sugar) => `${size} ${type} 砂糖${sugar}`
order('トール', 'ラテ', 'あり') // "トール ラテ 砂糖あり"

// カリー化：一つずつ渡す
const order = (size) => (type) => (sugar) => `${size} ${type} 砂糖${sugar}`
order('トール')('ラテ')('あり') // "トール ラテ 砂糖あり"
```

**カリー化のうまみ：途中まで渡せる**

```js
// 「トール」だけ先に決めておく
const tallOrder = order('トール')

// あとから種類だけ変えられる
tallOrder('ラテ')('あり')   // "トール ラテ 砂糖あり"
tallOrder('モカ')('なし')   // "トール モカ 砂糖なし"
```

「一部だけ決まっている関数」を先に作っておけるのが便利なところ。

一言でまとめると、**「あとで残りを渡せるように、関数を小分けにする技法」**。

useBmiCalculator.ts での話をすると

```ts
// setter（どの値を更新するか）だけ先に渡す
const handleInputChange = (setter) => (value) => {
  setter(value)
}
// 「体重を更新する」が決まったハンドラーを作る
const handleWeightChange = handleInputChange(setWeight)
// 「身長を更新する」が決まったハンドラーを作る
const handleHeightChange = handleInputChange(setHeight)
```

「コーヒーのサイズをトールに決めた注文係」を先に作っておくイメージです。あとは種類を伝えるだけでいい。

## 実例

### カスタムフック内でのハンドラーまとめ（useBmiCalculator.ts）

入力フィールドが増えた場合、setter を引数で受け取るハンドラーにまとめることができる。

```ts
  // 体重入力値変更イベントハンドラー
  const handleWeightChange = (value: string, max: number) => {
    setWeight(value)
    if (isTouched) validateAndSetError(value, max)
  }

  // 身長入力値変更イベントハンドラー
  const handleHeightChange = (value: string, max: number) => {
    setHeight(value)
    if (isTouched) validateAndSetError(value, max)
  }
```

```typescript
// study-app/react-practice/src/hooks/useBmiCalculator.ts
// カリー化を使ってまとめる場合
// どんな setter 関数を渡すかによって、異なるハンドラー関数が返ってくる
// handleInputChange に setWeight を渡した瞬間に、「setWeight専用のハンドラー」が生成される
const handleInputChange = (setter: (v: string) => void) => (value: string) => (max: number) => {
  // setter の型：「文字列を受け取って何も返さない関数」
  // setter（関数）を受け取る関数を定義し、その関数がさらにvalue（文字列）を受け取る関数を返す
  setter(value)
  if (isTouched) validateAndSetError(value, max)
}
// 「setWeightを使う」だけ決めた関数を作る
const handleWeightChange = handleInputChange(setWeight)
// 「setHeightを使う」だけ決めた関数を作る
const handleHeightChange = handleInputChange(setHeight)
```

```ts
// study-app/react-practice/src/components/BmiCalculator.tsx
...
onChange={(e) => handleWeightChange(e.target.value)(MAX_WEIGHT)}
...
onChange={(e) => handleHeightChange(e.target.value)(MAX_HEIGHT)}
```

入力フィールドが2つで明快な場合は、明示的に2つ書く方が読みやすいこともある。

```typescript
const handleWeightChange = (value: string, max: number) => {
  setWeight(value)
  if (isTouched) validateAndSetError(value, max)
}

const handleHeightChange = (value: string, max: number) => {
  setHeight(value)
  if (isTouched) validateAndSetError(value, max)
}
```

## 参照

[カリー化](https://developer.mozilla.org/ja/docs/Glossary/Currying)
