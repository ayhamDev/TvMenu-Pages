import { ICategory } from "./Category.interface";
import { IMenu } from "./Menu.interface";
import { IPage } from "./Page.interface";

export interface IMenuItem {
  id: string;

  pageId: string;

  menuId: string;

  categoryId: string;

  title: string;

  caption: string;

  price: string;

  imageUrl: string | null;

  imageId: string | null;

  visible: boolean;

  page?: IPage;

  category?: ICategory;

  menu?: IMenu;

  createdAt: Date;

  updatedAt: Date;
}
