# TypeScript 型ガード（Type Guard）

## 今日のゴール

- `typeof` / `in` / カスタム型ガード の3種類を使い分けられる
- Union 型の値を安全に絞り込める

---

## 型ガードとは

Union 型（`string | number` など）の変数を、特定の型として安全に扱うための絞り込みの仕組み。

```ts
// ❌ Union 型のままでは片方のメソッドは呼べない
function process(value: string | number) {
  console.log(value.toUpperCase()); // エラー：number にはない
}

// ✅ 型ガードで絞り込むと安全に使える
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // ここでは string 確定
  } else {
    console.log(value.toFixed(2)); // ここでは number 確定
  }
}
```

---

## 1. `typeof` 型ガード

**プリミティブ型**（`string` / `number` / `boolean` / `bigint` / `symbol` / `undefined`）の絞り込みに使う。

```ts
typeof value === "string"   // → string に絞り込まれる
typeof value === "number"   // → number に絞り込まれる
typeof value === "boolean"  // → boolean に絞り込まれる
```

### 練習1

次の関数を完成させてください。

```ts
// 引数が string なら文字数を返し、number ならその数を2倍して返す
function process(value: string | number): number {
  // TODO: typeof を使って絞り込む
}

console.log(process("hello")); // 5
console.log(process(10));      // 20
```

---

## 2. `in` 型ガード

**オブジェクト型**のどちらかを判定するときに使う。プロパティの有無で絞り込む。

```ts
type Dog = { name: string; bark: () => void };
type Cat = { name: string; meow: () => void };

function greet(animal: Dog | Cat) {
  if ("bark" in animal) {
    animal.bark(); // ここでは Dog 確定
  } else {
    animal.meow(); // ここでは Cat 確定
  }
}
```

### 練習2

次の型と関数を完成させてください。

```ts
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rect"; width: number; height: number };

// `in` を使って面積を計算する関数を書く
function getArea(shape: Circle | Rectangle): number {
  // TODO: "radius" in shape で絞り込む
}

console.log(getArea({ kind: "circle", radius: 5 }));         // 約78.5
console.log(getArea({ kind: "rect", width: 4, height: 6 })); // 24
```

---

## 3. カスタム型ガード（型述語）

`is` キーワードを使って、**自分で型ガード関数を定義**する方法。

```ts
// 戻り値の型を「引数名 is 型」とすることで、型ガードとして機能する
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function print(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // ここでは string 確定
  }
}
```

`value is string` の部分が**型述語（Type Predicate）**。この関数が `true` を返したとき、TypeScript が自動で型を絞り込んでくれる。

### 練習3

次のカスタム型ガードと関数を完成させてください。

```ts
type User = { id: number; name: string };
type Guest = { sessionId: string };

// isUser という型ガード関数を作る（"id" in value を使う）
function isUser(value: User | Guest): value is User {
  // TODO
}

function welcome(person: User | Guest) {
  if (isUser(person)) {
    console.log(`ようこそ、${person.name}さん`); // User 確定
  } else {
    console.log(`ゲストセッション: ${person.sessionId}`); // Guest 確定
  }
}
```

---

## 4. 総合練習

次の3つの型が渡ってくる関数 `describe` を完成させてください。

```ts
type TextContent  = { type: "text"; body: string };
type ImageContent = { type: "image"; url: string; alt: string };
type VideoContent = { type: "video"; url: string; duration: number };

type Content = TextContent | ImageContent | VideoContent;

function describe(content: Content): string {
  // TODO: 3種類すべてを判定して説明文を返す
  // 例：
  // TextContent  → "テキスト: Hello"
  // ImageContent → "画像: https://... (猫の写真)"
  // VideoContent → "動画: https://... (120秒)"
}
```

> ヒント：`type` プロパティで絞り込む方法（判別共用体）が最もすっきり書ける

---

## 5. アサーション関数（`asserts`）— 型ガードとの違い

ここまでの型ガードは、いずれも Union 型を**分岐**させるための仕組み（`if (...) {...} else {...}` で両方の枝を扱う）。

