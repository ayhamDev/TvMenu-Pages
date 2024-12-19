import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const DisplayState = ({
  isLoading,
  visible,
  target,
}: {
  isLoading: boolean;
  visible: boolean;
  target: "menu" | "category" | "menu item";
}) => {
  return (
    <div className="flex gap-3 items-center">
      {isLoading ? (
        <Skeleton className="w-[30px] h-[30px] rounded-full" />
      ) : visible ? (
        <Eye className={"text-green-300"} />
      ) : (
        <EyeOff className={"text-red-500"} />
      )}

      <div className={cn(isLoading && "flex flex-col gap-2")}>
        {isLoading ? (
          <Skeleton className="w-[60px] h-[20px]" />
        ) : (
          <h1>{visible ? "Public" : "Private"}</h1>
        )}
        {isLoading ? (
          <Skeleton className="w-[120px] h-[16px]" />
        ) : (
          <p className="text-muted-foreground text-xs">
            Your {target} will {visible ? " be visible" : " not be visible"}
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplayState;
