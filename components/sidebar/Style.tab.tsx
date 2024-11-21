import React, { useEffect, useState } from "react";
import AnimatedTab from "./AnimatedTab";
import SidebarContent from "./SidebarContent";
import { cn } from "@/lib/utils";
import ChangesHandler from "./ChangesHandler";

const StyleTab = () => {
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [SiteVisable, SetSiteVisable] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      SetShowChangeActions(true);
    }, 1000);
  }, []);
  return (
    <>
      <SidebarContent
        className={cn(ShowChangeActions ? "pb-20" : "mb-0")}
      ></SidebarContent>
      <ChangesHandler
        ShowChangeActions={ShowChangeActions}
        SetShowChangeActions={SetShowChangeActions}
      />
    </>
  );
};

export default AnimatedTab(StyleTab);
