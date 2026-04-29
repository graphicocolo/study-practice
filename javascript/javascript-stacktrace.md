# JavaScript 実践 スタックトレース

## スタックトレース（Stack Trace）とは

エラーが発生したとき、**「どこを通ってそのエラーに辿り着いたか」の経路記録**。

---

## 具体例

```js
function c() {
  throw new Error("ここでエラー発生");
}

function b() {
  c();
}

function a() {
  b();
}

a();
```

コンソールに表示されるスタックトレース：

```
Uncaught Error: ここでエラー発生
  at c (script.js:2)   ← エラーが起きた場所
  at b (script.js:6)   ← c を呼んだ場所
  at a (script.js:10)  ← b を呼んだ場所
  at script.js:13      ← a を呼んだ場所
```

上から順に「エラー発生地点 → 呼び出し元 → そのまた呼び出し元…」と遡れる。

---

## なぜ「スタック」と呼ぶのか

関数の呼び出しは **スタック（積み重ね）** という構造で管理されている。

```
a() を呼ぶ
  └─ b() を呼ぶ（a の上に積む）
       └─ c() を呼ぶ（b の上に積む）
            └─ エラー発生 → 積まれた順番を記録してトレース
```

この「積まれた状態の記録」= スタックトレース。

---

## `console.error(error)` で出力される内容

```js
catch (error) {
  console.error("保存失敗:", error);
}
```

DevTools のコンソールに以下が表示される：

```
保存失敗: Error: ...
  at HTMLFormElement.<anonymous> (crudLocalStorage.js:32)
  at EventTarget.dispatchEvent (...)
  ...
```

ファイル名と行番号が出るので、「コードのどこで失敗したか」が一目でわかる。

| | `console.log` | `console.error` |
|---|---|---|
| スタックトレース | なし | あり |
| 表示色 | 通常 | 赤（目立つ） |
| デバッグ向き | 値確認用 | エラー調査用 |

---

## `return` vs `throw new Error`

| | `return` | `throw new Error` |
|---|---|---|
| 使える場所 | 関数の中のみ | どこでも |
| 実行の停止範囲 | その関数だけ | スクリプト全体 |
| エラーとして記録されるか | されない | される（スタックトレース付き） |
| 想定するケース | 正常系の分岐 | 「あってはならない」バグ |

トップレベル（関数の外）では `return` は使えないため、処理を止めたい場合は `throw` が唯一の手段。