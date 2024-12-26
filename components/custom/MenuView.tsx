"use client";
import React, { ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";
interface MenuViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  theme: "dark" | "light";
}

const MenuView = ({ children }: MenuViewProps) => {
  return <ScrollArea className="h-screen">{children}</ScrollArea>;
};

export default MenuView;
