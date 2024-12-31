import MenuView from "@/components/custom/MenuView";
import { IMenu } from "@/interface/Menu.interface";
import { MenuList } from "./components/menu-list";
import { PreviewProvider, usePreview } from "@/providers/PreviewProvider";
import { useEffect, useLayoutEffect } from "react";
import { ThemeToggle } from "@/components/custom/theme-toggle";

export default function MenuPage({ menu }: { menu: IMenu[] }) {
  const { sendMessage } = usePreview();
  useEffect(() => {
    sendMessage({
      type: "load",
      target: "preview",
    });
  }, []);
  return (
    <PreviewProvider>
      <MenuView className="bg-background" theme="light">
        <div className="top-5 right-5 fixed rounded-full z-20">
          <ThemeToggle />
        </div>
        <MenuList menus={menu} />
      </MenuView>
    </PreviewProvider>
  );
}
