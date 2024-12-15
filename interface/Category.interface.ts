import { IMenu } from "./Menu.interface";
import { IMenuItem } from "./MenuItem.interface";
import { IPage } from "./Page.interface";

export interface ICategory {
  id: string;

  pageId: string;

  menuId: string;

  title: string;

  caption: string;

  imageUrl: string | null;

  imageId: string | null;

  visible: boolean;

  page?: IPage;

  menu?: IMenu;

  item?: IMenuItem[];

  createdAt: Date;

  updatedAt: Date;
}
