# JavaScript 実践 フォームの入力値取得とバリデーション

---

## 課題：ユーザー登録フォームのバリデーション

### お題

以下の入力欄を持つ「ユーザー登録フォーム」を作ってください。

**入力欄**
- ユーザー名（テキスト）
- メールアドレス（テキスト）
- パスワード（テキスト）
- 登録ボタン

---

### バリデーションルール

| 項目 | ルール |
|---|---|
| ユーザー名 | 空はNG、3文字以上 |
| メールアドレス | 空はNG、`@` を含む |
| パスワード | 空はNG、8文字以上 |

---

### 動作要件

1. 登録ボタンを押したとき、各入力値を取得してバリデーションする
2. エラーがある場合、各入力欄の下にエラーメッセージを表示する（例：「3文字以上で入力してください」）
3. 全項目OKなら「登録完了！」とアラートまたはページ上に表示する
4. **リアルタイムバリデーション（発展）**：入力欄からフォーカスが外れたとき（`blur` イベント）にもチェックする

---

### ヒント

```js
// 値の取得
const name = document.querySelector('#name').value;

// blur イベント
input.addEventListener('blur', () => { ... });

// エラー表示の例
errorEl.textContent = '3文字以上で入力してください';
errorEl.style.color = 'red';
```

---

### 確認ポイント

- `value` で入力値が取れている
- 条件に応じてエラーメッセージを出し分けられている
- 全部OKのときだけ成功メッセージが出る
- （発展）blur でリアルタイムにチェックされる

---

## 自分のコード

<!-- ここに書く -->

---

## コードレビュー結果

### 動作要件チェック

| 要件 | 結果 |
|---|---|
| 1. ボタン押下時に入力値を取得してバリデーション | ✅ |
| 2. エラーがある場合、各入力欄の下にエラーメッセージを表示 | ✅ |
| 3. 全項目OKなら成功メッセージを表示 | ✅ |

### 良かった点

- メールのバリデーションに正規表現を使っている（課題条件より実用的）
- リセット時にエラーメッセージと結果欄もクリアしている（課題外だが自分で考えて実装）
- JSDoc コメントで型を書いている（`@param` `@returns` `@type`）

### 気になった点

**1. 空文字チェックが抜けている（ユーザー名・パスワード）**

`length < 3` は空文字も弾けるが、エラーメッセージが「3文字以上で〜」になるため、空のときは別メッセージを出すとより親切。

```js
function validateUsername() {
  if (usernameInput.value.trim() === '') {
    usernameError.textContent = 'ユーザー名を入力してください';
    return false;
  }
  if (usernameInput.value.length < 3) {
    usernameError.textContent = 'ユーザー名は3文字以上で入力してください';
    return false;
  }
  usernameError.textContent = '';
  return true;
}
```

**2. バリデーション成功時にエラーメッセージをクリアしていない**

一度エラーを出した後、修正して再送信すると成功してもエラーメッセージが残る。各バリデーション関数の `return true` の前に `errorEl.textContent = ''` を追加する。

```js
usernameError.textContent = ''; // ← 成功時はクリア
return true;
```

**3. `errorFields` 配列が現状では活用されていない**

リセット処理のみで使用。各要素への直接参照（`usernameError` など）があれば十分なので、不要なら削除してシンプルにしてもOK。

### 次にリアルタイムバリデーション（blur）に取り組む際の注意

「バリデーション成功時のエラークリア処理」が必須になるので、そのタイミングで上記の修正を入れるとスムーズ。

---

## 振り返り・気づき

<!-- ここに書く -->

---

## 補足：Constraint Validation API

JavaScriptから標準ライブラリとして用意されているブラウザのAPI。

### `setCustomValidity(message)`

フォーム要素（`<input>` など）に対して、カスタムのバリデーションメッセージをセットする。

```js
input.setCustomValidity('3文字以上で入力してください');
// → この状態でフォームをsubmitすると、ブラウザのバリデーションエラーとして扱われる

input.setCustomValidity('');
// → 空文字を渡すと「エラーなし（valid）」になる
```

### セットで使うメソッド

| メソッド/プロパティ | 内容 |
|---|---|
| `setCustomValidity(msg)` | カスタムエラーメッセージをセット |
| `checkValidity()` | バリデーションOKか `true/false` で返す |
| `reportValidity()` | バリデーション結果をブラウザUIに表示する |
| `validity.valid` | 現在のバリデーション状態を取得 |

### 注意点

`setCustomValidity('')`（空文字）でリセットしないと、一度エラーにした要素がずっとinvalidのままになる。

```js
// よくあるパターン
if (input.value.length < 3) {
  input.setCustomValidity('3文字以上で入力してください');
} else {
  input.setCustomValidity(''); // ← リセット必須
}
```

---

## 余力があれば触れておくと良いこと

### `input` イベントと `blur` イベントの違い

| イベント | 発火タイミング |
|---|---|
| `blur` | フォーカスが外れたとき（1回） |
| `input` | 1文字入力するたびに発火 |

```js
// blur：フォーカスが外れたときにチェック（今回の実装）
input.addEventListener("blur", validateUsername);

// input：1文字入力するたびにチェック
input.addEventListener("input", validateUsername);
```

実務では用途によって使い分ける。入力中からリアルタイムにフィードバックしたい場合は `input`、入力が一段落してからチェックしたい場合は `blur` が自然なUXになる。

