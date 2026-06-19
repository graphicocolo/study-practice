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

## まとめ

| 手法 | 使いどころ |
|---|---|
| `typeof` | プリミティブ型（string / number / boolean など） |
| `in` | オブジェクト型・プロパティの有無で判定 |
| カスタム型ガード（`is`） | 複雑な条件・再利用したい判定をカプセル化する |

---

## 次のステップ

`readonly` / `Partial` / `Required` などのユーティリティ型 → `typescript-study11-utility-types.md`
