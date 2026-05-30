# TypeScript 型アサーション（as キャスト）

`as` は TypeScript に「俺が正しいから黙って信じろ」と言う命令。**型チェックを強制的に無効化**するので、実態と型がズレてもエラーが出なくなる。

## 問題になるケース

select の onChange などユーザー入力を as でユニオン型に変換する場合：

```tsx
// option を増やしたとき
<select onChange={(e) => setShowElement(e.target.value as 'TaxCalculator' | 'BmiCalculator')}>
  <option value="TaxCalculator">税込価格計算</option>
  <option value="BmiCalculator">BMI計算</option>
  <option value="Settings">設定</option>  // ← 追加した
</select>
```

`e.target.value` は実行時に `"Settings"` になりえるが、`as` で強制的に型を付けているため TypeScript はエラーを出さない。結果、意図しない挙動が起きても静かにバグる。

```tsx
// as を外すと TypeScript の正直な反応が見える
onChange={(e) => setShowElement(e.target.value)}
// エラー: string 型を 'TaxCalculator' | 'BmiCalculator' 型に代入できません
```

## 安全な書き方

型ガード関数を使って実行時に値を検証する：

```tsx
const isValidView = (value: string): value is 'TaxCalculator' | 'BmiCalculator' => {
  return value === 'TaxCalculator' || value === 'BmiCalculator'
}

onChange={(e) => {
  const value = e.target.value
  if (isValidView(value)) {
    setShowElement(value) // ここでは型が保証されている
  }
}}
```

定数で管理する方法：

```tsx
const VIEWS = ['TaxCalculator', 'BmiCalculator'] as const
type View = typeof VIEWS[number] // 'TaxCalculator' | 'BmiCalculator'

const isView = (v: string): v is View => VIEWS.includes(v as View)
```

### `as const` について

`as const` は `as` キャストの一種だが、**安全な使い方**の代表例。「この値は絶対に変わらない、リテラルそのものとして扱え」と TypeScript に伝える。

**リテラルそのものとは？**

```ts
// 通常の型：string なら何でも入る
let a: string = 'hello'
a = 'world' // OK

// リテラル型：'TaxCalculator' という値しか入れられない
let b: 'TaxCalculator' = 'TaxCalculator'
b = 'BmiCalculator' // NG
```

### `type View = typeof VIEWS[number]` について

2つの TypeScript の機能を組み合わせています。

typeof VIEWS — 変数から型を取り出す

typeof は JavaScript の演算子と同じ見た目ですが、**型の文脈で使うと「この変数の型を取り出す」**という意味になります。

```ts
type T = typeof VIEWS
// → readonly ['TaxCalculator', 'BmiCalculator']
```

[number] — 配列の要素型を取り出す

```ts
type T = typeof VIEWS        // readonly ['TaxCalculator', 'BmiCalculator']
type U = typeof VIEWS[number] // 'TaxCalculator' | 'BmiCalculator'
```

[number] は「数値インデックスでアクセスしたときの型」という意味です。配列は VIEWS[0], VIEWS[1] のように数値でアクセスするので、そのすべての要素型がユニオン型になります。

直感的なイメージ

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator'] as const
VIEWS[0] // 'TaxCalculator'
VIEWS[1] // 'BmiCalculator'
VIEWS[number] // どの数値インデックスでもありえる → 'TaxCalculator' | 'BmiCalculator'
```

要素が増えると自動で型も増える

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator', 'Settings'] as const
type View = typeof VIEWS[number]
// → 'TaxCalculator' | 'BmiCalculator' | 'Settings'  ← 自動で増える
```

ユニオン型を手書きせずに、配列から自動生成できるのが便利な点です。配列が「唯一の真実の情報源」になるので、追加し忘れによる型との不一致が起きません。

**`as const` なしの場合：**

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator']
// TypeScript の推論: string[]
// 配列は後から変更できるため、中身が string 型になる
```

**`as const` ありの場合：**

```ts
const VIEWS = ['TaxCalculator', 'BmiCalculator'] as const
// TypeScript の推論: readonly ['TaxCalculator', 'BmiCalculator']
// 配列が readonly（変更不可）になり、中身が文字列リテラル型になる
```

| | `as const` なし | `as const` あり |
|--|--|--|
| `typeof VIEWS` | `string[]` | `readonly ['TaxCalculator', 'BmiCalculator']` |
| `typeof VIEWS[number]` | `string` | `'TaxCalculator' \| 'BmiCalculator'` |

`VIEWS[number]` は「配列の各要素の型」を取り出す書き方。`as const` があるから `string` ではなくリテラル型のユニオンが取れる。

**なぜ安全か：**

```ts
// ❌ 危険な as：実態より広い型 → 狭い型に強制（嘘をつく）
e.target.value as 'TaxCalculator' | 'BmiCalculator'

// ✅ 安全な as const：広く推論された型 → 実態通りに正確にする（正直にする）
['TaxCalculator', 'BmiCalculator'] as const
```

## as が許容されるケース

「自分が型より正確な情報を持っている」ときは有効：

```tsx
// ✅ OK：このIDは必ず存在してかつ input タグだと確信できる場合
const input = document.getElementById('price') as HTMLInputElement

// ❌ NG：ユーザー入力や外部データを as で型付けする（実行時の値を制御できない）
e.target.value as 'TaxCalculator' | 'BmiCalculator'
```

## まとめ

- `as` は「コンパイルエラーを黙らせる道具」
- 実行時に型と実態がズレたとき、エラーが出ずに静かにバグる
- ユーザー入力・外部データには使わず、型ガード関数で安全に検証する
