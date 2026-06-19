// 練習1
// 引数が string なら文字数を返し、number ならその数を2倍して返す
function process(value: string | number): number {
  if (typeof value === "string") {
    return value.length;
  } else {
    return value * 2;
  }
}

console.log(process("hello"));
console.log(process(10));

// 練習2
// 次の型と関数を完成させてください。
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rect"; width: number; height: number };

// `in` を使って面積を計算する関数を書く
function getArea(shape: Circle | Rectangle): number {
  if ("radius" in shape) {
    // return (shape.radius ** 2) * 3.14;
    // return (shape.radius ** 2) * Math.PI;
    // return (Math.pow(shape.radius, 2)) * Math.PI;
    return (Math.pow(shape.radius, 2)) * 3.14;
  } else {
    return shape.width * shape.height;
  }
}

console.log(getArea({ kind: "circle", radius: 5 }));         // 約78.5
console.log(getArea({ kind: "rect", width: 4, height: 6 })); // 24

// 練習3
// 次のカスタム型ガードと関数を完成させてください。
type User = { id: number; name: string };
type Guest = { sessionId: string };

// isUser という型ガード関数を作る（"id" in value を使う）
function isUser(value: User | Guest): value is User {
  return ("id" in value) ; 
}

function welcome(person: User | Guest) {
  if (isUser(person)) {
    console.log(`ようこそ、${person.name}さん`); // User 確定
  } else {
    console.log(`ゲストセッション: ${person.sessionId}`); // Guest 確定
  }
}

welcome({ id: 1, name: "Tom" });
welcome({ sessionId: "37853" });

// 4. 総合練習
// 次の3つの型が渡ってくる関数 `describe` を完成させてください。
type TextContent  = { type: "text"; body: string };
type ImageContent = { type: "image"; url: string; alt: string };
type VideoContent = { type: "video"; url: string; duration: number };

type Content = TextContent | ImageContent | VideoContent;

function describe(content: Content): string {
  if (content.type === "text") {
    return `テキスト: ${content.body}`;
  } else if (content.type === "image") {
    return `画像: ${content.url}（${content.alt}）`;
  } else {
    return `動画: ${content.url}（${content.duration}秒）`;
  }
}

console.log(describe({ type: "text", body: "How Are You?" }));
console.log(describe({ type: "image", url: "https://example.com/dog.jpg", alt: "犬の画像" }));
console.log(describe({ type: "video", url: "https://example.com/testmovie.mp4", duration: 10 }));