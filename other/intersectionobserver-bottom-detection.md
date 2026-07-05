# IntersectionObserver で「ページ最下部到達」を検知する

## 背景：`rootMargin: "-50%"` が窓サイズに弱い問題

`options = { rootMargin: "-50% 0px", threshold: 0 }` のように中央ラインで判定する書き方は、
ブラウザウィンドウが大きくなると、ページ末尾に近い要素で `isIntersecting` が一度も `true` にならないことがある。

---

## 3つの値の意味

| 値 | 意味 | 具体例 |
|---|---|---|
| `scrollY`（`window.scrollY`） | ページの一番上を基準に、今どれだけ下にスクロールしたか（px） | スクロールしてなければ `0` |
| `viewportHeight`（`window.innerHeight`） | ブラウザの表示領域の高さ（実際にページが見えている範囲） | ウィンドウを大きくすれば増える |
| `documentHeight`（`document.documentElement.scrollHeight`など） | ページ全体のコンテンツの高さ（スクロールしないと見えない部分も含む） | コンテンツが同じならウィンドウサイズが変わっても基本一定 |

紙（document）を窓（viewport）越しに覗いていて、`scrollY` は窓を紙のどこまでずらしたか、というイメージ。

---

## `scrollY + viewportHeight === documentHeight` が「スクロール最大」を意味する理由

窓が紙からはみ出すことはできないので、

```
scrollY の最大値 = documentHeight - viewportHeight
```

これを変形すると

```
scrollY(最大) + viewportHeight = documentHeight
```

つまり「窓の下端がちょうど紙の下端と一致した状態」＝一番下までスクロールしきった状態。

```
documentHeight = 3000, viewportHeight = 800 の場合
scrollY 最大 = 3000 - 800 = 2200

紙(document)                窓(viewport)
0 ─────────────┐
                │
                │
2200 ┌──────────┼── scrollY (最大時、窓の上端はここ)
     │  窓の中身  │
3000 └──────────┘── 窓の下端 = documentHeight と一致
```

---

## `-50%`（中央ライン方式）がなぜ窓サイズに弱いか

`rootMargin: "-50% 0px"` は「viewport中央のライン」を判定基準にする。このラインが到達できる文書上の一番奥（下端）は

```
中央ラインの最大到達位置 = scrollY(最大) + viewportHeight / 2
                       = (documentHeight - viewportHeight) + viewportHeight / 2
                       = documentHeight - viewportHeight / 2

D - V + V/2
-V + V/2 の部分だけ見ると、Vを1個引いて、Vの半分を足しているので、差し引き「Vの半分を引いた」のと同じになります。
（例: V=800なら、-800 + 400 = -400 = -V/2 と一致）
```

`viewportHeight` が大きいほど、`documentHeight` から引かれる量が増えて到達位置が浅くなる。

```
例: documentHeight = 3000

viewportHeight = 800 のとき
  中央ラインの最大到達位置 = 3000 - 400 = 2600

viewportHeight = 2500 のとき（ウィンドウを大きくした）
  中央ラインの最大到達位置 = 3000 - 1250 = 1750
```

監視対象の要素が `y = 2000〜3000` あたりにあると、ウィンドウが大きい場合（到達位置1750）は中央ラインが絶対に届かず、`isIntersecting` が一度も `true` にならない。

---

## センチネル方式（`rootMargin: "0px"`）が窓サイズに依存しない理由

ページの一番下（`documentHeight` とほぼ同じ位置）に監視用の空要素（センチネル）を置き、`rootMargin: "0px"`（デフォルト）で監視する。
判定は「中央」ではなく「viewportに1pxでも重なっているか」なので、条件は

```
交差する条件: scrollY + viewportHeight >= センチネルのtop位置
```

センチネルの `top` はほぼ `documentHeight` なので

```
scrollY + viewportHeight >= documentHeight
```

これは「スクロール最大時の式」そのもの。`viewportHeight` がいくつであっても、一番下までスクロールすれば必ず成立するため、必ず交差が起きる。

---

## まとめ

- 中央ライン方式（`-50%`）: 到達限界が `documentHeight - viewportHeight/2` → **窓が大きいほど届きにくい**
- センチネル + `0px` 方式: 交差条件が `scrollY + viewportHeight >= documentHeight` → **窓サイズに関係なく、一番下までスクロールすれば必ず成立する**

「ページ最下部に到達したか」を知りたいだけなら、中央到達を待つより、末尾にセンチネル要素を置いて `0px` で監視する方が窓サイズに依存せず安定する。
