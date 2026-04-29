# React カスタムフック

## カスタムフックに入れるべき基準

### 分ける基準：「DOM に依存するか」

| | カスタムフック（useXxx） | コンポーネント（Xxx.tsx） |
|---|---|---|
| 何を扱う | ノートの**データ** | ユーザーの**UI操作** |
| DOM が必要か | 不要 | 必要（マウス座標・要素の参照） |
| 再利用できるか | どこでも使える | この UI 専用 |

> 「DOM やマウス座標が絡む処理はコンポーネント、データの読み書きはフック」

**判断するときは「引数に何が来るか」を見る**

| 引数の種類 | 例 | 場所 |
|---|---|---|
| `MouseEvent`、`TouchEvent`、DOM 要素 | `e.clientX`、`noteRef.current` | コンポーネント |
| 数値・文字列・真偽値 | `{x, y}`、`'yellow'`、`id` | フック |

`moveNote` / `changeColor` / `togglePin` は一見 DOM 依存に見えるが、受け取るのは普通の値（数値・文字列）だけで、中身は `setNotes(...)` のみ。DOM には触れていないのでフックに入る。

```
handleMouseMove（コンポーネント）
  → e.clientX から dx/dy を計算  ← DOM 依存
  → onMove(id, { x, y }) を呼ぶ ← 普通の値を渡す

moveNote（フック）
  → { x, y } を受け取って setNotes ← DOM に触れない
```

「DOM から値を取り出すのはコンポーネント、取り出した値を保存するのはフック」

### 付箋アプリ（StickyNote.tsx / useNotes.ts）での具体例

コンポーネントのイベントハンドラは2種類に分類できる。

**カスタムフックに入れられない（UI・DOM 専用）**
- `handleMouseDown` / `handleMouseMove` — マウス座標、`window` へのリスナー登録、カーソルの見た目変更。DOM がないと成立しない
- カラーピッカーの開閉 — `showColorPicker` は「ピッカーが今開いているか」という画面の状態。データではない

**カスタムフックがすでに持っている（データ処理）**
- `onMove` の中身 → `moveNote`（useNotes）
- `onUpdate` の中身 → `updateNote`（useNotes）
- `onDelete` の中身 → `deleteNote`（useNotes）

StickyNote のハンドラは「マウス座標を計算して `onMove` を呼ぶ」という **UI → データの橋渡し** をしている。データを書き換える処理本体は useNotes 側にある。

`handleMouseMove` が `onMove`（useNotes）を呼んでいる構造が、コンポーネントとフックの境界線を示している。

