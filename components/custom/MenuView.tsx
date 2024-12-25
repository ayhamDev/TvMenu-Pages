"use client";
import React, { ReactNode, useLayoutEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import IsMobile from "is-mobile";
import { useTheme } from "next-themes";
interface MenuViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  theme: "dark" | "light";
}

const MenuView = ({ children, theme }: MenuViewProps) => {
  const { setTheme } = useTheme();
  useLayoutEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [theme]);

  return <ScrollArea className="h-screen">{children}</ScrollArea>;
};

export default MenuView;
