# React リアルタイムバリデーション

## リアルタイムバリデーションのタイミング

| タイミング | 方法 | 体験 |
|-----------|------|------|
| 送信時のみ | `onSubmit` | 確実だが反応が遅い |
| 入力中 | `onChange` | 即時だが入力途中でエラーが出て煩わしい |
| フォーカスが外れた時 | `onBlur` | 入力完了後に検証。バランスが良い |
| **初回は `onBlur`、以降は `onChange`** | 組み合わせ | 実務で最もよく使われるパターン |

### `onBlur` の例

```tsx
<input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  onBlur={(e) => {
    const result = validateInput(e.target.value)
    if ('error' in result) {
      setError(result.error)
    } else {
      setError(null)
    }
  }}
/>
```

### `onChange` だけだと問題がある理由

入力を始めた瞬間からエラーが出る。例えば全選択して削除した瞬間に「価格を入力してください」が表示され、まだ入力中なのにエラーが出るのはユーザー体験として良くない。

### 初回 `onBlur` → 以降 `onChange`（実務で最もよく使われるパターン）

一度エラーが出たら、修正するたびにリアルタイムで消える動きになり、ユーザーにとって最も自然。

初回（isTouched が false）

- 入力中（onChange）→ バリデーションしない（煩わしくない）
- フォーカスが外れた（onBlur）→ バリデーション実行、isTouched を true に

2回目以降（isTouched が true）

- 入力中（onChange）→ バリデーション実行（修正するたびにエラーがリアルタイムで消える）
- フォーカスが外れた（onBlur）→ バリデーション実行

リセット時

- isTouched を false に戻し、初回の状態に戻る

**handleSubmit** にもisTouched を設定する必要がある

ケース: 価格欄に入力して、一度もフォーカスを外さずに送信ボタンを押す

1. ページを開く

- isTouched は false 

2. 価格欄をクリックして「-5」と入力する

- onChange が発火
- isTouched が false なので、バリデーションは実行されない（まだエラー出ない）

3. そのまま価格欄から離れずに Tab キーではなくマウスで「計算する」ボタンを押す

- onBlur が先に発火するかはブラウザの挙動次第
- handleSubmit が実行される
- validateInput("-5") → { error: '1以上の数値を入力してください' } → エラー表示
- しかし isTouched は false のまま

4. 価格欄を修正して「100」に変える

- onChange が発火
- isTouched が false なので、バリデーションは実行されない
- エラーメッセージが消えない（「1以上の数値を入力してください」が残り続ける）

handleSubmit に setIsTouched(true) を追加すると

ステップ3で isTouched が true になるので、ステップ4の onChange でバリデーションが実行され、正しい値ならエラーが消えます。

---

study-app/react-practice/src/components/TaxCalculator.tsx のコードを参照のこと

## isTouched とは

「ユーザーがまだ何も操作していない段階でエラーを出さないためのフラグ」。

### isTouched がない世界

onChange で常にバリデーションすると：

```
ページを開く → 入力欄をクリック → 「1」を打とうとする
→ まだ何も打ってないのに「価格を入力してください」とエラーが出る
```

ユーザーにとって「まだ入力してる途中なのに怒られた」という体験になる。

### 2つのフェーズ

| フェーズ | isTouched | onChange の動き | ユーザー体験 |
|---|---|---|---|
| 初回入力中 | `false` | バリデーションしない | 静かに見守る |
| 一度エラーが出た後 | `true` | リアルタイムでバリデーション | 修正を即座に反映 |

### isTouched の状態遷移

```
① ページを開く              → isTouched = false
② 入力欄に文字を打つ          → isTouched = false → エラー表示しない
③ 入力欄からフォーカスを外す    → isTouched = true  → ここで初めてバリデーション
④ 入力欄に戻って修正する       → isTouched = true  → リアルタイムでエラー更新
```

ポイントは③→④の切り替わり。

### isTouched が true になるタイミング（2箇所）

```typescript
// ① フォーカスが外れたとき
onBlur={() => {
  setIsTouched(true)  // 「もう入力し終わったね」と判断
}}

// ② 計算ボタンを押したとき
handleSubmit → setIsTouched(true)  // 「結果がほしいんだね」と判断
```

### isTouched が false に戻るタイミング（1箇所）

```typescript
// リセットボタンを押したとき
handleReset → setIsTouched(false)  // 最初の状態に戻す
```

### 日常の例え

先生が生徒のテストを見る場面：

- **isTouched = false**：生徒がまだ問題を解いている途中。後ろから覗いて「それ間違ってるよ」とは言わない
- **isTouched = true**：生徒が「できました」と提出した後。間違いがあれば指摘する。生徒が直している最中もリアルタイムで「あ、今の直し方で合ってるよ」とフィードバックする

