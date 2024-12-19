import { cn } from "@/lib/utils";
import React from "react";

const SidebarItem = ({
  children,
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "bg-offbackground rounded-md p-4 flex flex-col gap-4 border",
        className
      )}
      {...props}
    >
      {title && (
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};

export default SidebarItem;
