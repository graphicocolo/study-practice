# JavaScript 実践 `audioContext`

[AudioContext](https://developer.mozilla.org/ja/docs/Web/API/AudioContext)

## AudioContext とは

Web Audio API を使うための「土台」となるオブジェクト。
ブラウザで音を扱うには、まず `AudioContext` のインスタンスを1つ作る必要がある。

```typescript
const audioContext = new AudioContext()
```

これが音に関するすべての操作の**起点**になる。

## Web Audio API とは

Web Audio API = ブラウザに内蔵された「音の工作キット」

日常の例えだと、スマホに最初から入っている「カメラアプリ」に近いです。

- スマホを買ったら、カメラアプリが最初から入っている → ブラウザにも音の機能が最初から入っている
- カメラアプリで撮影・フィルター加工・保存ができる → Web Audio API で音の生成・加工・再生ができる
- カメラアプリを使うには画面をタップする（プログラムで操作する） → Web Audio API を使うにはJavaScriptでコードを書く

外部のライブラリや音声ファイルを用意しなくても、ブラウザだけで音を鳴らせるのがポイントです。ポモドーロタイマーの通知音がまさにそれで、音声ファイルを一切使わずにコードだけでビープ音を作っています。

## 料理に例えると

| Web Audio API | 料理に例えると |
|---|---|
| `AudioContext` | **キッチン（作業場）** |
| `createOscillator()` | キッチンで音の素材（振動する波形）を作る |
| `createGain()` | キッチンで音量調節器を作る |
| `.connect()` | 器具同士をつなげる |
| `.destination` | スピーカー（お皿に盛る＝最終出力） |

キッチンがないと何も作れないように、`AudioContext` がないと音の生成・加工・再生ができない。

1. `new AudioContext()` → 場所を作る
2. `.createOscillator()` / `.createGain()` → 部品を作る
3. `.connect()` → 部品をつなぐ
4. `.start()` / `.stop()` → 再生する

## 基本的な使い方（playBeep の例）

```typescript
function playBeep(audioContext: AudioContext, ...) {
  // ① audioContext から音源を作る
  const oscillator = audioContext.createOscillator()
  // ② audioContext から音量調節器を作る
  const gainNode = audioContext.createGain()

  // ③ 音源 → 音量調節器 → スピーカー の順につなぐ
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // ④ 現在時刻を基準に再生開始・停止
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}
```

## 設計上のポイント：アプリ全体で1つだけ作る

`AudioContext` はアプリ全体で**1つだけ**作って使い回すのが基本。
毎回 `new AudioContext()` すると、呼ぶたびにキッチンを新築することになり非効率。

ポモドーロタイマーの `useAudio` フックでは `useRef` で1つだけ保持し、各関数に引数として渡している：

```typescript
const audioContextRef = useRef<AudioContext | null>(null)

const initializeAudio = useCallback(() => {
  if (audioContextRef.current) return
  audioContextRef.current = new AudioContext()
}, [])
```

## OscillatorType（波形の種類）

`AudioContext.createOscillator()` で作った音源には波形を指定できる。
型は `OscillatorType`（文字列リテラルのユニオン型）。

```typescript
type OscillatorType = "custom" | "sawtooth" | "sine" | "square" | "triangle"
```

| 値 | 波形 | 音の特徴 |
|---|---|---|
| `"sine"` | 正弦波 | 滑らかで純粋な音 |
| `"square"` | 矩形波 | ピコピコした電子音（ファミコンっぽい） |
| `"sawtooth"` | のこぎり波 | ブーンと鳴るシンセっぽい音 |
| `"triangle"` | 三角波 | sine と square の中間、柔らかい電子音 |
| `"custom"` | カスタム波形 | `setPeriodicWave()` で自分で定義する |

## AudioContext が作られてからの**経過時間（秒）**

Web Audio API は**「いつ音を鳴らすか」をこの経過時間で指定する**設計になっています。

ストップウォッチに近いです。new AudioContext() した瞬間にスタートボタンが押され、ずっとカウントし続けます。「ストップウォッチが5.0秒のときに音を鳴らして、5.15秒で止めて」という指示の出し方をします。