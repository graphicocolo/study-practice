# React main.tsx と App.tsx

## 役割の違い

| ファイル | 役割 |
|---|---|
| `main.tsx` | **エントリーポイント**（入口）。HTMLとReactをつなぐだけ |
| `App.tsx` | **アプリの起点**。実際のアプリの中身はここから始まる |

## 処理の流れ

```
index.html → main.tsx → App.tsx → 各コンポーネント
```

## main.tsx の中身

通常これだけの短いコード。

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

「HTMLの `#root` 要素に `App` コンポーネントを描画してね」という指示だけ。アプリのロジックや画面構成には一切触れない。

## App.tsx の中身

アプリの実際の中身。ここで：

- hooks から値や関数を受け取る
- それを components に props として渡す

hooks（ロジック）と components（画面表示）の橋渡し役。

## 日常の例え

- **`main.tsx`** = 建物の玄関ドア（入るだけ）
- **`App.tsx`** = 受付ロビー（ここから各部屋に案内される）

## 用語メモ

- **エントリーポイント**（entry point）= プログラムの実行が始まる入口
- 「エンドポイント」（endpoint）は別の意味（APIのURLなど）なので混同に注意

