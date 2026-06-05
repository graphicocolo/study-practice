# 課題：Union 型と Optional（`?`）

**目標：** 複数の型を受け付ける Union 型と、省略可能なプロパティ・引数の書き方を覚える

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
07-union-optional.ts
```

---

## やること

### ① Union 型の基本

```ts
// string または number を受け付ける変数 id を宣言する
// string を代入して、次に number を代入してみる
// 関係ない型（boolean など）を代入するとどうなるか確認する
```

### ② Union 型を引数に使う

```ts
// string または number を受け取り、
// 「入力値：〇〇」という文字列を返す関数 printId を書く
// 引数の型を Union 型にすること
```

### ③ Union 型と `typeof` で分岐する

```ts
// ②の関数を改良する
// 引数が number のときは 0 埋め2桁（例：05）で返す
// 引数が string のときはそのまま返す
// typeof を使って型で分岐すること
```

### ④ Optional プロパティ（`?`）

```ts
// 以下のプロパティを持つ type を定義する
// - name: string（必須）
// - age: number（必須）
// - nickname: string（省略可能）

// nickname あり・なし両方のオブジェクトを作って、エラーにならないか確認する
```

### ⑤ Optional 引数（`?`）

```ts
// name: string と greeting?: string を受け取る関数 greet を書く
// greeting が渡されたときは「greeting、name さん」
// 渡されなかったときは「こんにちは、name さん」を返す
```

### ⑥ `undefined` との関係を確認する

```ts
// ④で定義した型の nickname プロパティにアクセスする
// nickname が undefined になり得ることを確認する
// nickname を使って文字列を組み立てるとき、そのままだと何が起きるか確認する
// （例：`${obj.nickname}さん` と書いたとき）
```

---

## 確認ポイント

**Union 型はどう書くか？**

`型A | 型B` のように `|` でつなぐ。変数・引数・戻り値すべてに使える

**Optional（`?`）をつけると型はどうなるか？**

`nickname?: string` は `nickname: string | undefined` と同じ意味になる

**Optional プロパティにアクセスするときの注意点は？**

値が `undefined` になり得るため、使う前に存在確認が必要になるケースがある
