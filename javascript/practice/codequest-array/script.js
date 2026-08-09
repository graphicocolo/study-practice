// コードの構成
// 1. HTML要素を取得
// - <div> → HTMLDivElement
// - <ul> / <ol> → HTMLUListElement / HTMLOListElement
// - <li> → HTMLLIElement
// - <button> → HTMLButtonElement
// - <input> → HTMLInputElement
// - <p> → HTMLParagraphElement
// - 不明・汎用 → HTMLElement
// 2. 変数・初期値を定義
// 3. 関数を定義
// 4. イベントリスナー

// 1. HTML要素を取得
/** @type {HTMLUListElement | null} */
const beforeList1 = document.getElementById("beforeList1");
/** @type {HTMLUListElement | null} */
const afterList1 = document.getElementById("afterList1");
/** @type {HTMLUListElement | null} */
const beforeList2 = document.getElementById("beforeList2");
/** @type {HTMLUListElement | null} */
const afterList2 = document.getElementById("afterList2");


// 2. 変数・初期値を定義
// Q1. map 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成
const products = [
  { name: "Tシャツ", price: 2000 },
  { name: "パーカー", price: 5000 },
  { name: "キャップ", price: 1500 },
  { name: "スニーカー", price: 8000 }
];
// Q2. filter ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
const users = [
  { name: '田中', age: 25, active: true },
  { name: '佐藤', age: 17, active: true },
  { name: '鈴木', age: 30, active: false },
  { name: '高橋', age: 22, active: true },
  { name: '伊藤', age: 19, active: true }
];
// Q3. find / findIndex 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
const orders = [
  { id: 101, status: 'completed', total: 3000 },
  { id: 102, status: 'completed', total: 1500 },
  { id: 103, status: 'pending', total: 4200 },
  { id: 104, status: 'pending', total: 800 },
  { id: 105, status: 'cancelled', total: 2000 }
];
// Q4. reduce カートの商品リストから、合計金額を計算
const cart = [
  { name: 'ノートPC', price: 120000, quantity: 1 },
  { name: 'マウス', price: 3000, quantity: 2 },
  { name: 'キーボード', price: 8000, quantity: 1 },
  { name: 'モニター', price: 35000, quantity: 2 }
];

// Q5. some / every 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const passwords = ['abc', 'password123', 'hello', 'securePass!', '12345678'];

// Q6. sort 記事リストを、公開日が新しい順に並べ替え
const articles = [
  { title: 'CSS Grid入門', publishedAt: '2025-01-15' },
  { title: 'React Hooks解説', publishedAt: '2025-03-20' },
  { title: 'JavaScript基礎', publishedAt: '2024-12-01' },
  { title: 'TypeScript実践', publishedAt: '2025-02-10' }
];

// Q7. map + filter 生徒リストから、合格者（スコア60以上）の名前だけを抽出した配列を作成
const students = [
  { name: '山田', score: 85 },
  { name: '中村', score: 42 },
  { name: '小林', score: 73 },
  { name: '加藤', score: 58 },
  { name: '吉田', score: 91 }
];

// Q8. reduce 商品リストを、カテゴリごとにグループ化したオブジェクトに変換
const items = [
  { name: 'りんご', category: 'fruit' },
  { name: 'キャベツ', category: 'vegetable' },
  { name: 'バナナ', category: 'fruit' },
  { name: 'にんじん', category: 'vegetable' },
  { name: 'ぶどう', category: 'fruit' }
];

// Q9. flatMap ユーザーリストから、全ユーザーのスキルを重複なしで1つの配列にまとめる
const developers = [
  { name: '田中', skills: ['HTML', 'CSS', 'JavaScript'] },
  { name: '佐藤', skills: ['JavaScript', 'React', 'TypeScript'] },
  { name: '鈴木', skills: ['CSS', 'React', 'Vue'] }
];

