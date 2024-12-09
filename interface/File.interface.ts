export type FileCatagory = "editor" | "media";

export interface IFile {
  id: string;

  path: string;

  name?: string;

  catagory: FileCatagory;

  type: string;

  size: number;

  createdAt: Date;

  updateAt: Date;
}
