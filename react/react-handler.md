# React イベントハンドラー

## 型定義

1. 引数に型をつける（e に型注釈） 

```ts
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  // ...
}
```

- e という引数に対して型をつけている
- 変数 `handleSubmit` の型は TypeScript が `(e: React.FormEvent<HTMLFormElement>) => void` と推論する
- 型を「内側から」定義するイメージ

2. 関数（変数）に型をつける（変数に型注釈）

```ts
const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
  // ...
}
```

- 変数 handleSubmit 自体に対して関数型 `React.SubmitEventHandler<HTMLFormElement>` をつけている
- e の型は型注釈から逆方向に推論される（contextual typing）
- 型を「外側から」定義するイメージ

`React.SubmitEventHandler<HTMLFormElement>` の実体は：

```ts
// Reactの型定義内では以下のエイリアス
type SubmitEventHandler<T> = EventHandler<FormEvent<T>>
// = (event: React.FormEvent<T>) => void
```

つまり両者は型レベルでは等価で、最終的に e は同じ型になります。

しかし、引数に型をつける書き方の方が一般的です。

理由：

- 型が引数の隣に書かれるため、何の型かが一目でわかる
- 関数の実装と型情報が近くにある（可読性が高い）

```ts
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... }
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
```

関数に型をつける書き方が有用なケース：

- props で渡す関数型（onClick?: React.MouseEventHandler<HTMLButtonElement>）との整合性を明示したいとき
- 関数型を別途 type で定義して使い回すとき

## ハンドラーに渡す引数

Reactのイベントシステムが呼ぶのは常にイベントオブジェクト `(e: Event) => void` の形だが、コンポーネント側でラッパーを挟むことでフックのハンドラーには何でも渡せる。

```tsx
onChange={(e) => handlePriceChange(e.target.value)} // 文字列を渡す
onClick={() => handleDelete(item.id)}               // 別の値を渡す
onClick={() => handleSelect(index)}                 // インデックスを渡す
```

### 引数の種類と使いどころ

| ハンドラーの引数 | 使いどころ |
|---|---|
| `(e: React.ChangeEvent<...>)` | `e.preventDefault()` など、イベント自体の操作が必要なとき |
| `(value: string)` | 値だけ取り出せれば十分なとき（フックをDOMから独立させたいとき） |
| `(id: number)` 等 | リストの削除など、イベントと無関係な識別子を渡したいとき |

### カスタムフックのハンドラーに `value: string` を受け取らせるメリット

```typescript
// フック側
const handlePriceChange = (value: string) => { ... }
const handleBlur = (value: string) => { ... }
const handleTaxRateChange = (value: string) => { ... }
```

**1. フックがDOMに依存しない**

`React.ChangeEvent<HTMLInputElement>` という型を知らなくてよいため、フックの汎用性が上がる。テスト時も `handlePriceChange('1000')` と単純に呼べる。

**2. 「何を渡すか」の責任がコンポーネントにある**

```tsx
// コンポーネントがイベントから値を取り出す責任を持つ
onChange={(e) => handlePriceChange(e.target.value)}
```

フックは「価格が変わった」という事実と値だけ受け取ればよく、それがどのDOMイベントから来たかは関知しない。

### イベントオブジェクトを渡すべきケース

イベントオブジェクト自体の情報（`e.preventDefault()` など）が必要なとき。

```typescript
const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
  e.preventDefault() // ← イベントオブジェクトが必要
}
```

`handleSubmit` がイベントオブジェクトを受け取るのはこのため。値だけでは足りない。

### 冗長なラッパー関数を避ける

ハンドラーがイベントオブジェクトをそのまま受け取る場合、inline arrow function は不要。

```tsx
// 冗長
onChange={(e) => handlePriceChange(e)}

// シンプル
onChange={handlePriceChange}
```