// Q10. 売上データから、カテゴリごとの売上合計、売上トップ3の商品名、全商品の平均単価を求める
const sales = [
  { product: 'ノートPC', category: 'electronics', price: 120000, sold: 15 },
  { product: 'マウス', category: 'electronics', price: 3000, sold: 200 },
  { product: 'デスク', category: 'furniture', price: 45000, sold: 30 },
  { product: 'チェア', category: 'furniture', price: 35000, sold: 50 },
  { product: 'モニター', category: 'electronics', price: 40000, sold: 80 },
  { product: 'ライト', category: 'furniture', price: 8000, sold: 100 }
];

// Q1. map 自分の解答 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成
// ↓このように書くと、配列自体は新しくても、中のproductオブジェクトは元のproductsと同じ参照なので、元のデータが書き換わってしまう
// const testProducts = products.map((product) => {
//   product.price = Math.round(product.price * 1.1);
//   return product;
// });
// 今回はオブジェクトの中身を書き換える必要があるため、スプレッドコピーをする
// 別の書き方
// ブロックボディ（{ } + return）
// アロー関数の本体を { } で囲んでいる＝「関数の中身をこれから書きます」という宣言。複数行の処理を書けるが、値を返すには明示的に return が必要。
// const productsTaxIn = products.map((product) => {
//   return { ...product, price: Math.round(product.price * 1.1) };
// });
// 2つ目：コンシスボディ（式を直接返す）
// { } を省略して、式1つだけを本体にした書き方。return は不要（式の評価結果が自動で返る）。
// 2つ目のコードは () で { } を包むことで「これはオブジェクトです」とJSに伝えている
const productsTaxIn = products.map((product) => ({ ...product, price: Math.round(product.price * 1.1) }));
products.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${item.name}：${item.price}`;
  beforeList1.appendChild(listItem);
});
productsTaxIn.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${item.name}：${item.price}`;
  afterList1.appendChild(listItem);
});
// Q1. map 解答 以下の商品リストの価格を、すべて税込み（10%）に変換した新しい配列を作成 
// const taxIncluded = products.map(item => ({
//   ...item,
//   price: item.price * 1.1
// }));
// console.log(taxIncluded);

// Q2. filter 自分の解答 ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
// 今回はオブジェクトの中身を書き換える必要はなく条件でデータを抽出しているだけなため、スプレッドコピー不要
const overTwentyAndActivedUsers = users.filter((user) => user.age >= 20 && user.active);
users.forEach((user) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${user.name} ${user.age} ${user.active ? "アクティブ" : ""}`;
  beforeList2.appendChild(listItem);
});
overTwentyAndActivedUsers.forEach((user) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${user.name} ${user.age} ${user.active ? "アクティブ" : ""}`;
  afterList2.appendChild(listItem);
});
// Q2. filter 解答 ユーザーリストから、20歳以上かつアクティブなユーザーだけを抽出
// const activeAdults = users.filter(user => user.age >= 20 && user.active);
// console.log(activeAdults);

// Q3. find / findIndex 自分の解答 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
const pendingOrderIndexFirst = orders.findIndex(order => order.status === "pending");
// console.log(pendingOrderIndexFirst)
const pendingOrderFirst = orders.find((order, idx) => idx === pendingOrderIndexFirst && order);
console.log(`注文ID：${pendingOrderFirst.id} 注文合計価格：${pendingOrderFirst.total}円`);
// Q3. find / findIndex 解答 注文リストから、ステータスが「pending」の最初の注文とそのインデックス番号を取得
// const pendingOrder = orders.find(order => order.status === 'pending');
// const pendingIndex = orders.findIndex(order => order.status === 'pending');
// console.log(pendingOrder);
// console.log(pendingIndex);

// Q4. reduce 自分の解答 カートの商品リストから、合計金額を計算
const totalPrice = cart.reduce(
  (accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity),
  0
);
console.log(totalPrice);
// Q4. reduce 解答 カートの商品リストから、合計金額を計算
// const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
// console.log(total);

