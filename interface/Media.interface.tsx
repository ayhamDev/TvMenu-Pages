import { IClient } from "./Client.interface";
import { IFile } from "./File.interface";

export interface IMedia {
  id: string;

  title: string;

  clientId: string;

  client: IClient;

  file: IFile;

  createdAt: Date;

  updateAt: Date;
}
