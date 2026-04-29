# フロントエンドとバックエンドの役割

## フロントエンドとバックエンドの正確な意味

| | フロントエンド | バックエンド |
|---|---|---|
| 実行場所 | **ユーザーのブラウザ** | **サーバー（自分たちが管理）** |
| 見えるか | コードが丸見え | ユーザーからは見えない |
| 代表技術 | HTML / CSS / JS / React | Node.js / Python / Go / SQL |

---

## フロントエンドからDBに直接接続してはいけない理由

フロントエンドのコードはユーザーに丸見えになる。

```js
// ブラウザのコードに書いたら → 誰でも見られる
const DB_PASSWORD = "secret123"  // ← 丸見え
const API_KEY = "sk-xxxxx"       // ← 丸見え
```

フロントエンドからDBに直接接続しようとすると：

- DB接続情報（ホスト・パスワード）が全員に漏れる
- 悪意あるユーザーが任意のSQLを実行できる
- アクセス制御ができない（「このユーザーはこのデータだけ」という制限）

---

## バックエンドが存在する意味

**「信頼できる場所で処理を行う」**こと。

```
ブラウザ（信頼できない）→ バックエンド（信頼できる）→ DB
```

バックエンドがやっていること：

1. **認証・認可** — このユーザーは誰か、何を見る権限があるか
2. **機密情報の保護** — DBパスワード・APIキーをサーバー側に隠す
3. **ビジネスロジック** — 「購入処理」「在庫チェック」などの複雑な処理
4. **バリデーション** — フロントのチェックは迂回できるので、サーバー側でも確認

---

## React + Express と Next.js の違い

### React + Express（境界が明確）

```
[ブラウザ]               [サーバー]
React                    Express
  ↓ fetch('/api/users')     ↓
  ←────── JSON ────────────  DBに接続してデータ取得
```

コードが**物理的に別プロジェクト**に分かれているため、境界が見た目でわかる。

### Next.js（同じプロジェクト内に共存）

```ts
// app/actions.ts
'use server'  // ← この1行でサーバー側コードになる

import { db } from './db'

export async function getUsers() {
  return await db.select().from(users)  // DBに直接アクセス
}
```

```tsx
// app/page.tsx（ブラウザで動くコード）
import { getUsers } from './actions'

export default async function Page() {
  const users = await getUsers()  // サーバー関数を呼んでいるだけ
  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>
}
```

- `'use server'` が付いた関数 → **サーバーで実行**（ブラウザには届かない）
- `'use client'` が付いたコンポーネント → **ブラウザで実行**

### 比較まとめ

| | React + Express | Next.js |
|---|---|---|
| 実行場所の境界 | 同じ（サーバーとブラウザは別） | 同じ（サーバーとブラウザは別） |
| コードの置き場所 | 物理的に別プロジェクト | 同じプロジェクト内に混在 |
| DBへのアクセス | Expressのみ | Server Actionsのみ |
| 違いが見えやすいか | 見えやすい | 見えにくい |

**論理的な境界は同じ。物理的な置き場所が違うだけ。**

---

## Next.js + Drizzle + Supabase の構造

```
[ブラウザ]                [Next.jsサーバー]         [Supabase]
                          'use server'
Page.tsx          →       action.ts                →  PostgreSQL
（Server Actionを呼ぶ）   （Drizzleでクエリ組み立て）  （実際のDB）
                  ←       データを返す              ←
```

各ツールの役割：

```
Supabase = DBのホスティング（場所）
Drizzle  = DBへのアクセス方法（道具・ORM）
```

### 処理の流れ

1. **フロント**（ブラウザ）→ Server Actionを呼ぶ
2. **サーバー**（Next.js）→ Drizzleでクエリを組み立てる
3. **DB**（Supabase上のPostgreSQL）→ データを返す

React + Expressと構造は同じ3層。書き方が統合されているので「全部フロントでやっている」ように見えるが、サーバーは確実に存在している。

---

## Next.js + Hono の組み合わせ

Hono は軽量なWebフレームワーク。Next.js と組み合わせる方法は2パターンある。

### パターン1：Next.js の中に Hono を組み込む（同一プロジェクト）

```
my-app/
├── app/
│   ├── page.tsx          ← フロント（React）
│   └── api/
│       └── [[...route]]/
│           └── route.ts  ← ここで Hono を使う（バック）
```

Server Actions の代わりに Hono でAPIルートを定義するイメージ。物理的には同じプロジェクトだが、**フロントとバックの境界がコード上でより明確**になる。

### パターン2：Next.js と Hono を完全に別サーバーで立てる

```
my-project/
├── frontend/   ← Next.js（Reactのフロント）
└── backend/    ← Hono（APIサーバー）
```

React + Express と同じ構造。Hono が軽量なため、Cloudflare Workers や Deno などのエッジ環境にバックエンドをデプロイするケースで選ばれる。

### 構成ごとの比較

| 構成 | 物理的な分離 | 境界の明確さ |
|---|---|---|
| Next.js のみ（Server Actions） | 同一プロジェクト | 見えにくい |
| Next.js + Hono（内包） | 同一プロジェクト | やや明確 |
| Next.js + Hono（分離） | 別プロジェクト | 明確 |
| React + Express | 別プロジェクト | 明確 |

「フロントとバックを明確に分けたい」目的なら、パターン2（完全分離）が最もわかりやすい。ただし管理するプロジェクトが2つになる手間とのトレードオフがある。
