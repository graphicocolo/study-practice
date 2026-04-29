# JavaScript 実践 form と submit

submit で外部へデータ送信がない場合でもform要素で囲む必要はあるのか？

ある。以下の理由で

- フォームの各要素にrequired属性が使用できる
- Enterキーで送信可能
- リセットボタン実装が容易
- セマンティクス（意味的な正しさ）の観点から ユーザーが値を入力して送信する構造は、外部送信しなくても「フォーム」です。アクセシビリティの観点でもスクリーンリーダーが「フォーム」として認識してくれます。

**例えば**

```html
<!-- 単純な計算機能のフォーム（外部へのデータ送信なし） -->
...
    <form id="tax-form" class="form grid gap-6">
      <div class="grid gap-2 mb-1">
        <label for="price" class="form-label text-base">税抜価格 (円)</label>
        <input type="number" class="form-control" id="price" min="1" step="1" required>
      </div>
      <div class="grid gap-2 mb-1">
        <label for="tax-rate" class="form-label text-base">消費税率 (%)</label>
        <select id="tax-rate" class="select w-[180px]">
          <option value="8">8%</option>
          <option value="10">10%</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary font-bold text-base bg-sky-600">計算する</button>
      <button type="reset" class="btn btn-secondary font-bold text-base text-white bg-neutral-500">リセット</button>
    </form>
...
```