一方、`T | null` のように「本来あるべき型」と「あってはいけない異常値」の組み合わせを扱うときは、分岐ではなく**除外**したいことが多い。そこで使うのがアサーション関数。

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("string ではありません");
  }
}

function print(value: unknown) {
  assertIsString(value);
  console.log(value.toUpperCase()); // ここでは string 確定（else 不要）
}
```

戻り値の型が `value is string`（型ガード）ではなく `asserts value is string` になっている点がポイント。呼び出し側は `if` で結果を使う必要はなく、**呼んだだけで**以降のスコープが絞り込まれる。

### 型ガードとアサーション関数の使い分け

| | 型ガード（`is`） | アサーション関数（`asserts`） |
|---|---|---|
| 戻り値 | `boolean` | `void`（条件を満たさなければ例外を投げる） |
| 呼び出し側 | `if (isFoo(x)) {...} else {...}` の分岐が必要 | 呼ぶだけで以降絞り込まれる、分岐不要 |
| 向いている場面 | 複数の意味のある型を**判定**したいとき（`Dog` か `Cat` か） | 「本来あるべき型」以外を**異常値として排除**したいとき（`T \| null` から null を弾く） |

### 練習4

`querySelector` は `Element | null` を返す。null なら例外を投げ、以降 non-null （T | null（T かもしれないし null かもしれない型）から null の可能性を取り除いた状態、つまり「確実に T 型である」という意味）として扱えるアサーション関数を書いてください。

```ts
function assertExists<T>(value: T | null, name: string): asserts value is T {
  // TODO
}

const input = document.querySelector<HTMLInputElement>('#city-input');
assertExists(input, '#city-input');
input.value; // ここでエラーが出ないことを確認
```

### 3つの方法の具体例

`T | null` を non-null にする方法は、アサーション関数以外にも2つある。同じ `document.querySelector` の例で3つを比較する。

**① 非nullアサーション（`!`）**

「絶対に存在する」と型チェッカーに伝えるだけで、実行時のチェックは何も行われない。

```ts
const input = document.querySelector<HTMLInputElement>('#city-input')!;
input.value; // コンパイルは通るが、実際に null だったら実行時エラーになる
```

**② nullガード（早期リターン / throw）**

呼び出し箇所ごとに `if` を書いて分岐させる。型ガードと同じ「分岐」の形。

```ts
const input = document.querySelector<HTMLInputElement>('#city-input');
if (!input) {
  throw new Error('#city-input が見つかりません');
}
input.value; // ここでは input は HTMLInputElement 確定
```

**③ アサーション関数（`asserts`）**

チェック処理を関数に切り出して使い回せる。呼んだ後は `if` なしで絞り込まれる。

```ts
function assertExists<T>(value: T | null, name: string): asserts value is T {
  if (value === null) throw new Error(`${name} が見つかりません`);
}

const input = document.querySelector<HTMLInputElement>('#city-input');
assertExists(input, '#city-input');
input.value; // ここでは input は HTMLInputElement 確定
```

| 方法 | 実行時チェック | 書く場所 | 向いている場面 |
|---|---|---|---|
| 非nullアサーション（`!`） | なし（自己申告のみ） | 使う箇所ごとに `!` を書く | 存在が確実で、チェックコストを省きたいとき |
| nullガード（`if` + `throw`） | あり | 使う箇所ごとに `if` を書く | 1〜2箇所だけの単発チェック |
| アサーション関数（`asserts`） | あり | 関数として1回定義、あとは呼ぶだけ | 同じチェックを何度も繰り返すとき（例：DOM要素を11個取得する場合） |

---

## まとめ

| 手法 | 使いどころ |
|---|---|
| `typeof` | プリミティブ型（string / number / boolean など） |
| `in` | オブジェクト型・プロパティの有無で判定 |
| カスタム型ガード（`is`） | 複雑な条件・再利用したい判定をカプセル化する |
| アサーション関数（`asserts`） | `T \| null` などから異常値を排除し、以降 non-null として扱いたいとき |

---

## 次のステップ

`readonly` / `Partial` / `Required` などのユーティリティ型 → `typescript-study11-utility-types.md`
