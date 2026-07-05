# 追従CTA：複数IntersectionObserverの競合状態（レースコンディション）

## 現象

末尾付近で短い間隔で上下スクロールを繰り返し、最後まで（ページ最下部まで）スクロールし終えると、
本来は非表示になるはずのCTA（`#wrapCta`）が**消えないまま残ることがある**。

対象コード: `study-practice/javascript/practice/codequest/script.js`

---

## 関連コード（現状）

```js
// 監視対象
const firstHideFlagElements = document.querySelectorAll("section:nth-of-type(-n + 3)");
const displayFlagElements = document.querySelectorAll("section:nth-of-type(n + 4):nth-last-of-type(n + 3)");
const hideFlagElements = document.querySelector("section:nth-last-of-type(2) .sentinel");
const ctaWrap = document.getElementById("wrapCta");

// 中央ライン方式のオプション（表示・最初の非表示用）
const options = {
  root: null,
  rootMargin: "-50% 0px",
  threshold: 0,
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function setUpIntersectionObserver(targets, options, func, className) {
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        func(ctaWrap, className);
      }
    });
  }
  const observer = new IntersectionObserver(callback, options);
  const targetList = targets instanceof Element ? [targets] : targets;
  targetList.forEach((target) => {
    observer.observe(target);
  });
}

// 3つの独立したobserverを個別にセットアップ
setUpIntersectionObserver(firstHideFlagElements, options, removeClass, "-visible");
setUpIntersectionObserver(displayFlagElements, options, addClass, "-visible");
setUpIntersectionObserver(hideFlagElements, { root: null, rootMargin: "0px", threshold: 0 }, removeClass, "-visible");
```

---

## 原因

### 1. 3つのobserverがそれぞれ独立していて、状態を共有していない

- `firstHideFlagElements`（先頭3セクション）→ 交差したら`removeClass`
- `displayFlagElements`（中間セクション、4〜10番目）→ 交差したら`addClass`
- `hideFlagElements`（センチネル、11番目のsection内）→ 交差したら`removeClass`

それぞれのコールバックは`entry.isIntersecting`が`true`になった瞬間だけ反応し、`false`（画面から外れた時）には何もしない。つまり**「今どの状態にあるべきか」を都度計算するのではなく、直近に発火したイベントだけで最終的なクラスが決まる**設計になっている。

### 2. `IntersectionObserver`のコールバックは非同期・バッチ処理される

コールバックはスクロールと完全に同期して即座に呼ばれるわけではなく、ブラウザが交差状態の変化を**まとめて後から通知**する。通常のスクロール速度では問題にならないが、短時間に何度も交差状態が変化すると、**実際に起きた順序通りに各observerのコールバックが処理される保証がない**。

### 3. 末尾付近での具体的なシナリオ

短時間に上下スクロールを繰り返すと、次の2つのイベントがごく短い間隔で発生し得る。

1. 少し上にスクロール → `displayFlagElements`（4〜10番目のsection）の中央ラインを再度通過 → `addClass`が発火
2. すぐ下にスクロールし直す → センチネルが再び画面に入る → `removeClass`が発火

本来は「2」が最後に処理されれば非表示のまま正しく終わるはずだが、ブラウザ側の通知バッチ処理の都合で、**「1」の`addClass`が「2」の`removeClass`より後に処理されてしまうことがある**。結果として、最終的なスクロール位置はページ最下部（非表示であるべき状態）なのに、CTAに`-visible`クラスが残ってしまう。

---

## 根本的な問題点

「今どの状態にあるべきか」の判断が、3つのバラバラな監視の**「最後に発火したイベント勝ち」**になっており、スクロール位置という単一の真実（source of truth）に基づいて判断していない。イベント駆動・早い者勝ちの設計そのものが、高速なスクロールに対して構造的に脆弱。

---

## 改善の方向性（検討中・未実装）

- **ガード条件を入れる**: `displayFlagElements`側の`addClass`を実行する前に、「センチネルが今まさに交差しているか」も確認し、交差していれば表示しない（非表示を優先するロジック）
- **状態を一元化する**: 3つのobserverに分けず、1箇所で「現在どのゾーンにいるか」を判定してクラスを決定する設計に変える（例: スクロール位置や各要素の交差状態をまとめて保持し、優先順位付きで最終状態を1回だけ計算する）

どちらの方針で直すかは今後の検討事項。

---

## 改善（状態を一元化する）

`IntersectionObserver`を使ったまま一元化することは可能。「検知の仕組み」（`IntersectionObserver`が非同期・バッチで効率よく交差状態を教えてくれる部分）と「判断のロジック」（検知結果をもとに最終的にクラスをどう決めるか）は別物であり、レースコンディションの原因は後者にある。スクロール位置を自前で都度計算する（`scroll`イベント＋`getBoundingClientRect()`のような重い方式）に戻す必要はない。

### 考え方

