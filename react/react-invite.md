# React Vite でセットアップ

## `JSX.Element` 型が使えない

```ts
// NG パターン
import React, { useState } from 'react'
// JSX 名前空間が見つからないエラー
const VIEW_COMPONENTS: Record<ViewType, JSX.Element> = {
  TaxCalculator: <TaxCalculator />,
  BmiCalculator: <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
  ScoreSort: <ScoreSort />
}

// OK パターン
// import type ReactElement と書いているのは、verbatimModuleSyntax: true の設定により「型だけのインポートは type を明示する」が必要なため
import { type ReactElement, useState } from 'react'
// OK
const VIEW_COMPONENTS: Record<ViewType, ReactElement> = {
  TaxCalculator: <TaxCalculator />,
  BmiCalculator: <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
  ScoreSort: <ScoreSort />
}
```

tsconfig.app.json の "types": ["vite/client"] は読み込む型パッケージを明示的に限定しています
JSX 名前空間は @types/react が提供しますが、この設定では自動で読み込まれません
ReactElement は react パッケージから直接インポートするので、この制限に影響されません

直接の原因は Vite のデフォルト設定
Vite で React プロジェクトをセットアップすると、tsconfig.app.json に自動でこれが追加される
"types": ["vite/client"]
これは import.meta.env など Vite 独自の型を使えるようにするための設定です。ただし types を明示すると、そこに書いたもの以外の @types/* はグローバルに読み込まれなくなる
Vite を使わない素の TypeScript 環境だと types の指定がないため @types/react が自動で読まれ、JSX.Element がそのまま使える