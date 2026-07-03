// ① 型定義ファイルを作る

// ユーザー情報を表す型 User を定義して export する
export type User = {
  id: number;
  name: string;
  role: "admin" | "viewer";
}

// API レスポンスの共通ラッパー型 ApiResponse<T> を定義して export する
export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
}

// ⑥ 型と値が同名のとき（クラスの場合）

export class UserRecord {
  constructor(public id: number, public name: string) {}

  display() {
    console.log(this.id, this.name);
  }
}
