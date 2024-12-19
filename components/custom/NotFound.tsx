import React from "react";
import SidebarItem from "./SidebarItem";

const NotFound = ({
  type = "menu",
}: {
  type: "menu" | "category" | "menu item" | "media";
}) => {
  return (
    <SidebarItem>
      <p className="text-muted-foreground">
        {type == "media"
          ? `Nothing here yet! Upload your first ${type} to get started.`
          : `Nothing here yet! Create your first ${type} to get started.`}
      </p>
    </SidebarItem>
  );
};

export default NotFound;
