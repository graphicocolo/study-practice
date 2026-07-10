# 課題：クラスと型（`implements` / `extends`）

**目標：** クラスの基本構文とアクセス修飾子を理解し、`interface` の実装（`implements`）とクラスの継承（`extends`）を使い分けられるようになる

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study16-class-implements-extends.ts
```

---

## 前提知識

| 用語 | 意味 |
|---|---|
| `class` | オブジェクトの設計図（プロパティ＋メソッドをまとめる） |
| `constructor` | インスタンス生成時に呼ばれる初期化処理 |
| `public` | どこからでもアクセス可能（省略時のデフォルト） |
| `private` | クラス内部からのみアクセス可能 |
| `protected` | クラス自身と継承先からアクセス可能 |
| `implements` | interface で定義した形を「守る」ことをクラスに約束させる |
| `extends` | 既存クラスを継承し、プロパティ・メソッドを引き継ぐ |
| `super` | 親クラスの constructor / メソッドを呼び出す |
| `abstract` | インスタンス化できない、継承専用の設計図クラス |

---

## やること

### ① クラスの基本

```ts
// Animal クラスを作る
// - プロパティ: name: string, age: number
// - constructor で name と age を受け取って初期化する
// - describe(): string メソッドで「name: ○○, age: ○○歳」のような文字列を返す

// Animal のインスタンスを1つ作り、describe() を呼び出して結果を確認する
```

### ② アクセス修飾子（`public` / `private` / `protected`）

```ts
// Animal クラスのプロパティを次のように変更する
// - name はそのまま（省略時は public 扱いであることを確認する）
// - age を private にする
// → クラスの外側から animal.age にアクセスしてみる
// → TypeScript はエラーを出すか？

// 次に protected を試す
// - Animal に protected species: string を追加する
// → クラスの外側から animal.species にアクセスするとどうなるか確認する
```

**`public` / `private` / `protected` の範囲**

| 修飾子 | クラス内部 | 継承先のクラス | クラスの外 |
|---|---|---|---|
| `public`（省略時） | ○ | ○ | ○ |
| `protected` | ○ | ○ | ✕ |
| `private` | ○ | ✕ | ✕ |

### ③ interface を実装する（`implements`）

```ts
// 以下の interface を定義する
interface Describable {
  describe(): string;
}

// Animal クラスに `implements Describable` を追加する
// → 一度 describe をわざと違うメソッド名にしてみて、どんなエラーが出るか確認する
// → 正しく describe(): string を実装するとエラーが消えることを確認する

// ポイント：interface は「このクラスは最低限これを持て」という契約
```

### ④ クラスの継承（`extends`）と `super`

```ts
// Animal を継承した Dog クラスを作る
// - 追加プロパティ: breed: string
// - constructor で name, age, breed を受け取る
//   → super(name, age) で親クラスの constructor を呼び出す
// - Dog 独自のメソッド bark(): string を追加する（例:「ワンワン！」を返す）

// Dog のインスタンスを1つ作り、
// describe()（親から継承したメソッド）と bark()（Dog 独自のメソッド）を両方呼び出す
```

### ⑤ メソッドのオーバーライド

```ts
// Dog クラスの describe() をオーバーライド（上書き）する
// - 親の describe() の結果の末尾に「（犬）」を追加した文字列を返すようにする
// - super.describe() を使って親の結果を再利用する

// ポイント：同じメソッド名で「振る舞いを上書き」できる
// ただし引数の型・戻り値の型は親と互換性が必要
```

### ⑥ abstract class（抽象クラス）

```ts
// Animal を abstract class に変更してみる
// - describe(): string; を中身のないメソッド定義（シグネチャのみ）にし、
//   abstract describe(): string; と書く
// → new Animal(...) で直接インスタンス化しようとするとどうなるか確認する
// → Dog 側で describe() を実装しないとどうなるか確認する

// ポイント：abstract class は「必ず継承して使う」ことを型レベルで強制する仕組み
```

**`interface` と `abstract class` の違い**

| | `interface` | `abstract class` |
|---|---|---|
| メソッドの実装 | 持てない（シグネチャのみ） | 一部のメソッドは実装済みにできる |
| 継承の数 | 複数 `implements` できる | 1つしか `extends` できない |
| インスタンス化 | もともと存在しない | 直接は不可、継承先はできる |
| プロパティの初期値 | 持てない | 持てる（constructor で初期化可） |

---

## 確認ポイント

**`public` / `private` / `protected` の違いは？**

`public` はどこからでもアクセス可能（省略時のデフォルト）。`protected` はクラス自身と継承先のクラスからアクセス可能。`private` はクラス内部からのみアクセス可能

**`implements` と `extends` の違いは？**

`implements` は interface が定義する「形（メソッド・プロパティのシグネチャ）」を守ることを約束する。中身の実装は自分で書く必要がある。`extends` は既存クラスの実装（プロパティ・メソッドの中身）をそのまま引き継ぐ

**`super` はいつ必要？**

継承先の constructor で、親クラスの constructor を呼び出すとき（`super(...)`）。また、オーバーライドしたメソッドの中で親の実装を再利用したいとき（`super.メソッド名()`）

**`abstract class` と `interface` はどう使い分ける？**

複数の継承元を組み合わせたい、または純粋に「形」だけ定義したいなら `interface`。共通の実装（一部のメソッドやプロパティの初期化）を継承先にまとめて持たせたいなら `abstract class`