各observerのコールバックで直接`addClass`/`removeClass`するのではなく、まず「今その要素と交差しているか」を状態として保持し、状態を更新するたびに1箇所で最終的なクラスを判定する。

```js
const state = {
  inFirstZone: false,   // firstHideFlagElements と交差中か
  inDisplayZone: false, // displayFlagElements と交差中か
  pastSentinel: false,  // センチネルを通過済みか
};

function updateCta() {
  if (state.pastSentinel) {
    removeClass(ctaWrap, "-visible"); // 非表示が最優先
  } else if (state.inDisplayZone) {
    addClass(ctaWrap, "-visible");
  } else {
    removeClass(ctaWrap, "-visible");
  }
}
```

### 単純なケース：監視対象が1つ（センチネル）

```js
const sentinelObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    state.pastSentinel = entry.isIntersecting; // true/falseどちらもそのまま代入
    updateCta(); // 状態を更新するたびに、毎回最終判定をやり直す
  });
}, { root: null, rootMargin: "0px", threshold: 0 });

sentinelObserver.observe(hideFlagElements);
```

ポイントは、`if (entry.isIntersecting) { removeClass(...) }`のようにtrueの時だけ直接DOMを書き換えるのをやめて、`entry.isIntersecting`の値（true/false）をそのまま`state.pastSentinel`に代入すること。これにより「今センチネルと交差しているかどうか」という最新情報が常に正しく保持される。値を更新した直後に必ず`updateCta()`を呼ぶことで、判定は常に「今わかっている最新の状態」を元に行われる。

### 監視対象が複数ある場合の注意点

`firstHideFlagElements`や`displayFlagElements`は`NodeList`（複数のsection）なので、単純に`state.inDisplayZone = entry.isIntersecting`と書くと、複数要素のうち「最後に処理されたentryの値」で上書きされてしまう（本来は「グループ内のどれか1つでも交差していればtrue」としたい）。これには、交差している要素の集合を`Set`で管理する方法がある。

```js
const intersectingDisplayElements = new Set();

const displayZoneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      intersectingDisplayElements.add(entry.target);
    } else {
      intersectingDisplayElements.delete(entry.target);
    }
  });
  state.inDisplayZone = intersectingDisplayElements.size > 0; // 1つでも交差していればtrue
  updateCta();
}, options);

displayFlagElements.forEach((el) => displayZoneObserver.observe(el));
```

`firstHideFlagElements`側も同じパターンで対応できる。

### `entry.target`とは何か

`IntersectionObserver`のコールバックには、交差状態が変化した要素の情報を持つ`IntersectionObserverEntry`オブジェクトの配列（`entries`）が渡される。`entries.forEach((entry) => {...})`の`entry`はその中の1つ分の情報で、主に以下のプロパティを持つ。

| プロパティ | 内容 |
|---|---|
| `entry.target` | 交差状態が変化した、実際のDOM要素そのもの |
| `entry.isIntersecting` | その要素が現在viewport（root）と交差しているかどうか（true/false） |

`observer.observe(target)`で監視対象として登録したDOM要素そのものが、状態が変化した時に`entry.target`として返ってくる。`displayFlagElements`は複数のsection要素（NodeList）なので、`displayZoneObserver`は複数の要素を同時に監視しており、どれか1つでも交差状態が変わるとコールバックが呼ばれ、`entry.target`には「具体的にどのsection要素が変化したのか」が入る。

```js
if (entry.isIntersecting) {
  intersectingDisplayElements.add(entry.target);
} else {
  intersectingDisplayElements.delete(entry.target);
}
```

このコードは、`intersectingDisplayElements`という`Set`（重複のない集合）で「今現在、画面と交差している`displayFlagElements`内の要素」を管理している。

- 交差した（`isIntersecting: true`）→ その要素（`entry.target`）を`Set`に追加する
- 交差しなくなった（`isIntersecting: false`）→ その要素を`Set`から削除する

これにより「今どのsectionが交差中か」の一覧を常に最新の状態に保つことができる。この`Set`の`size`（要素数）を見れば、「監視対象のうち1つでも交差しているか」（`size > 0`）が簡単にわかる（`displayFlagElements`は複数要素なので、単純な`true`/`false`の変数1つだと「どの要素の状態か」を区別できず上書きされてしまうため、`Set`で個別に管理している）。

### まとめ

- 各observerのコールバックは「trueだからDOMを書き換える」ではなく「trueでもfalseでも、まず自分が担当する状態（`state`のプロパティ）を正しく更新する」ことに専念する
- 状態を更新した後、必ず`updateCta()`を呼んで、その時点でわかっている全ての状態から、優先順位に沿って最終的なクラスを1箇所で決定する
- 対象が複数ある監視グループは、単一のbooleanでは足りないので`Set`などで「今交差している要素の集合」を管理し、その`size`で判定する

