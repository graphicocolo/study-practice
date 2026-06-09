# 課題：Generics（ジェネリクス）の基本

**目標：** `Array<T>` / `Promise<T>` などで見かける `<T>` の意味を理解し、自分でジェネリクスを使った関数・型を書けるようになる

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
08-generics.ts
```

---

## やること

### ① `Array<T>` を読む

```ts
// 以下の2つの書き方は同じ意味
// string[] と Array<string> を両方書いて確認する
// number[] と Array<number> も同様に確認する

// さらに：string[] の変数に number を push しようとするとどうなるか確認する
```

### ② `Promise<T>` を読む

```ts
// 1秒後に文字列 "完了" を返す非同期関数 wait を書く
// 戻り値の型を Promise<string> と明示する
// async/await で呼び出して、返ってくる値の型が string になっているか確認する
```

### ③ ジェネリクス関数を書く（基本）

```ts
// 配列の先頭要素を返す関数 first を書く
// number[] を渡したら number が返る
// string[] を渡したら string が返る
// any を使わず、T を使って書くこと

// 使用例：
// first([1, 2, 3])    → 1（型は number）
// first(["a", "b"])   → "a"（型は string）
```

### ④ ジェネリクス関数を書く（引数が2つ）

```ts
// 2つの値をタプル（組）にして返す関数 pair を書く
// 型引数を2つ（T, U）使うこと

// 使用例：
// pair("hello", 42)      → ["hello", 42]（型は [string, number]）
// pair(true, "yes")      → [true, "yes"]（型は [boolean, string]）

// 複数の型引数を使うときの慣習的な名前
// <T, U>          // 汎用的な2つ
// <K, V>          // Key / Value（Map などで使う）
// <T, E>          // 値 / Error（Result型などで使う）
```

### ⑤ ジェネリクスを使った型定義

```ts
// キーが string、値が T の「ラベル付き結果」を表す type を定義する
// プロパティは label: string と value: T の2つ

// 使用例：
// const score: Labeled<number> = { label: "点数", value: 95 };
// const name: Labeled<string> = { label: "名前", value: "Alice" };
```

### ⑥ 制約（extends）をつける

```ts
// オブジェクトの id プロパティを返す関数 getId を書く
// T は { id: number } を持つことを保証する（extends で制約をつける）
// id プロパティを持たないオブジェクトを渡すとエラーになることを確認する

// 使用例：
// getId({ id: 1, name: "Alice" })  → 1
// getId({ name: "Bob" })           → エラーになる
```

---

## 確認ポイント

**`T` とは何か？**

型の「プレースホルダー」。関数を呼び出すときに実際の型が決まる。`any` との違いは、型情報が保たれること（`any` は型情報を捨てる）

**`Array<T>` と `T[]` の関係は？**

どちらも同じ意味。`Array<string>` と `string[]` は完全に等価

**型引数は何個でも使える？**

`<T, U>` のように複数使える。標準ライブラリでも `Map<K, V>` など2つ使う例がある

**`extends` で制約をつける意味は？**

`T extends { id: number }` とすると「T は少なくとも id: number を持つ型」に限定できる。制約のない T は何の型か不明なので、プロパティにアクセスできない
