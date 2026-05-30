# TypeScript typeof型演算子

[typeof型演算子](https://typescriptbook.jp/reference/type-reuse/typeof-type-operator)

> TypeScriptのtypeofは変数から型を抽出する型演算子です。

```ts
const point = { x: 135, y: 35 };
type Point = typeof point;
```

```ts
export const COLORS = [
  { name: 'サンシャイン', value: 'sunshine', bgClass: '...', accent: '...' },
  { name: 'スカイ',       value: 'sky',       bgClass: '...', accent: '...' },
] as const  // ← 配列の中身をリテラル型として認識させる

// 型を配列から自動生成
export type NoteColor = typeof COLORS[number]['value']
// → 'sunshine' | 'sky' | ... が自動で作られる
```