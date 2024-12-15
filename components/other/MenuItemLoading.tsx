import React from "react";
import { Skeleton } from "../ui/skeleton";

const MenuItemLoading = () => {
  return (
    <Skeleton className="p-4 py-3 w-full flex items-center gap-2 border-white border-muted">
      <Skeleton className="w-[50px] h-[50px] rounded-md bg-background" />
      <Skeleton className="w-[170px] h-[25px] bg-background" />
    </Skeleton>
  );
};

export default MenuItemLoading;
