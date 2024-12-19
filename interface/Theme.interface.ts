import { IMenu } from "./Menu.interface";

export interface ITheme {
  name: string;
  thumbUrl: string;
  default: {
    menu: IMenu;
  };
}
