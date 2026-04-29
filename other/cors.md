# CORS

## CORS（Cross-Origin Resource Sharing）とは

**Origin（オリジン）** = `プロトコル + ドメイン + ポート` の組み合わせ

```
https://example.com:443  ← これが1つのオリジン
```

---

### なぜ CORS が存在するか

ブラウザには **「別のオリジンへのリクエストは原則ブロック」** というセキュリティルールがある（同一オリジンポリシー）。

悪意あるサイトが勝手に別サービスのAPIを叩けないようにするためです。

```
あなたのページ: https://myapp.com
API:           https://jsonplaceholder.typicode.com  ← 別オリジン！
```

---

### CORS エラーが出る／出ない

| 状況 | 結果 |
|---|---|
| API側が `Access-Control-Allow-Origin: *` を返す | 許可 → `type: 'cors'` で成功 |
| API側がヘッダーを返さない | ブロック → CORSエラー |

`jsonplaceholder.typicode.com` は練習用なので全許可設定になっており、成功する。

---

### Node.js で実行しても `type: 'cors'` と出る理由

Node.js には同一オリジンポリシーはないが、fetch の実装が `cors` モードをデフォルトにしているため。
実際にブロックされるのはブラウザ上での話。

---

> 詳しくは CS基礎 > ネットワーク で扱う。
> 今は「**別ドメインへのリクエストはブラウザに制限がある**」とだけ覚えておけばOK。
