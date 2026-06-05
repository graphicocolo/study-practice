# 課題：`type` エイリアスと `interface` の違い

**目標：** `type` と `interface` それぞれの書き方と、できることの違いを体感で理解する

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
06-type-interface.ts
```

---

## やること

### ① `type` でオブジェクトの型を定義する

```ts
// 以下のプロパティを持つ型を type で定義する
// - id: number
// - name: string
// - email: string

// 定義した型を使ってオブジェクトを1つ作る
```

### ② `interface` で同じ型を定義する

```ts
// ①と同じプロパティ構成を interface で書き直す
// 名前は別にして（例：UserType と UserInterface）
// 両方でオブジェクトを作って、使い勝手に違いがあるか確認する
```

### ③ `interface` の宣言マージを試す

```ts
// interface は同じ名前で2回定義するとマージされる
// 以下を実際に書いて、エラーにならないか確認する

interface Animal {
  name: string;
}
interface Animal {
  age: number;
}
// → Animal 型のオブジェクトを作るとき、name と age の両方が必要か確認する
```

### ④ `type` で同じことをしようとする

```ts
// ③と同じことを type で試す
// type Animal = { name: string }
// type Animal = { age: number }  // これを書くとどうなるか確認する
```

### ⑤ `type` でしか書けないものを書く

```ts
// ユニオン型を type で定義する（interface では書けない）
// 例：'grid' か 'list' のどちらかを表す型

// プリミティブの別名を type で定義する
// 例：string の別名として ID 型を作る
```

### ⑥ どちらを使うか判断する

コードは書かなくてよい。以下を自分の言葉でコメントに書く：

```ts
// Q1: オブジェクトの型定義には type と interface どちらを使うべきか？
// Q2: ユニオン型を作りたいときはどちらを使うべきか？
// Q3: なぜ「どちらかに統一する」ことが大事なのか？
```

---

## 確認ポイント

**`type` と `interface` の最大の違いは何か？**

`interface` は同名で再定義してマージできる（宣言マージ）。`type` は同名を2回書くとエラー

**`type` でしか書けないものは何か？**

ユニオン型・プリミティブの別名など、オブジェクト以外の型

**どちらを使うか迷ったら？**

プロジェクトの慣例に従う。React では `type` 統一が多い。混在は避ける