// Q5. some / every 自分の解答 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const isOnePassed = passwords.some(password => password.length >= 8) ? "1つは8文字以上です" : "8文字以上のものはありません";
console.log(isOnePassed);
const isAllPassed = passwords.every(password => password.length >= 8) ? "全て8文字以上です" : "全て8文字以上ではありません";
console.log(isAllPassed);
// Q5. some / every 解答 以下のパスワードリストに対して、8文字以上のパスワードが1つでもあるか、すべてのパスワードが8文字以上か、を判定
const hasLong = passwords.some(pw => pw.length >= 8);
const allLong = passwords.every(pw => pw.length >= 8);
console.log(hasLong, allLong);

// Q6. sort 自分の解答 記事リストを、公開日が新しい順に並べ替え
// ↓↓↓自分の最初のロジック計画（冗長すぎて却下）↓↓↓
// 日付部分を-削除した形にフォーマット
// 文字列を数値に変換
// sort で降順に並べ替え
// 日付部分を再度フォーマット（****-**-**の形）
// console.logで確認
// claude code のアドバイス後のロジック
// ↓↓↓正確な降順にならない↓↓↓
// const sortedArticles = [...articles].sort((a, b) => b.publishedAt > afterList1.publishedAt ? 1 : -1);
const sortedArticles = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
console.log(sortedArticles);
sortedArticles.forEach(article => console.log(article.title));
// Q6. sort 解答 記事リストを、公開日が新しい順に並べ替え
// const sorted = [...articles].sort((a, b) =>
//   b.publishedAt.localeCompare(a.publishedAt)
// );
// sorted.forEach(a => console.log(a.title));

// Q7. map + filter 自分の解答 生徒リストから、合格者（スコア60以上）の名前だけを抽出した配列を作成
const filteredStudents = [...students].filter(student => student.score >= 60);
const passedStudents = filteredStudents.map(student => student.name);
console.log(passedStudents);
// Q7. map + filter 解答 生徒リストから、合格者（スコア60以上）の名前だけを抽出した配列を作成
// const passedNames = students
//   .filter(s => s.score >= 60)
//   .map(s => s.name);
// console.log(passedNames);

// Q8. reduce 自分の解答 商品リストを、カテゴリごとにグループ化したオブジェクトに変換
// なぜドット記法（acc.item.category）ではダメなのか
// acc.category と書いてしまうと、「category」という名前そのものをキーとして固定でアクセスしてしまいます。しかし今回やりたいのは「item.category の中身（'fruit' や 'vegetable'など、実行時に変わる値）をキー名として使う」ことなので、キー名を動的に指定できるブラケット記法 acc[...] が必要です。
const groupedItems = items.reduce((acc, item) => {
  // acc[item.category] の意味
  // オブジェクト acc に対して「item.category の値をキー名として」プロパティにアクセスする書き方
  // acc[item.category] をキーとするオブジェクトがなければ作成、初回の値は空の配列
  acc[item.category] ??= [];
  // 以降、そのキーの配列に商品名（または商品自体）を追加
  acc[item.category].push(item.name);
  return acc; // グループ化済みオブジェクトを返す
}, {});
console.log(groupedItems);
// Q8. reduce 解答 商品リストを、カテゴリごとにグループ化したオブジェクトに変換
// ポイント： reduce()でオブジェクトを構築するパターンは実務で頻出です。ES2024以降ではObject.groupBy()も使えます。
// const grouped = items.reduce((acc, item) => ({
//   ...acc,
//   [item.category]: [...(acc[item.category] || []), item.name]
// }), {});
// console.log(grouped);

// Q9. flatMap 自分の解答 ユーザーリストから、全ユーザーのスキルを重複なしで1つの配列にまとめる
// ↓↓↓自分の最初のロジック↓↓↓
// const allSkills = developers.flatMap((developer) => developer.skills.filter((item, index) => index === skills.indexOf(item)));
// claude code のアドバイス後
// 1. まず flatMap（または map して flat()）で、各開発者の skills をそのまま（重複除去せずに）1本の配列に平坦化する
// 2. その「平坦化済みの全スキル配列」に対して、初めて重複除去の処理をかける
const allSkills = developers.flatMap(developer => developer.skills);
const flatSkills = [...new Set(allSkills)];
console.log(flatSkills);
// Q9. flatMap 解答 ユーザーリストから、全ユーザーのスキルを重複なしで1つの配列にまとめる
// const allSkills = [...new Set(developers.flatMap(dev => dev.skills))];
// console.log(allSkills);

