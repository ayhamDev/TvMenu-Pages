import React from "react";
import AnimatedTab from "./AnimatedTab";
import SidebarContent from "./SidebarContent";
import SidebarItem from "./SidebarItem";

const MenuTab = () => {
  return (
    <>
      <SidebarContent>
        <SidebarItem></SidebarItem>
      </SidebarContent>
    </>
  );
};

export default AnimatedTab(MenuTab);
