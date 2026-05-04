# React イディオム集

> イディオム：「こういう目的にはこう書く」と広く使われている定番のコードパターン。

---

- オブジェクトの一部だけ変えてコピーする
- 条件が真のときだけ表示する（論理積 `&&` による条件付きレンダリング）
- 配列の要素を並び替え（ドラッグドロップで UI を並べ替える時などに使用）
- 要素を削除・移動・更新
- オブジェクトマップ

---

## オブジェクトの一部だけ変えてコピーする

```ts
{ ...obj, key: newValue }
```

- `...obj` で元のオブジェクトの全プロパティをコピー
- その後に書いたプロパティで上書きする

**例：**

```ts
const value = { minutes: 20, seconds: 30 }

// minutes だけ変えたい
const updated = { ...value, minutes: 25 }
// → { minutes: 25, seconds: 30 }
```

**出典：** `components/settings/TimeSettings.tsx`（ポモドーロタイマー）

---

## 条件が真のときだけ表示する（論理積 `&&` による条件付きレンダリング）

```tsx
{condition && <Component />}
```

- `condition` が真のときだけ `<Component />` が描画される
- 偽のときは何も描画されない

**例：**

```tsx
{isMuted && <VolumeX />}
// isMuted が true のときだけアイコンを表示
```

**`condition` が数値のときの注意：**

```tsx
{count && <List />}
// count が 0 のとき、false ではなく 0 が描画されてしまう
// → {count > 0 && <List />} と書くのが安全
```

**出典：** `components/settings/SettingsPanel.tsx`（ポモドーロタイマー）

---

## 配列の要素を並び替え（ドラッグドロップで UI を並べ替える時などに使用）

spliceは破壊的だからReactではコピーしてから使う

```js
  const reorderTodos = useCallback((activeId, overId) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === activeId); // 並べ替え対象となる TODO の index
      const newIndex = prev.findIndex((todo) => todo.id === overId); // 順番変更対象となる TODO の index

      if (oldIndex === -1 || newIndex === -1) return prev; // 該当する要素がなかった場合は現在の状態を返す

      const newTodos = [...prev]; // 配列をコピー
      const [removed] = newTodos.splice(oldIndex, 1); // splice で並べ替え対象を抜き取る
      // newTodos = [ A, B, C, D ] とすると...
      // splice(1, 1) → index1から1個取り出す
      // removed = B
      // const [removed] = の [] は分割代入。splice は取り出した要素を配列で返すので、その最初の1個を取り出している。
      // newTodos = [ A, C, D ]  ← B が抜けた
      newTodos.splice(newIndex, 0, removed); // 抜き取った B を newIndex の位置に差し込む
      // splice(3, 0, B) → index3の位置に、0個削除して、Bを挿入
      // newTodos = [ A, C, D, B ]
      // before: [ A, B, C, D ] after:  [ A, C, D, B ]
      // Bが末尾に移動した。配列の順番が変わったので、画面の表示順も変わる。

      return newTodos;
    });
  }, []);
```

---

## 要素を削除・移動・更新

React での定番操作パターン

React では元のデータを直接変えず、新しいデータを作って差し替えるのが基本。

| やりたいこと | Reactでの定番 | 理由 |
|---|---|---|
| 要素を削除 | `filter()` で除外した新しい配列を返す | 非破壊的 |
| 要素を移動 | コピーしてから `splice` × 2回 | splice は破壊的なのでコピーが必須 |
| 要素を更新 | `map()` で新しいオブジェクトに差し替え | 非破壊的 |

**出典：** `hooks/useTodos.js`（Todo アプリ）

```js
export const useTodos = () => {
  // 初期状態をローカルストレージから読み込む
  // useState に関数を渡すと初回レンダリング時だけ実行される
  const [todos, setTodos] = useState(() => {
    // localStorage のデータが壊れていた場合（JSON.parse が失敗する場合）でもクラッシュせず、空配列で起動できるようにしている
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Todoを削除(要素を削除)
  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // Todoを並び替え(要素を移動)
  const reorderTodos = useCallback((activeId, overId) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === activeId);
      const newIndex = prev.findIndex((todo) => todo.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTodos = [...prev];
      const [removed] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, removed);

      return newTodos;
    });
  }, []);

  // Todoを編集(要素を更新)
  const updateTodo = useCallback((id, newText) => {
    if (!newText.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  }, []);

}
```

---

## オブジェクトマップ

キーと値のペアを持つオブジェクトを使って、**switch文の代わりに値を引き出す**テクニック。

```tsx
// switch で書くと…
switch (showElement) {
  case 'TaxCalculator':   return <TaxCalculator />
  case 'BmiCalculator':   return <BmiCalculator />
  case 'SplitCalculator': return <SplitCalculator />
}

// オブジェクトマップで書くと…
const MAP = {
  TaxCalculator:   <TaxCalculator />,
  BmiCalculator:   <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
}

MAP[showElement]  // showElement の値でオブジェクトを検索して取り出す
```

辞書で単語を引くように、**キーで値を一発検索できる**のがポイント。

```tsx
import { type ReactElement, useState } from 'react'
import TaxCalculator from '@/components/TaxCalculator'
import BmiCalculator from '@/components/BmiCalculator'
import SplitCalculator from '@/components/SplitCalculator'
import ScoreSort from '@/components/ScoreSort'

// option を追加するとき VIEWS だけ変えればよい → 一元管理できる
const VIEWS = [
    { value: 'TaxCalculator', label: '税込価格計算' },
    { value: 'BmiCalculator', label: 'BMI計算' },
    { value: 'SplitCalculator', label: '割り勘計算' },
    { value: 'ScoreSort', label: '成績ソート' },
  ] as const // as const をつけるとリテラル型になる（value と label は文字列のまま、string にはならない）
type ViewType = typeof VIEWS[number]['value']
// VIEWS            → オブジェクトの配列
// VIEWS[number]    → 配列の各オブジェクト  { value: '...', label: '...' }
// VIEWS[number]['value'] → 各オブジェクトの value プロパティだけ

const isView = (v: string): v is ViewType => VIEWS.some((view) => view.value === v) // 文字列 v が VIEWS の value のどれかと一致するかをチェックする関数

const VIEW_COMPONENTS: Record<ViewType, ReactElement> = {
  TaxCalculator: <TaxCalculator />,
  BmiCalculator: <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
  ScoreSort: <ScoreSort />
}

function App() {
  const [showElement, setShowElement] = useState<ViewType>('TaxCalculator')

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto p-4 mt-4">
        <select
            className="ml-4 px-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            onChange={(e) => {
              const value = e.target.value
              if (isView(value)) setShowElement(value)
            }}
            value={showElement}
          >
            {VIEWS.map((view) => (
              <option key={view.value} value={view.value}>{view.label}</option>
            ))}
          </select>
      </div>
      {VIEW_COMPONENTS[showElement]}
    </div>
  )
}

export default App

```

### switch文との比較

| | switch文 | オブジェクトマップ |
|---|---|---|
| JSX内で使える | ❌（即時関数が必要） | ✅ |
| コードの長さ | 長め | 短め |
| 発想 | 条件分岐（上から順に比較） | 辞書引き（キーで直接取り出す） |

### JSX内で switch が使えない理由

JSX の `{ }` 内に書けるのは**式（expression）**のみ。`switch` は**文（statement）**なので構文エラーになる。  
オブジェクトマップは `MAP[key]` という式なので JSX 内に直接書ける。

**出典：** `study-app/react-practice/src/App.tsx`（成績ソートアプリ）