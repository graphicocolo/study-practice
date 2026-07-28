# TypeScript 条件型（Conditional Types）と `infer`

型の世界にも `T extends U ? X : Y` という**条件分岐**がある。実行時ではなく**コンパイル時に型チェッカーが評価**する点が、値の世界の三項演算子と違う。

## `infer`：パターンマッチで型を取り出す

```ts
type FirstChar<S extends string> = S extends `${infer First}${string}` ? First : never;

type A = FirstChar<"apple">; // "a"
```

`` `${infer First}${string}` `` は Template Literal Types（文字列リテラル型を組み立てる構文）を使ったパターン。「先頭1文字を `First` という名前で捕まえて、残りは何でもいい」という意味になる。`"apple"` をこのパターンに当てはめると `First = "a"` が確定する。

`infer` は「型のパターンマッチで、当てはまった一部分を型変数として取り出す」キーワード。値の世界の分割代入 `const [head, ...tail] = str` の型版とイメージすると近い。

## 条件型と `infer` を組み合わせる：境界判定

```ts
type Boundary<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? "境界なし"
    : "境界あり"
  : "終端";

type X1 = Boundary<"ab">; // Head="a" Tail="b" → bは小文字 → "境界なし"
type X2 = Boundary<"aB">; // Head="a" Tail="B" → Bは大文字 → "境界あり"
```

`Uncapitalize<Tail>` は「Tail の先頭を強制的に小文字にした型」。それが元の `Tail` と同じなら「もともと小文字だった」＝境界ではない、違うなら「もともと大文字だった」＝単語の切れ目、と判定できる。

## 再帰させる：キャメルケース→スネークケース変換

```ts
type CamelToSnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${CamelToSnakeCase<Tail>}`
    : `${Lowercase<Head>}_${CamelToSnakeCase<Tail>}`
  : S;

type Y = CamelToSnakeCase<"abC">; // "ab_c"
```

`"abC"` を1文字ずつ展開すると：

```
CamelToSnakeCase<"abC">
 Head="a" Tail="bC" → bC の先頭 b は小文字 → "a" + CamelToSnakeCase<"bC">

CamelToSnakeCase<"bC">
 Head="b" Tail="C"  → C は大文字 → "b" + "_" + CamelToSnakeCase<"C">

CamelToSnakeCase<"C">
 Head="C" Tail=""   → "" は境界なし扱い → "c" + CamelToSnakeCase<"">

CamelToSnakeCase<"">
 パターン不一致（分解できない） → そのまま "" を返す（再帰の終着点）
```

組み立てると `"a" + "b" + "_" + "c" + ""` = `"ab_c"`。

## 値の世界の再帰と同じ構造

```ts
function toSnake(s: string): string {
  if (s === "") return "";
  const head = s[0];
  const tail = s.slice(1);
  const sep = /[A-Z]/.test(tail[0] ?? "") ? "_" : "";
  return head.toLowerCase() + sep + toSnake(tail);
}
```

`CamelToSnakeCase` はこの関数と同じ「1文字取り出す → 判定する → 残りに対して自分自身を呼ぶ」構造を、値ではなく型の上でやっているだけ。値の世界の再帰関数が読めれば、型の世界の再帰型もその延長として読める。

## 型は「型を受け取って型を返す関数」として振る舞う

ここまでの `CamelToSnakeCase<S>` は、見方を変えると「文字列型を受け取ってスネークケースの文字列型を返す関数」そのもの。TypeScriptの型システムは実質、型レベルで関数を書けるようになっていて、これを**型レベルプログラミング（type-level programming）**と呼ぶ。

値の世界と型の世界の対応関係：

| 値の世界 | 型の世界 |
|---|---|
| 関数の引数 `(s: string)` | 型引数 `<S extends string>` |
| 関数の戻り値 | 条件型の評価結果 |
| `if / else` | `T extends U ? X : Y` |
| 分割代入 `const [h, ...t] = s` | パターンマッチ `` `${infer H}${infer T}` `` |
| 再帰呼び出し | 型エイリアスが自分自身を参照する（再帰型） |
| 関数合成 | ジェネリック型を入れ子にする（`Array<SnakeCaseKeys<U>>` など） |

TypeScriptの型システムは理論上チューリング完全（＝プログラミング言語として書けることは何でも型だけで表現できる）だと知られている。`type-fest` や `ts-toolbelt` のような有名ライブラリはこの手法で `Partial` や `Pick` よりずっと複雑な型ユーティリティを提供している。ただし実務では「型が読みにくくなる」「コンパイルが遅くなる」というデメリットもあるため、乱用はされない。

## `SnakeCaseKeys<T>`：オブジェクトのキー全体に適用する

`CamelToSnakeCase<S>` は文字列1つの変換だったが、それを**オブジェクトのキー全体**に適用するのが `SnakeCaseKeys<T>`。

```ts
type SnakeCaseKeys<T> = T extends Array<infer U>
  ? Array<SnakeCaseKeys<U>>
  : T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<string & K>]: SnakeCaseKeys<T[K]>;
    }
  : T;
