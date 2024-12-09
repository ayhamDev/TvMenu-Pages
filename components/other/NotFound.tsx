import React from "react";
import SidebarItem from "../sidebar/SidebarItem";

const NotFound = ({
  type = "menu",
}: {
  type: "menu" | "category" | "menu item" | "media";
}) => {
  return (
    <SidebarItem>
      <p className="text-muted-foreground">
        Nothing here yet! Create your first {type} to get started.
      </p>
    </SidebarItem>
  );
};

export default NotFound;
