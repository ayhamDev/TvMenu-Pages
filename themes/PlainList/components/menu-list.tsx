import { IMenu } from "@/interface/Menu.interface";
import AddMenu from "./AddMenu";
import { Menu } from "./menu";

interface MenuListProps {
  menus: IMenu[] | null | undefined;
}

export function MenuList({ menus }: MenuListProps) {
  if (!menus || menus.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-muted-foreground">
          No menus available.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {menus.map((menu) => (
        <Menu key={menu.id} menu={menu} />
      ))}
      <AddMenu />
    </div>
  );
}