```

### 3つの分岐

```
配列か？        → 中身を再帰変換した配列にする
オブジェクトか？ → キーを変換したオブジェクトにする
それ以外（primitive）→ そのまま返す
```

配列を先にチェックしているのは、**配列も`object`の一種**だから。先に `T extends object` を判定すると、配列も「オブジェクト」の分岐に入り込み、キーを `0`, `1`, `2`... としてマッピングしようとしてしまう。

### Mapped Types のキー変換（`as`）

`{ [K in keyof T]: T[K] }` は `Partial<T>` などと同じ **Mapped Type**（`keyof`で全キーを回してオブジェクト型を作り直す構文）。`as` を付けると、キー名自体を変換できる（Key Remapping）。

```ts
type Rename<T> = {
  [K in keyof T as `new_${string & K}`]: T[K];
};

type X = Rename<{ id: number }>; // { new_id: number }
```

`SnakeCaseKeys` では `as CamelToSnakeCase<string & K>` で「元のキー名を `CamelToSnakeCase` に通してスネークケースにしたものを、新しいキー名として使う」としている。

### `string & K` の意味

`keyof T` は `string | number | symbol` になり得る（JSのオブジェクトキーは数値や `Symbol` もあり得るため）。しかし `CamelToSnakeCase<S extends string>` は `S` を `string` に限定している。`string & K` は交差型（intersection）で「`K` のうち `string` と両立する部分だけ取り出す」という意味になり、型チェッカーを通すためのテクニック。値は何も変わらず、型だけを絞り込んでいる。

### 値も再帰している

キーだけでなく `SnakeCaseKeys<T[K]>` と、値の型に対しても自分自身を再帰適用している。だからネストしたオブジェクトも深く変換される。

```
SnakeCaseKeys<{ emailAddress: string; phoneNumber?: string }>
 → K = "emailAddress" → CamelToSnakeCase<"emailAddress"> = "email_address"
     値 → SnakeCaseKeys<string> = string（primitiveなのでそのまま）
 → K = "phoneNumber"  → CamelToSnakeCase<"phoneNumber"> = "phone_number"
     値 → SnakeCaseKeys<string | undefined> = string | undefined

結果: { email_address: string; phone_number?: string }
```

`CamelToSnakeCase` が「文字列1つを変換する型関数」なら、`SnakeCaseKeys` は「オブジェクト構造全体に対してその関数を`map`するような型関数」とイメージすると近い。

## まとめ

- 条件型 `T extends U ? X : Y` は型の世界の if 文。コンパイル時に評価される
- `infer` はパターンマッチで一部分を型変数として捕まえるキーワード
- Template Literal Types（`` `${...}${...}` ``）を使うと文字列リテラル型を分解・組み立てできる
- 条件型は自分自身を呼び出せる（再帰型）。空文字列など「これ以上分解できない」状態が再帰の終着点になる
- Mapped Types に `as` を付けると、キー名自体を変換できる（Key Remapping）
- `string & K` のような交差型は、`keyof T` の広い型を関数が要求する型に絞り込むテクニックとして使える
- 配列とオブジェクトを条件型で判定する際は、配列を先にチェックする（配列も`object`の一種のため）
- 実務でこのレベルの型パズルを書く機会は少ない。まずは「値の世界の再帰関数と同じ発想」という対応関係が掴めれば十分
