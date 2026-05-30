# TypeScript type と interface

ほとんどの場面ではどちらでも同じ。ただ、できることに違いがある。

## 使い分けの目安

| 場面 | どちらを使う |
|------|------------|
| オブジェクトの型定義 | どちらでも OK（プロジェクトの慣例に従う） |
| ユニオン型・交差型 | `type` |
| クラスに `implements` させる | `interface` |
| ライブラリの型定義 | `interface`（利用者が拡張できるように） |

## 現実的には

React プロジェクトでは `type` に統一しているケースが多い。`interface` と `type` を混在させると読み手が混乱するので、**どちらかに統一する**のが一番大事。

## 基本的な書き方

```ts
// type
type User = {
  name: string
  age: number
}

// interface
interface User {
  name: string
  age: number
}
```

この2つは実質同じ。

## 主な違い

### ① `interface` は後から拡張できる（宣言のマージ）

```ts
interface User {
  name: string
}
interface User {
  age: number  // 後から追加できる
}
// → { name: string, age: number } として扱われる

// type は同じ名前を2回定義するとエラー
type User = { name: string }
type User = { age: number }  // ❌ エラー
```

### ② `type` はオブジェクト以外も定義できる

```ts
// ユニオン型 → type しか書けない
type ViewType = 'TaxCalculator' | 'BmiCalculator'

// プリミティブの別名 → type しか書けない
type ID = string

// interface はオブジェクト形状の定義のみ
```
