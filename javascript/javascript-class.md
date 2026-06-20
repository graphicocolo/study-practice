# JavaScript 実践 クラス

## ゲッター・セッター

クラスのプロパティへのアクセスを「読む」「書く」で制御する仕組み。

### ゲッター（get）— 読み取り専用の窓口

`()` をつけずにプロパティのように呼び出せる。「処理をしているのにプロパティのように見せたい」ときに使う。

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.lastName} ${this.firstName}`; // 2つのプロパティを合成
  }
}

const p = new Person("太郎", "山田");
console.log(p.fullName); // "山田 太郎" ← () なしで自然に読める
```

**王道の使い方：** 複数のプロパティを組み合わせた値を、あたかも1つのプロパティのように見せる。

### セッター（set）— 書き込みの窓口

値を代入するときに自動で動く。外からの代入に「バリデーション（チェック）」を挟めるのが役割。

```js
class Person {
  constructor(name) {
    this._name = name;
  }

  set name(value) {
    if (value === "") throw new Error("名前は空にできません");
    this._name = value;
  }

  get name() {
    return this._name;
  }
}

const p = new Person("山田");
p.name = "";    // ← セッターが発動してエラーを投げる
p.name = "田中"; // ← OK
```

### ゲッターとメソッドの違い

| | ゲッター | メソッド |
|---|---|---|
| 呼び出し方 | `obj.fullName` | `obj.greet()` |
| 用途 | プロパティとして見せたい値の計算 | 処理・操作 |

単に別のメソッドを呼ぶだけのゲッターは不要。プロパティを加工・合成した値を返すときに使う。