// Q10. 自分の解答 売上データから、カテゴリごとの売上合計、売上トップ3の商品名、全商品の平均単価を求める
// category ごとに金額をまとめたオブジェクト
const pricesByCategory = sales.reduce((acc, item) => {
  acc[item.category] ??= [];
  acc[item.category].push(item.price * item.sold);
  return acc;
}, {});
function calcTotalPrice (prices) {
  return prices.reduce((acc, cur) => {
    return acc += cur;
  }, 0);
}
// カテゴリごとの売上合計
console.log(`electronics 合計金額：${calcTotalPrice(pricesByCategory.electronics)}`);
console.log(`furniture 合計金額：${calcTotalPrice(pricesByCategory.furniture)}`);
// 売り上げ順に並べ替え
const sortedSales = [...sales].sort((a, b) => (b.price * b.sold - a.price * a.sold));
// 売上トップ3の商品名
for (let i = 0; i < 3; i++) {
  console.log(`第${i + 1}位：${sortedSales[i].product}`);
}
// 全商品の平均単価
// 販売数量で重み付けした平均単価（加重平均）（売上ベース、売り上げ合計 ÷ 個数（=総売上金額 ÷ 総販売個数））
const averageUnitPrice = sales.reduce((sum, item) => sum + item.price * item.sold, 0) / sales.reduce((sum, item) => sum + item.sold, 0);
console.log(averageUnitPrice);
// 単純平均 商品ラインナップ上の単価が平均いくらか
const simpleAverage = Math.floor(sales.reduce((sum, item) => sum + item.price, 0) / sales.length);
console.log(simpleAverage);
// Q10. 解答 売上データから、カテゴリごとの売上合計、売上トップ3の商品名、全商品の平均単価を求める
const salesByCategory = sales.reduce((acc, item) => ({
  ...acc,
  [item.category]: (acc[item.category] || 0) + item.price * item.sold
}), {});

const top3 = [...sales]
  .sort((a, b) => (b.price * b.sold) - (a.price * a.sold))
  .slice(0, 3)
  .map(item => item.product);

const avgPrice = sales.reduce((sum, item) => sum + item.price, 0) / sales.length;

console.log(salesByCategory, top3, avgPrice);

// Q10. のレビュー
// 【重要なバグ】カテゴリごとの売上合計が「単価の合計」になっている
// acc[item.category].push(item.price) のように price しかpushしておらず、
// soldを掛けていないため、calcTotalPriceの結果は「売上合計（price*soldの合計）」ではなく
// 「そのカテゴリの単価の合計」になってしまっている
// 例）自分の実装のelectronics合計：120000+3000+40000=163000
//    本来の売上合計（price*soldの合計）：120000*15+3000*200+40000*80=5,600,000
// → pricesByCategoryに配列でpriceを貯める二段階方式ではなく、
//   reduceの中で直接 price * sold を積算する一段階の実装に直すべき

// 【設計面の違い】
// ・カテゴリ名をelectronics/furnitureとハードコーディングして個別にconsole.logしている。
//   模範解答のsalesByCategoryはreduceで動的にキーを作るため、カテゴリが増減しても変更不要で汎用的
// ・トップ3をfor文の中でconsole.logするだけで配列として保持していない。
//   動作上は問題ないが、slice(0,3).map(item => item.product)のように配列化しておくと
//   後で別の処理（HTML描画など）に再利用しやすい

// 【良かった点】
// ・calcTotalPriceを独立した関数として切り出し、複数カテゴリで使い回せている
// ・平均単価について加重平均と単純平均の両方を計算して比較検証している
//   （模範解答のavgPriceは単純平均で、自分のsimpleAverageと一致：Math.floorの有無のみ違い）

// 3. 関数を定義
// テスト

// 4. イベントリスナー
