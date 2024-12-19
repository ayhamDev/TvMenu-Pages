"use client";

import { IMenu } from "@/interface/Menu.interface";
import { default as MenuView } from "./components/Menu";

export default function MenuBoard({ Menu }: { Menu: IMenu[] }) {
  if (!Menu) return null;
  return Menu?.map((menu) => <MenuView key={menu.id} menu={menu} />);
}
