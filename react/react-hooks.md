# React Hooks

[組み込みの React フック](https://ja.react.dev/reference/react/hooks)

## React hooks

関数コンポーネントで、状態管理や副作用などReactの機能を使うための仕組み。クラスを書かずに、シンプルな関数の形でReactの力を借りられる。

- useState コンポーネントの中で「変わる値」を持ち、それが変わったら画面を自動で再描画する仕組み
- useCallback 関数を使い回すための道具、メモ化されたコールバック関数の作成用。関数が毎回作り直されるのを防いで「同じ関数」を保つ<br>
子コンポーネントに props として関数を渡す場合など
- useEffect useEffectは、「○○が起きたら△△する」を書く場所。「画面の描画」以外のことをやる場所。
  - useEffect は「外の世界とやりとりする場所」
  - 「外の世界」の具体例 React が管理していないもの（API、DOM、ブラウザAPI、タイマー）に触れている
  - 「始めたら止める必要があるもの」にはクリーンアップが必要、と覚えるとシンプル
- useMemo メモ化された値の作成用、「計算結果を覚えておいて使い回す道具」<br>計算コストが高い場合に使用（例えば数百〜数千件のリストをフィルタ/ソート、など）単純な四則計算には不要
- useRef ミューテーブルな参照を作成するため、画面の再描画なしに値を保持する箱

---

## 状態管理

###  「状態(State)」とは？

冷蔵庫の中身をイメージしてください。

- 冷蔵庫の中身（牛乳がある、卵が3個ある…）= State
- 中身が変わると、冷蔵庫に貼ってある買い物メモが自動で書き換わる = 再レンダリング

Reactでは「今のデータの状態」が変わると、画面が自動的に更新されます。

### useState — 自分の部屋のメモ帳

自分の部屋にあるメモ帳のようなもの。**そのコンポーネントだけが読み書き**できます。

```ts
// 例：自分の部屋の電気のON/OFF スイッチ。自分の部屋にしか影響しない
const [isOn, setIsOn] = useState(false);
```

### Props — 親から子への手渡し

親が子どもにお弁当を渡すようなもの。子どもはもらったお弁当を食べられるけど、中身を勝手に変えることはできません。

```ts
// 例：親「今日のお弁当はおにぎりね」→ 子は受け取るだけ。
// 親
<Child lunch="おにぎり" />
// 子
function Child({ lunch }) {
  return <p>今日は{lunch}だ</p>;
}
```

### バケツリレー問題（Prop Drilling）

おじいちゃんが孫にお年玉を渡したいけど、必ず親を経由しなければならない状態。親は中身に興味がないのに、ただ受け渡すだけ。

おじいちゃん → 親（ただ通すだけ） → 孫

面倒だし、間に入る人が増えるほど大変になる。

### Context — 家族共有の掲示板

リビングに共有の掲示板を置くイメージ。家族の誰でも見に行ける。バケツリレーが不要になります。

```ts
// 例：「今日の夕飯はカレー」と掲示板に書けば、誰でも確認できる。
const DinnerContext = createContext();

// リビング（親）に掲示板を設置
<DinnerContext.Provider value="カレー">
  <Family />
</DinnerContext.Provider>

// 孫が直接見に行ける
function Grandchild() {
  const dinner = useContext(DinnerContext);
  return <p>今日は{dinner}だ</p>;
}
```

### Redux / Zustand — マンションの管理人室

住人が増えて掲示板だけでは管理しきれなくなったとき、**管理人室（Store）**を作って一元管理する仕組み。

- Store = 管理人室（全体の情報を保管）
- Action = 「電球が切れました」という届出
- Reducer = 管理人が届出を見て対応するルール表

小さなアプリ（一人暮らし）なら useState で十分。<br>
大きなアプリ（マンション）になったら Redux や Zustand を検討する。

小さく始めて、必要になったら大きい仕組みに移行する、というのが基本の考え方です。

---

## 副作用

Reactの本来の仕事（画面を描く）以外のこと。例えばサーバーからデータを取ってくる、タイマーをセットする、ブラウザのタイトルを変えるなど。

副作用を管理する：これらの「おまけの仕事」を適切なタイミングで実行し、不要になったら後片付けすること。

```typescript
useEffect(() => {
  // ① ここは「副作用」→ すぐ実行される(コンポーネントが表示されたとき、依存配列が変わったとき)
  return () => {
    // ② ここは「クリーンアップ」→ React が後で実行する(コンポーネントが消えるとき、次の副作用が実行される前)
  }
}, [依存配列])  
```

```typescript
// あなたがReactに「お片付け係」を渡している
useEffect(() => {
  // 部屋に入る（タイマー開始）
  const timer = setInterval(...)

  // 「部屋を出るときはこれを実行してね」とReactに関数を渡す
  return () => {
    clearInterval(timer)  // 電気を消す係
  }
}, []) 
```

---

## ミュータブル、イミュータブル

ミュータブル（mutable）

**「変更できる」**という意味です。

- ミューテーブル（mutable） = 値を後から書き換えられる
- イミュータブル（immutable） = 値を後から書き換えられない

Reactでは state を**イミュータブルに扱う（直接変えず、新しい値を作って渡す）**のがルールです。直接書き換えるとReactが変化を検知できず、画面が更新されません。

```js
// ミュータブルの例：配列を直接書き換える
const arr = [1, 2, 3];
arr.push(4); // 元の配列自体が変わる → [1, 2, 3, 4]

// イミュータブルの例：元を変えず新しい配列を作る
const arr2 = [1, 2, 3];
const newArr = [...arr2, 4]; // arr2はそのまま、新しい配列ができる
```

イミュータブルな state 更新の具体例

1. プリミティブ値（数値・文字列）の場合

プリミティブ値はそもそも「書き換え」ができないので、自然にイミュータブルです。

```ts
const [count, setCount] = useState(0);
setCount(count + 1); // 0を書き換えるのではなく、新しい値「1」を渡している
```

2. オブジェクトの場合

```ts
const [user, setUser] = useState({ name: "太郎", age: 20 });

// NG（直接書き換え = ミュータブル）
user.age = 21; // 元のオブジェクトを直接変更している
setUser(user); // 同じ参照なのでReactは「変わってない」と判断 → 再描画されない！

// OK（新しいオブジェクトを作る = イミュータブル）
// スプレッド構文で中身をコピーしつつ、ageだけ上書きした「新しいオブジェクト」を渡す
setUser({ ...user, age: 21 });
```

3. 配列の場合

```ts
const [todos, setTodos] = useState(["買い物", "掃除"]);

// NG（push は元の配列を直接変える）
todos.push("洗濯"); // 元の配列が変わる
setTodos(todos); // 同じ参照 → 再描画されない！

// OK（スプレッド構文で新しい配列を作る）
// 元の配列はそのまま、新しい配列を作って渡す
setTodos([...todos, "洗濯"]);
```

なぜ「新しく作る」必要があるのか？

Reactは state が変わったかどうかを参照（メモリ上の住所）が変わったかで判断しています。

```text
元のオブジェクト → 住所A
直接書き換え    → 住所Aのまま（中身は変わったけど住所は同じ）→ Reactは気づかない
新しく作る      → 住所Bになる → Reactが「変わった！」と気づいて再描画する
```

つまり「新しい値を作って渡す」とは、中身をコピーした別のオブジェクト/配列をset関数に渡すということです。スプレッド構文（...）がその主な手段になります。

---

## useState

コンポーネントの中で「変わる値」を持ち、それが変わったら画面を自動で再描画する仕組み

```ts
const [count, setCount] = useState(0);
```

### useStateの初期値に無名関数が設定されている場合

これは**lazy initialization（遅延初期化）**と呼ばれるパターン

**ローカルストレージやAPIアクセスなど、コストのかかる処理を初期値にしたいときに使うパターン**

```ts
// ① 値をそのまま渡す
const [theme, setTheme] = useState('light')

// ② 関数を渡す（遅延初期化）
const [theme, setTheme] = useState(() => {
  // この中の処理は初回レンダリング時にだけ実行される
  return getSavedTheme() || getSystemTheme()
});
```

なぜ関数を渡すのか

getSavedTheme() は内部で localStorage にアクセスします。もし関数を渡さずに書くと：

```ts
// ❌ 再レンダリングのたびに毎回 localStorage にアクセスしてしまう
const [theme, setTheme] = useState(getSavedTheme() || getSystemTheme())
// この書き方だと getSavedTheme() が毎回の再レンダリングで実行されます（結果は初回しか使われないのに）。
```

これは引数に渡す前にgetSavedTheme() || getSystemTheme() が評価されます。

再レンダリングのたびに：

1. getSavedTheme() を実行  ← 毎回走る
2. getSystemTheme() を実行 ← 毎回走る
3. その結果をuseStateに渡す
4. useStateは「2回目以降だからこの値は無視するか」と捨てる ← 無駄！

計算結果は使われないのに、関数の呼び出し自体は毎回起きてしまうわけです。

関数を渡すパターン（初回だけ実行される）

```ts
const [theme, setTheme] = useState(() => {
  // この中の処理は初回レンダリング時にだけ実行される
  return getSavedTheme() || getSystemTheme()
});
```

これは関数そのものを渡しているだけなので、呼び出すかどうかはReact側が決めます。

初回レンダリング：

1. useStateが「初回だな、関数を呼んで初期値を取得しよう」
2. () => getSavedTheme() || getSystemTheme() を実行 ← ここだけ！
3. 返ってきた値をstateにセット

2回目以降のレンダリング：

1. useStateが「もうstateあるから、この関数は呼ばなくていいや」
2. 関数は呼ばれない ← スキップ！

関数で渡せば、初回だけ実行されて無駄がなくなります。**ローカルストレージやAPIアクセスなど、コストのかかる処理を初期値にしたいときに使うパターン**です。

もっとシンプルな例で考える

```js
// こう書くと add() はその場で実行される
console.log(add(1, 2));  // add()が「呼ばれる」

// こう書くと add は渡されるだけで、実行はされない
setTimeout(add, 1000);   // add を「渡すだけ」。呼ぶのはsetTimeout側が決める
```

useState も同じで、関数を渡すと「呼ぶタイミング」をReactに委ねることになります。Reactは初回だけ呼べばいいと知っているので、2回目以降はスキップしてくれる、という仕組みです。

普通の値なら不要です。初期値の計算が重い時だけ使います。

```ts
// これで十分（軽い処理）
const [count, setCount] = useState(0);

// こっちを使う（重い処理）
const [data, setData] = useState(() => heavyComputation());
```

---

## useCallback

関数を使い回すための道具、メモ化されたコールバック関数の作成用

関数が毎回作り直されるのを防いで「同じ関数」を保つ

**メリット：**無駄な再レンダリングを防いでパフォーマンス向上

**いつ使う？：**関数を子コンポーネントに渡すとき、useEffect の依存配列に入れるときなど

**メモ化** テストの答えを一度計算したら、ノートにメモしておいて、次に同じ問題が出たらまた計算せずにメモを見るだけで済ませること。プログラムでも同じで、一度作った結果を覚えておいて再利用する仕組み。

Reactでは画面が更新されるたびに関数が新しく作り直される。でも毎回作り直すのは無駄なこともある。useCallbackを使うと「この関数は前と同じだから作り直さなくていいよ」とReactに伝えられる。

### `useCallback` の必要性

useCallback を使わない場合、コンポーネントが再レンダリングされるたびに、毎回新しい関数が作られます。

```typescript
// 子コンポーネントに関数を渡す場合
<Button onClick={start} />
```

なし → 毎回「新しい関数」が渡される → 子コンポーネントも毎回再レンダリング

あり → 「同じ関数」が渡される → 子コンポーネントは無駄に再レンダリングしない

日常の例え

useCallback なし：
毎日新しいメモ用紙に「タイマーを開始する」と書いて渡す → 受け取る側は「また新しいメモだ！確認しなきゃ」と毎回反応

useCallback あり：
同じメモを使い回す → 受け取る側は「前と同じメモだから、何もしなくていいや」とスルー

依存配列について

```typescript
// 依存がない → ずっと同じ関数を使い回す
const start = useCallback(() => { ... }, [])

// workDuration に依存 → workDuration が変わったときだけ新しい関数を作る
const reset = useCallback(() => { ... }, [workDuration])  
```

**役割：**数をメモ化（記憶）して再利用する

**メリット：**無駄な再レンダリングを防いでパフォーマンス向上

**いつ使う？：**関数を子コンポーネントに渡すとき、useEffect の依存配列に入れるときなど

1. 関数を子コンポーネントに渡すとき

useCallback なし（問題あり）

```ts
import { useState, memo } from 'react';

// memo で囲んで「propsが変わらなければ再レンダリングしない」子
const Child = memo(({ onClick }) => {
  console.log('Child レンダリング');
  return <button onClick={onClick}>押す</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ★ 毎回新しい関数が作られる
  const handleClick = () => {
    console.log('clicked');
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>カウント+1</button>
      <Child onClick={handleClick} />
    </div>
  );
}
```

何が起きるか：

1. 「カウント+1」を押す → Parentが再レンダリング
2. handleClick が新しい関数として作り直される
3. Childから見ると onClick が前回と別物 → memoが効かず再レンダリングされる

useCallback あり（解決）

```ts
import { useState, memo, useCallback } from 'react';

const Child = memo(({ onClick }) => {
  console.log('Child レンダリング');
  return <button onClick={onClick}>押す</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ★ 依存配列が空 → 初回に作った関数をずっと使い回す
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>カウント+1</button>
      <Child onClick={handleClick} />
    </div>
  );
}
```

結果： 「カウント+1」を押しても handleClick は同じ関数のまま → Childは再レンダリングされない。

2. useEffect の依存配列に入れるとき

useCallback なし（問題あり）

```ts
import { useState, useEffect } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('react');
  const [lang, setLang] = useState('ja');

  // ★ 毎回新しい関数が作られる
  const fetchData = () => {
    console.log(`検索: ${query}`);
    // fetch(`/api/search?q=${query}`) ...
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ← 毎回「別の関数」なので毎回実行される

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <select value={lang} onChange={e => setLang(e.target.value)}>
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

何が起きるか：

1. lang を変える → 再レンダリング
2. fetchData が新しい関数になる
3. useEffectは「依存が変わった」と判断 → queryが変わっていないのにfetchDataが実行される

useCallback あり（解決）

```ts
import { useState, useEffect, useCallback } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('react');
  const [lang, setLang] = useState('ja');

  // ★ queryが変わったときだけ新しい関数を作る
  const fetchData = useCallback(() => {
    console.log(`検索: ${query}`);
    // fetch(`/api/search?q=${query}`) ...
  }, [query]); // ← queryだけに依存

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ← queryが変わったときだけ実行される

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <select value={lang} onChange={e => setLang(e.target.value)}>
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

結果： lang を変えても fetchData は同じ関数のまま → useEffectは実行されない。query を変えたときだけ実行される。

---

## useMemo

メモ化された値の作成用、「計算結果を覚えておいて使い回す道具」

useCallbackが関数を使い回すのに対し、useMemoは計算結果（値）を使い回す。

---

## useRef

ミューテーブルな参照を作成するため、画面の再描画なしに値を保持する箱

ミューテーブルな参照とは「中身を自由に書き換えられる付箋」のようなもの。普通の変数と違って、書き換えても画面は更新されないが、値はずっと覚えている。

**「ミューテーブルな（mutable）」**
= 「中身を自由に書き換えられる」という意味。

Reactのstateはイミュータブル（直接書き換えNGのルール）だが、`useRef` の `.current` は直接書き換えていい。

```ts
// useState は直接書き換えNG（イミュータブル）
state.count = 1 // ❌ ダメ！setCountを使わないと

// useRef は直接書き換えOK（ミュータブル）
ref.current = 1 // ✅ これでいい
```

**「参照を作成する」**
= `useRef(0)` で作られるのは `{ current: 0 }` というオブジェクト。`.current` の中に値が入っている。「参照」とは、その箱（オブジェクト）へのポインタのようなもの。

**「画面の再描画なしに」**
= `.current` を書き換えても、Reactは「変わった！」と気づかないので画面は更新されない。

**「値を保持する箱」**
= 再レンダリングが起きても、`.current` の中身はリセットされずに残り続ける（普通の変数は再レンダリングで初期化されるのに対して）。

**中学生向けのたとえ**

> 黒板（useState）と、先生の手元のメモ帳（useRef）の違い。
>
> - 黒板に書いた値が変わると → クラス全員が気づいて画面が更新される（再レンダリング）
> - メモ帳の値が変わっても → 先生だけが知っていて、クラスには知らせない（再レンダリングなし）
>
> でもメモ帳の中身は消えずにずっと残っている。次にメモ帳を開けば、前に書いた値が読める。

**このアプリでの使われ方（StickyNote.tsx）**

```ts
const dragState = useRef<DragState>({
  isDragging: false,
  startX: 0,
  ...
})
```

ドラッグ中は `mousemove` が1秒に何十回も発火する。その度に state を更新すると画面が何十回も再描画されてガクガクする。`useRef` に保持することで、「値は覚えておくが、画面は更新しない」を実現している。

**useRef はコンポーネントとカスタムフック、どちらで使われるか**

用途によって使われる場所が異なる。

| 用途 | コンポーネント | カスタムフック |
|---|---|---|
| DOM 要素への参照（`ref={...}`） | よく使う | ほぼ使わない |
| ドラッグ・頻繁なイベントの一時値 | よく使う | あまりない |
| タイマーID・前回値の保持 | まれ | よく使う |

DOM 要素はコンポーネントにしか存在しないので、DOM 参照の `useRef` はほぼコンポーネント専用。タイマーIDや前回値の保持はフックの中でも登場する。

```js
// カスタムフックでの useRef 例（タイマーIDの保持）
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
```

「DOM が絡む `useRef` はコンポーネント寄り、データ管理の `useRef` はフック寄り」

---

## useEffect

useEffectは、「○○が起きたら△△する」を書く場所

要するに：「画面の描画」以外のことをやる場所。

「描画以外のこと」という説明をもう少し正確にすると、useEffect は React の外にある世界（外部システム）と同期するためのものです。

```typescript
useEffect(() => {
  // ここに「やりたいこと」を書く 
}, [監視する値]);
```

3つのパターンだけ覚える：

1. 画面が表示されたとき1回だけ実行

```typescript
useEffect(() => {
  console.log('画面が表示された！');
}, []);  // 空の配列 = 最初の1回だけ
```

2. 特定の値が変わるたびに実行

```typescript
useEffect(() => {
  console.log('countが変わった！');
}, [count]);  // countが変わるたびに実行
```

3. 後片付けが必要なとき

```typescript
useEffect(() => { 
  const timer = setInterval(() => {...}, 1000);
  return () => {
    clearInterval(timer);  // 後片付け
  };
}, []);
```

タイマーの例で考えると：

- タイマーをスタートする → useEffectの中でsetInterval
- 画面を離れる → 後片付けでclearInterval

useEffectの中で最後にreturn...でReactに後で（「次の実行の直前」や「画面から消えるとき」）実行してほしい処理を指定することもある

```typescript
useEffect(() => {
  // ① ここは「副作用」→ すぐ実行される(コンポーネントが表示されたとき、依存配列が変わったとき)
  return () => {
    // ② ここは「クリーンアップ」→ React が後で実行する(コンポーネントが消えるとき、次の副作用が実行される前)
  }
}, [依存配列])  
```

```typescript
// あなたがReactに「お片付け係」を渡している
useEffect(() => {
  // 部屋に入る（タイマー開始）
  const timer = setInterval(...)

  // 「部屋を出るときはこれを実行してね」とReactに関数を渡す
  return () => {
    clearInterval(timer)  // 電気を消す係
  }
}, []) 
```

あなたが関数を実行するのではなく、Reactに「この関数を適切なタイミングで実行してね」と預けているのです。

```markdown
コンポーネント表示
↓
useEffect 実行
↓
（時間経過）
↓
依存配列が変化
↓
return の関数実行 ← **ここで前回の後片付け**
↓
useEffect 再実行
```

クリーンアップ関数が必要な場合

「登録したもの」や「動かし始めたもの」を止める・解除する必要があるときです。

```ts
// 1. イベントリスナーの解除
useEffect(() => {
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}, [])

// 2. タイマーの停止
useEffect(() => {
  const id = setInterval(() => tick(), 1000)
  return () => clearInterval(id)
}, [])

// 3. WebSocket等の接続切断
useEffect(() => {
  const ws = new WebSocket('wss://example.com')
  return () => ws.close()
}, [])
```

なぜ必要か

クリーンアップしないと、コンポーネントが画面から消えた後も処理が動き続けてしまうからです。

例えばタイマーをクリーンアップしないと：

1. ページAでタイマー開始
2. ページBに移動（ページAのコンポーネントは消える）
3. タイマーはまだ動いている → メモリリークやエラーの原因

fetch でデータ取得（取得して終わり）、document.title の変更（残っても害がない）、などはクリーンアップ不要な場合が多い

「始めたら止める必要があるもの」にはクリーンアップが必要、と覚えるとシンプル

useEffect は「外の世界とやりとりする場所」

「外の世界」の具体例

共通点は、React が管理していないもの（API、DOM、ブラウザAPI、タイマー）に触れていることです。

```ts
// ① APIからデータを取得する
useEffect(() => {
  fetch('/api/users').then(res => res.json()).then(setUsers)
}, [])

// ② ブラウザのタイトルを変える
useEffect(() => {
  document.title = `残り${count}秒`
}, [count])

// ③ タイマーを動かす（setInterval）
useEffect(() => {
  const id = setInterval(() => tick(), 1000)
  return () => clearInterval(id)  // クリーンアップ
}, [])

// ④ イベントリスナーを登録する
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

|  やりたいこと  |  使うもの  |  例  |
| ---- | ---- | ---- |
|  値を変換してからstateに入れる  |  普通の関数  |  clamp、フォーマット  |
|  stateから計算できる値を作る  |  useMemo  |  秒数変換  |
|  Reactの外の世界と連携する  |  useEffect  |  API通信、タイマー、DOM操作  |

---

## useState と useRef の違い

どちらも「値を覚えておく箱」だが、**再レンダリングを起こすかどうか**が根本的に違う。

| | useState | useRef |
|---|---|---|
| 値を変えると？ | **画面が更新される** | 画面は更新されない |
| 値はいつリセットされる？ | 再レンダリングのたびに関数が走るが値は保持 | コンポーネントが消えるまで保持 |
| 書き方 | `const [value, setValue] = useState(0)` | `const ref = useRef(0)` |
| 読み書き | `value` / `setValue(1)` | `ref.current` / `ref.current = 1` |

```ts
// useState — 変えたら画面が更新される
const [count, setCount] = useState(0)
setCount(1) // → 画面が再描画される

// useRef — 変えても画面は更新されない
const count = useRef(0)
count.current = 1 // → 画面は何も変わらない。でも値は 1 になっている
```

**どっちを使う？の判断基準**

> 「この値が変わったとき、画面を更新する必要があるか？」
> - Yes → `useState`
> - No（でも値は覚えておきたい） → `useRef`

---
