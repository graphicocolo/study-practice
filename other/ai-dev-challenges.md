# AI 開発チャレンジ ロードマップ

LLM / RAG / MCP / Mastra を活用した開発を、難易度順に整理。
現在地（JavaScript/React基礎）から始めて、TypeScript → Mastra → フルスタック RAG へ段階的に進む。

---

## ★☆☆☆☆ 今すぐできる（JavaScript + fetch）

### 1. Claude API でチャットボット

Claude API に fetch でリクエストを投げて、回答を表示するだけのシンプルな画面。

```
HTML フォーム → fetch → Claude API → 回答を DOM に表示
```

- 使う技術：HTML / JavaScript / fetch / Claude API（Anthropic）
- ポイント：API キーを `.env` ではなく直書きしない（GitHubに上げない）
- 参考：[Anthropic API ドキュメント](https://docs.anthropic.com)

同じAnthropicアカウントで両方ログインできる

- claude.ai → Claudeをチャットで使うUI
- [Claude Console](https://platform.claude.com/login) → APIキーの発行・使用量の確認などの開発者向け管理画面 AIモデル「Claude」を自身のアプリやシステムに組み込むための開発者向けプラットフォーム（管理画面）

Gemini を使うため、次回調査

[4. LLM API キーの取得](https://zenn.dev/shinseitaro/books/crewai-hands-on/viewer/setup#4.-llm-api-キーの取得)

---

### 2. 天気 + AI コメント

天気 API で取得したデータを Claude に渡して「今日のひとこと」を生成する。
JS 卒業制作の天気アプリに AI コメント機能を追加する形で試せる。

```
天気 API → 気温・天気データ取得 → Claude に渡す → コメント生成 → 表示
```

---

## ★★☆☆☆ TypeScript 習得後（Mastra 入門と並走）

### 3. Mastra で最初のエージェント

Mastra の公式チュートリアルに沿って、TypeScript でエージェントを1つ作る。

```ts
// エージェントが「今日の学習内容を要約して」に答えるだけのシンプルな例
const agent = new Agent({
  name: 'StudyBot',
  model: claude,
  instructions: '...',
})
```

- 使う技術：TypeScript / Mastra / Claude API
- 学べること：型付きでエージェントを定義する感覚、ツールの渡し方

---

### 4. 日報要約エージェント

日報 markdown ファイルをエージェントに読ませて、振り返りコメントを生成する。

```
日報 .md ファイル → Mastra エージェントが読み込み → 学びの要約・励ましを生成
```

- `studyloadmap.md` で構想していた「日報×Mastra」の最初のステップ
- ファイル読み込みは MCP の filesystem ツールで実現できる

---

## ★★★☆☆ React + Mastra（React 卒業制作レベル）

### 5. 日報×Mastra モチベーションアップツール

日報データを Mastra エージェントが分析し、React UI で振り返りを表示するアプリ。

```
日報 .md → Mastra エージェント → 振り返り・学習量グラフ・励まし → React UI で表示
```

- 使う技術：React / TypeScript / Mastra / Vercel AI SDK
- `studyloadmap.md` 「他作りたいもの」に記載の構想

---

### 6. 学習ノート Q&A ボット（RAG の基本形）

`study-basic/` 以下のノート markdown を読み込んで、「useRef って何？」などの質問に答えるボット。

```
質問
 ↓
学習ノート .md を検索（キーワードマッチ or ベクトル検索）
 ↓
関連ノートを Claude に渡す
 ↓
回答生成
```

- 使う技術：TypeScript / Mastra / RAG
- これが「RAG の基本形」の体験になる

---

## ★★★★☆ Node.js / バックエンド習得後

### 7. ベクトル検索 RAG

学習ノートをベクトル化して Supabase（pgvector）や Pinecone に保存し、意味的に近いノートを検索して回答生成。

```
学習ノート → Embedding（ベクトル化） → ベクトル DB に保存
                                            ↓
質問 → 質問もベクトル化 → 類似ノートを検索 → Claude に渡す → 回答
```

- 使う技術：TypeScript / Mastra / Supabase pgvector または Pinecone
- 「キーワードに引っかからない質問にも答えられる」ようになる

---

### 8. MCP サーバーを自作する

自分の学習データ（日報・ノート）に特化した MCP サーバーを TypeScript で実装する。
Claude Desktop や Mastra エージェントから呼び出せるようにする。

```
Claude / Mastra → MCP プロトコル → 自作 MCP サーバー → 日報・ノートを返す
```

- 使う技術：TypeScript / MCP SDK（Anthropic 公式）
- 学べること：MCP の仕組みを内側から理解できる

---

## ★★★★★ フルスタック（発展）

### 9. プログラミング Q&A サポートアプリ

MDN・公式ドキュメント・自分のノートを横断検索して、プログラミングの質問に答えるフル RAG アプリ。

```
質問 → ① 自分のノートを検索 → ② MDN 等を検索 → 結果を統合 → Claude で回答 → Web UI で表示
```

- 使う技術：Next.js / TypeScript / Mastra / RAG / ベクトル DB / Vercel デプロイ
- `md/rag/rag-challenge-row.md` で構想していたもの

---

### 10. ローカル LLM エージェント（Ollama）

Ollama でローカル LLM（Llama 3 など）を動かし、API コストゼロでエージェントを動かす。

```
Mastra エージェント → Ollama（ローカル） → Llama 3 で回答生成
```

- 使う技術：TypeScript / Mastra / Ollama
- `md/rag/rag-challenge-highrow-compare.md` で調べていたオープンソース LLM 活用の実践

---

## 難易度まとめ

| # | アプリ | 難易度 | 必要なスキル |
|---|---|---|---|
| 1 | Claude API チャットボット | ★☆☆☆☆ | JavaScript / fetch |
| 2 | 天気 + AI コメント | ★☆☆☆☆ | JavaScript / fetch |
| 3 | Mastra で最初のエージェント | ★★☆☆☆ | TypeScript / Mastra |
| 4 | 日報要約エージェント | ★★☆☆☆ | TypeScript / Mastra / MCP |
| 5 | 日報×Mastra モチベーションアップツール | ★★★☆☆ | React / TypeScript / Mastra |
| 6 | 学習ノート Q&A ボット（RAG 基本） | ★★★☆☆ | TypeScript / Mastra / RAG |
| 7 | ベクトル検索 RAG | ★★★★☆ | TypeScript / Mastra / ベクトル DB |
| 8 | MCP サーバーを自作 | ★★★★☆ | TypeScript / MCP SDK |
| 9 | プログラミング Q&A サポートアプリ | ★★★★★ | Next.js / Mastra / RAG / デプロイ |
| 10 | ローカル LLM エージェント | ★★★★★ | TypeScript / Mastra / Ollama |

---

## 参考

- [Anthropic Claude API ドキュメント](https://docs.anthropic.com)
- [Mastra 公式ドキュメント](https://mastra.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [MCP 公式仕様](https://modelcontextprotocol.io)
- [海外の個人開発者による RAG・AI エージェントサービス一覧](https://note.com/hobbydevelop/n/n26cf40ad13fe)