これなら、どのobserverのコールバックが先に来ても後に来ても、`updateCta()`が毎回「今わかっている全情報」から同じロジックで結果を出すため、早い者勝ちの競合は起きなくなる。

---

## 改善後の表示不具合

スクロールと表示非表示の状態は安定したが、今度はCTAがチラついて表示される

### 原因：セクション間のmarginによる「隙間」

`index.html`の各sectionには`mb-6`（`margin-bottom: 1.5rem`）が付いている。

```html
<section class="mb-6 pb-4 border-b-1 border-b-gray-200">
```

`IntersectionObserver`が判定に使う要素の範囲は**border box（marginを含まない）**なので、隣り合うsection同士の間には「どちらの要素にも属さない隙間（marginの分）」が存在する。

`displayFlagElements`（4〜10番目の7つのsection）は`rootMargin: "-50%"`（画面中央のライン）で、複数の要素を`Set`で管理している。

```js
state.inDisplayZone = intersectingDisplayElements.size > 0;
```

スクロールしていくと、中央ラインが「4番目のsectionの終わり」から「5番目のsectionの始まり」へ移動する瞬間、ちょうどそのmarginの隙間を通過するタイミングで、どちらのsectionとも交差していない状態（`Set`が空）が一瞬発生する。

```
section4 ──┐
           │← 中央ラインがここにある間は size > 0 (true)
           ┘
  ↓ margin-bottom（隙間）
           ┐
           │← 中央ラインがこの隙間にある瞬間、size === 0 (false)
           ┘
section5 ──┐
           │← 中央ラインがここに入ると再び size > 0 (true)
```

この一瞬の`false`→`true`の切り替わりで`updateCta()`が呼ばれ、`removeClass`→`addClass`が連続で実行されるため、CSSのopacityトランジション（0.4s）が「消えかけて、すぐにまた現れる」形になり、ちらつきとして見える。4〜10番目の間にある6つの境界を通過するたびに同じことが起こり得る。

### 改善の方向性（検討中・未実装）

1. **境界を1点に絞る**: `displayFlagElements`全体を監視するのではなく、「4番目のsectionだけを見る」方式にすれば、内部の6つの境界（隙間）を通過することがなくなり、ちらつきの原因自体がなくなる（ただし、スクロールを戻した時に途中のsectionでも再表示される、という挙動は失われる）
2. **隙間を埋める**: 4〜10番目のsectionをラップする1つの親要素を用意し、その親要素だけを監視対象にする（親要素にはmarginの隙間がないため、常にどこかと交差し続ける）
3. **ちらつきを吸収する**: 状態が一瞬`false`になっても即座に反映せず、少し遅延させてから`updateCta()`を実行する（デバウンス）。ただし、これは根本原因を隠すだけの対症療法

---

## JS側でfirstHideZoneObserverが実質不要な理由

実際は、`firstHideZoneObserver` が不要なのは、CSSの初期状態が非表示だからではない

CSSの初期状態が担っている役割は、JSが実行されるまでの一瞬（ページ読み込み直後、まだIntersectionObserverが交差判定を終える前）にCTAがちらっと見えてしまう」ことを防ぐためのものです。JSの実行を待たずに、最初からCSSだけで非表示にしておく、という役割

```js
function updateCta() {
  if (state.pastSentinel) {
    removeClass(ctaWrap, "-visible");
  } else if (state.inDisplayZone) {
    addClass(ctaWrap, "-visible");
  } else {
    removeClass(ctaWrap, "-visible"); // ここがポイント
  }
}
```

observer.observe(target)を呼ぶと、スクロールが起きていなくてもその時点の交差状態を1回必ず通知するという仕様がIntersectionObserverにはあります。なので、ページ読み込み直後、displayZoneObserverとsentinelObserverがセットアップされた瞬間に、それぞれ「まだ交差していない（false）」という初回コールバックが発火し、state.inDisplayZone = false, state.pastSentinel = falseになります。

この状態でupdateCta()が呼ばれると、else節に落ちてremoveClassが実行されます。つまり、firstHideZoneObserverがなくても、displayZoneObserverとsentinelObserverの初回通知だけで、ページ冒頭では自動的に非表示状態になります。

さらに言うと、state.inFirstZoneは「表示ゾーンでもなく、通過済みでもない」状態の一種でしかなく、else節はその条件を「表示ゾーンかどうか」「通過済みかどうか」の2つの否定だけで包括的にカバーしています。ページの先頭にいようが、中間の隙間にいようが、elseに該当すれば同じように非表示になるので、「先頭3セクション」だけを特別扱いするfirstHideZoneObserverの出番が実質ない、という構造になっています。

なので、「CSSで最初から非表示にしてあるから」ではなく、**「JSの判定ロジック自体が、表示ゾーン以外は常に非表示にする作りになっているから」**というのがより正確な理由です。CSSの初期非表示は、あくまで「JSが動き出すまでの一瞬の保険」という別の役割を担っています。