// 引数の型アノテーションを書かない関数
function greet(name) {
    return "Hello, " + name;
}
export {};
// strict モードの場合
// `npx tsc --noEmit` で Parameter 'name' implicitly has an 'any' type.
// strict: false の状態
// npx tsc --noEmit` でエラーは出ない
//# sourceMappingURL=strict-test.js.map