// クラスと型（`implements` / `extends`）

// ① クラスの基本
// class Animal {
//   name: string;
//   age: number;

//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }

//   describe(): string {
//     return `name: ${this.name}, age: ${this.age}歳`;
//   }
// }

// const animal = new Animal("Dog", 2);
// console.log(animal.describe()); // name: Dog, age: 2歳

// ② アクセス修飾子（`public` / `private` / `protected`）
// class Animal {
//   name: string;
//   private age: number;
//   protected species: string;

//   constructor(name: string, age: number, species: string) {
//     this.name = name;
//     this.age = age;
//     this.species = species;
//   }

//   describe(): string {
//     return `name: ${this.name}, age: ${this.age}歳`;
//   }
// }
// const animal = new Animal("Yellow", 3, "Bird");
// console.log(animal.age); // Property 'age' is private and only accessible within class 'Animal'.
// console.log(animal.species); // Property 'species' is protected and only accessible within class 'Animal' and its subclasses.

// ③ interface を実装する（`implements`）
// interface Describable {
//   describe(): string;
// }
// class Animal implements Describable {
//   name: string;
//   private age: number;
//   protected species: string;

//   constructor(name: string, age: number, species: string) {
//     this.name = name;
//     this.age = age;
//     this.species = species;
//   }

//   undescribe(): string {
//     return `name: ${this.name}, age: ${this.age}歳`;
//   }
// }
// const animal = new Animal("Blue", 2, "Rabbit");
// console.log(animal.undescribe()); // Class 'Animal' incorrectly implements interface 'Describable'.Property 'describe' is missing in type 'Animal' but required in type 'Describable'.

// ④ クラスの継承（`extends`）と `super`
// ⑤ メソッドのオーバーライド
// class Animal {
//   name: string;
//   age: number;

//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }

//   describe(): string {
//     return `name: ${this.name}, age: ${this.age}歳`;
//   }
// }
// class Dog extends Animal {
//   breed: string;

//   constructor(name: string, age: number, breed: string) {
//     super(name, age);
//     this.breed = breed;
//   }

//   bark(): string {
//     return "ワンワン！";
//   }

//   describe() {
//     return super.describe() + "（犬）";
//   }
// }
// const dog = new Dog("Mike", 1, "dog");
// console.log(dog.describe());
// console.log(dog.bark());

// ⑥ abstract class（抽象クラス）
abstract class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  abstract describe(): string;
}
// const animal = new Animal("Kevin", 1); // 抽象クラスのインスタンスは作成できません。
console.log();
class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }

  bark(): string {
    return "ワンワン！";
  }

  // describe(): string {
  //   return `name: ${this.name}, age: ${this.age}歳`;
  // }
}
const dog = new Dog("Kevin", 1, "Dog");
console.log(dog.bark()); // Non-abstract class 'Dog' does not implement inherited abstract member describe from class 'Animal'.