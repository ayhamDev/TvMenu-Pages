import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const SidebarContent = ({ className, children, ...props }: ScrollAreaProps) => {
  return (
    <ScrollArea
      className={cn(
        "h-full w-full justify-between relative transition-all duration-200 p-4",
        className
      )}
      {...props}
    >
      {children}
    </ScrollArea>
  );
};

export default SidebarContent;
