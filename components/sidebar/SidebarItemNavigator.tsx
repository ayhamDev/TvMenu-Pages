import React from "react";
import SidebarItem from "./SidebarItem";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SidebarItemNavigator = ({
  href,
  title,
}: {
  href: string;
  title: string;
}) => {
  const router = useRouter();
  return (
    <SidebarItem
      className="flex-row justify-between items-center cursor-pointer active:opacity-60 overflow-hidden"
      onClick={() => router.push(href)}
    >
      <h4>{title}</h4>
      <div className="flex items-center justify-center gap-2">
        <ChevronRight className="" />
      </div>
    </SidebarItem>
  );
};

export default SidebarItemNavigator;
