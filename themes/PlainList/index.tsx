import MenuView from "@/components/custom/MenuView";
import { IMenu } from "@/interface/Menu.interface";
import { MenuList } from "./components/menu-list";

export default function MenuPage({ menu }: { menu: IMenu[] }) {
  return (
    <MenuView className="bg-background" theme="light">
      <MenuList menus={menu} />
    </MenuView>
  );
}
