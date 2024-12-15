import { ICategory } from "./Category.interface";
import { IMenuItem } from "./MenuItem.interface";
import { IPage } from "./Page.interface";

export interface IMenu {
  id: string;

  pageId: string;

  title: string;

  caption: string | null;

  imageUrl: string | null;

  imageId: string | null;

  visible: boolean;

  page?: IPage;

  category?: ICategory[];

  item?: IMenuItem[];

  createdAt: Date;

  updatedAt: Date;
}
