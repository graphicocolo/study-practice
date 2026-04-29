# TypeScript const アサーション（`as const`）

`as const` はオブジェクトや配列の値を **「絶対に変更されない固定値」として TypeScript に伝える** ための記法。

## `as const` がない場合

```ts
export const STORAGE_KEYS = {
  THEME: 'pomodoro-theme',
}
```

TypeScript はこう解釈する：

```
THEME の型 → string（文字列ならなんでもOK）
```

`string` 型なので、理論上 `STORAGE_KEYS.THEME = 'なんか別の文字列'` と書き換えられる可能性があると TypeScript は考える。

## `as const` がある場合

```ts
export const STORAGE_KEYS = {
  THEME: 'pomodoro-theme',
} as const
```

TypeScript はこう解釈する：

```
THEME の型 → 'pomodoro-theme'（この文字列だけ）
```

`'pomodoro-theme'` という**具体的な値そのものが型**になる（リテラル型）。書き換えも不可になる。

## なぜ嬉しいのか

```ts
// as const なし → 引数の型が string なので、タイポしても気づけない
localStorage.getItem(STORAGE_KEYS.THEME)  // OK
localStorage.getItem('pomodoro-teme')     // タイポでもエラーにならない

// as const あり → STORAGE_KEYS.THEME は 'pomodoro-theme' 型として確定
// STORAGE_KEYS 経由で使えば、間違った文字列が紛れ込む余地がない
```

## 配列への適用

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator'] as const
// TypeScript の推論: readonly ['TaxCalculator', 'BmiCalculator']
// 配列が readonly（変更不可）になり、中身が文字列リテラル型になる
```

```ts
// as const なし
const VIEWS = ['TaxCalculator', 'BmiCalculator']
// TypeScript の推論: string[]
```

| | `as const` なし | `as const` あり |
|--|--|--|
| `typeof VIEWS` | `string[]` | `readonly ['TaxCalculator', 'BmiCalculator']` |
| `typeof VIEWS[number]` | `string` | `'TaxCalculator' \| 'BmiCalculator'` |

## `typeof VIEWS[number]` との組み合わせ

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator'] as const
type View = typeof VIEWS[number]
// → 'TaxCalculator' | 'BmiCalculator'
```

- `typeof VIEWS` → 変数から型を取り出す
- `[number]` → 「数値インデックスでアクセスしたときの型」＝ 全要素のユニオン型

要素が増えると型も自動で増えるので、配列が「唯一の真実の情報源」になり、追加し忘れによる型との不一致が起きない。

## `as const` が安全な理由

```ts
// ❌ 危険な as：実態より広い型 → 狭い型に強制（嘘をつく）
e.target.value as 'TaxCalculator' | 'BmiCalculator'

// ✅ 安全な as const：広く推論された型 → 実態通りに正確にする（正直にする）
['TaxCalculator', 'BmiCalculator'] as const
```

## まとめ

- `as const` = 「この値は絶対変わらないし、変えさせない」と TypeScript に宣言すること
- 値がリテラル型として確定するため、誤った値が紛れ込みにくくなる
- 定数オブジェクト・定数配列には積極的に使う
