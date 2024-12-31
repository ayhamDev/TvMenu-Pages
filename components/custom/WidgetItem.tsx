import React, { ReactNode, useMemo } from "react";
import SidebarItem from "./SidebarItem";
import { CodeXml, LucideIcon, PhoneCall } from "lucide-react";
import { IWidgetItem, WidgetTypes } from "@/interface/Widget.interface";
import { WidgetIcon } from "./WidgetIcon";

const WidgetItem = ({ type }: IWidgetItem) => {
  return (
    <SidebarItem className="flex-row justify-between items-center overflow-hidden relative select-none cursor-pointer active:opacity-60 py-4">
      <div className="flex items-center transition-all duration-150 gap-2">
        <WidgetIcon type={type} />
        <p className="px-3 truncate w-[200px]">Custom Code</p>
      </div>
    </SidebarItem>
  );
};

export default WidgetItem;
