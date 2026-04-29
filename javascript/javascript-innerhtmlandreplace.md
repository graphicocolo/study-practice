# JavaScript 実践 `innerHTML` と `replaceChildren`

## `innerHTML = ""` と `replaceChildren()` の違い

どちらも全子要素を削除する同じ効果がある。

```js
displayList.innerHTML = "";        // 従来の方法
displayList.replaceChildren();     // モダンな方法
```

| | `innerHTML = ""` | `replaceChildren()` |
|---|---|---|
| 動作 | HTML文字列として解析・再構築 | DOM操作で直接削除 |
| パフォーマンス | やや低い（パース処理が走る） | 高い |
| ブラウザ対応 | 全ブラウザ | Chrome 86+ / Firefox 78+ / Safari 14+（モダンブラウザは問題なし） |

モダンな開発環境では `replaceChildren()` が推奨。
