import { Menu } from "lucide-react";
import React from "react";
import SidebarItem from "./SidebarItem";
import RenderImage from "./RenderImage";
import { SortableDragHandle } from "./sortable";
import { IMenu } from "@/interface/Menu.interface";
import { ICategory } from "@/interface/Category.interface";
import { IMenuItem } from "@/interface/MenuItem.interface";
import { useRouter } from "next/navigation";

const MenuItem = ({
  item,
  href,
}: {
  item: IMenu | ICategory | IMenuItem;
  href: string;
}) => {
  const router = useRouter();
  return (
    <SidebarItem
      className="flex-row justify-between items-center overflow-hidden relative select-none cursor-pointer active:opacity-60 py-3"
      onClick={(e) => {
        e.stopPropagation();
        router.push(href);
      }}
    >
      {/* Use Tailwind group-hover for showing the drag handle */}
      <SortableDragHandle className="flex items-center absolute left-[-30px] h-full opacity-0 transition-all duration-200 group-hover:left-0 group-hover:opacity-100">
        <Menu className="size-4 p-4 h-full box-content" />
      </SortableDragHandle>
      <div className="flex items-center group-hover:ml-8 transition-all duration-150">
        <div className="w-[50px]">
          <RenderImage
            imageId={item.imageId || ""}
            imageUrl={item.imageUrl || ""}
          />
        </div>
        <p className="px-3 truncate w-[200px]">{item.title}</p>
      </div>
    </SidebarItem>
  );
};

export default MenuItem;
