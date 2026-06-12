# 課題：`any` / `unknown` / `never` の使い分け

**目標：** 3つの特殊な型の意味と使い分けを理解し、型安全なコードを書くための判断ができるようになる

---

## 準備

`study-practice/typescript/code/` に新しいファイルを作成：

```
study09-any-unknown-never.ts
```

---

## 前提知識

| 型 | 一言で言うと | 型チェック |
|---|---|---|
| `any` | 「型を捨てる」 | オフになる |
| `unknown` | 「型は不明だが安全に扱う」 | 使う前に絞り込みが必要 |
| `never` | 「この値は存在しない・到達しない」 | 何も代入できない |

---

## やること

### ① `any` の挙動を確認する

```ts
// any 型の変数を宣言して、以下をすべて試す
// - string を代入する
// - number を代入する
// - 存在しないメソッドを呼び出す（例：.toUpperCase() を number に対して）
// → TypeScript はエラーを出すか？

// ポイント：any はコンパイラの目を「閉じさせる」型
```

**`any` のポイント**

| タイミング | 結果 |
|---|---|
| コンパイル時（TypeScript） | エラーなし（`any` なので見逃す） |
| 実行時（JavaScript） | `TypeError` でクラッシュ |

`any` は型チェックをオフにするだけで、実行時の安全は保証しません。バグがコンパイル時に検出されず、本番環境で初めて壊れる可能性があります。これが `any` を避ける理由です。

### ② `unknown` の挙動を確認する

```ts
// unknown 型の変数に string を代入する
// そのまま .toUpperCase() を呼び出してみる
// → TypeScript はエラーを出すか？

// 次に typeof で型を絞り込んでから .toUpperCase() を呼び出す
// → 今度はどうなるか？

// ポイント：unknown は「使う前に型を確認させる」型
```

### ③ `any` と `unknown` の違いを関数で比較する

```ts
// 引数を any で受け取る関数 processAny を書く
// 引数をそのまま .toUpperCase() して返す
// → 型エラーは出るか？実行時エラーは出るか？

// 引数を unknown で受け取る関数 processUnknown を書く
// typeof で string か確認してから .toUpperCase() して返す
// string でない場合は "文字列ではありません" を返す
// → any との違いは何か？
```

### ④ `never` が現れるパターン①：網羅チェック（exhaustive check）

```ts
// 以下の型を定義する
// type Shape = "circle" | "square" | "triangle"

// Shape を受け取って面積の計算方法を返す関数 describeShape を書く
// switch 文で各 case を処理する
// default 節に以下を書いて「到達不能」を保証する：
//   const _exhaustive: never = shape;

// ポイント：Shape に新しい値（例 "hexagon"）を追加したとき、
// default の never 代入がエラーになることを確認する
// → 型で「追加したら必ず全 case を書け」と強制できる
```

**仕組み：「ここには絶対に来ないはず」という宣言**

`default` に到達するときの `shape` の型を追ってみる：

```ts
type Shape = "circle" | "square" | "rightTriangle";
```

switch 文で3つ全部 case に書いたので、`default` に来る時点で TypeScript は「`circle` でも `square` でも `rightTriangle` でもない → 残りの型は何もない → `never`」と判断する。

```ts
const _exhaustive: never = shape; // shape の型が never → OK
```

**`"hexagon"` を追加すると？**

```ts
type Shape = "circle" | "square" | "rightTriangle" | "hexagon";
```

`"hexagon"` の case を書いていないので、`default` に来うる = `shape` の型は `"hexagon"` が残る。

```ts
const _exhaustive: never = shape;
// エラー：型 '"hexagon"' を型 'never' に割り当てることはできません
```

| 状況 | `default` での `shape` の型 | エラー |
|---|---|---|
| 全 case を書いた | `never`（残りなし） | なし |
| `"hexagon"` を追加したが case なし | `"hexagon"` | エラー |

`_exhaustive` の先頭 `_` は「使わない変数」の慣習的な表記。変数自体は使わないが、**この代入式が型チェックのトリガー**になっている。

### ⑤ `never` が現れるパターン②：絶対に返らない関数

```ts
// 必ず例外を投げる関数 fail を書く
// 引数に message: string を受け取り、throw new Error(message) する
// 戻り値の型を never と明示する

// never を戻り値にする条件：
// - throw で必ず終わる関数
// - while(true) など無限ループで絶対に return しない関数
```

### ⑥ `unknown` の実用例：外部データの受け取り

```ts
// JSON.parse() の戻り値は any
// 以下の流れを実装する：

// 1. JSON 文字列 '{"name":"Alice","age":30}' を JSON.parse で読み込む
// 2. 結果を unknown 型の変数に代入する
// 3. typeof / in 演算子を使って name が string であることを確認する
// 4. 確認できたら name を string として扱う

// ポイント：外部データは「信用できない」ので unknown が適切
// any を使うと確認を怠っても型エラーが出ない
```

**⑥ のコードがまだるっこしく感じる理由**

`unknown` を安全に扱うには「チェックしないと使えない」という制約があり、チェックが増えるほどネストが深くなる。これが `unknown` の「正直な姿」。

**実務でどう解決するか**

実際のプロジェクトではほぼ **Zod** などのバリデーションライブラリを使う：

```ts
import { z } from "zod";

const schema = z.object({ name: z.string(), age: z.number() });
const result = schema.parse(JSON.parse(json)); // 失敗したら例外
console.log(result.name); // string と確定済み
```

手書きのネストが一切なくなる。

**もう一つの解決策：カスタム型ガード**

```ts
function hasStringName(val: unknown): val is { name: string } {
  return typeof val === "object" && val !== null
    && "name" in val && typeof (val as any).name === "string";
}

if (hasStringName(data)) {
  console.log(data.name); // すっきり
}
```

`unknown` のまだるっこしさを関数に閉じ込めて、呼び出し側をすっきりさせる技術。ロードマップの次の項目「**カスタム型ガード**」がこれにあたる。

**実務での使い分けまとめ**

| データの出所 | 手段 |
|---|---|
| 外部API・ユーザー入力 | Zod（ほぼ必須） |
| 自社APIで型定義済み | 型アサーション or 軽い型ガード |
| TS内部で完結するロジック | 型ガードのみで十分 |

Zod の中身も今日書いたような絞り込みで動いている。手書きがまだるっこしく感じたのは正しい感覚で、「だから Zod がある」という流れ。

---

## 確認ポイント

**`any` をなるべく使わないのはなぜ？**

`any` は TypeScript の型チェックを無効化する。バグが実行時まで検出されなくなる。使っていい場面は「移行期間中の一時的なもの」や「型定義のない古いライブラリ」など限定的

**`unknown` と `any` はどちらも「型不明」なのに何が違う？**

`any` は何でもできる（型チェックがない）。`unknown` は型を絞り込むまで何もできない。「わからないことを安全に扱う」のが `unknown`

**`never` はいつ使う？**

2つの場面: ① 絶対に return しない関数の戻り値型（throw・無限ループ）、② switch の default で「到達しないはず」を表明するとき（網羅チェック）

**型の代入関係のまとめ**

```
any    ← 何でも代入できる。any も何にでも代入できる（危険）
unknown ← 何でも代入できる。でも unknown から他の型には代入できない（安全）
never  ← 何も代入できない。never は何にでも代入できる（到達しないから）
```
