# React コード定型文

---

## カスタムフックの「定型の骨格」

```ts
// ①使い回す定数（必要ならば）
// ②汎用関数（必要ならば）フックの中に書くと、コンポーネントが再レンダリングされるたびに関数が再生成される
// バリデーション関数は state を使わない純粋な関数なので、毎回作り直す意味がない
// ③型定義（必要ならば）慣習としてフックの外・ファイルの上部に書くのが一般的
export function useScoreSort() {
  // ① useState（状態の定義）
  // ② 派生値（state から計算するもの、useState 不要）
  // ③ イベントハンドラ（const で関数を定義）
  // ④ return（コンポーネントに渡す値・関数をまとめて返す）
  return { ... } 
}
```

この順番で書けば迷いません。

### 汎用関数（`validateNotEmpty` など）と型定義（`type Score` など）はフックの**外**に書く

| | フックの外 | フックの中 |
|---|---|---|
| 汎用関数 | 1回だけ定義される ✅ | 再レンダリングのたびに再生成される |
| 型定義 | export しやすい ✅ | 動作は同じだが export できない |

state を使わない純粋な関数は、毎回作り直す意味がないのでフックの外に置く。

### type と interface の使い分け

**使い分けの目安**

| 場面 | どちらを使う |
|------|------------|
| オブジェクトの型定義 | どちらでも OK（プロジェクトの慣例に従う） |
| ユニオン型・交差型 | `type` |
| クラスに `implements` させる | `interface` |
| ライブラリの型定義 | `interface`（利用者が拡張できるように） |

現実的には

React プロジェクトでは `type` に統一しているケースが多い。`interface` と `type` を混在させると読み手が混乱するので、**どちらかに統一する**のが一番大事。

**基本的な書き方**

```ts
// type
type User = {
  name: string
  age: number
}

// interface
interface User {
  name: string
  age: number
}

// ユニオン型 → type しか書けない
type ViewType = 'TaxCalculator' | 'BmiCalculator'
```

いざ1人で書くとなると、うわーっとなって書けなかった...

```txt
以下のような疑問が押し寄せてきた...
// 型定義は useScoreSort の外側に記述で大丈夫か（ただし慣習としてフックの外・ファイルの上部に書くのが一般的）
// 2つのバリデーション関数は真偽値を返す作りで問題ないか
// エラーをセットする関数を作成した方が良いか
// どのようにフック内のスクリプトを組み立てて良いかわからない
// フック内のスクリプトの定型の書き方ってあるのか、あれば教えて
// この状態でまず何から進めれば良いか
// - `handleChange(name, value)` → 入力値を更新 + エラークリア制御
// - `handleBlur(name)` → バリデーション実行
// - `handleSubmit` → ソートして結果を state に保存
// - `handleReset` → 全 state を初期値に戻す
```

---

## 各コンポーネント

フックの中のものと対応する値とハンドラを意識して JSX を書く

---

## vanilla JS → React に変換する場合

- 対応関係を頭に入れる
- DOM 要素 → `useState` で値を保持、value を持つ場合は state を読み書きすることになる
- イベントリスナー・ハンドラー → `on○○` ハンドラとなる
- 配列をレンダリング → JSX で配列を `.map()`

| vanilla JS | React |
|---|---|
| `document.querySelector` で値を取得 | `useState` で値を保持 |
| `element.value` を読み書き | state を読み書き |
| `addEventListener('input', ...)` | `onChange` ハンドラ |
| `addEventListener('blur', ...)` | `onBlur` ハンドラ |
| `addEventListener('submit', ...)` | `onSubmit` ハンドラ |
| `element.textContent = ...` | state を更新 → 自動再レンダリング |
| `createElement / appendChild` | JSX で配列を `.map()` |

---