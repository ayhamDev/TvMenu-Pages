"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const EditorPreview = () => {
  const IsMobile = useIsMobile();
  const [isMobileView, setIsMobileView] = useState(false);
  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "h-full w-full border-2 max-w-[100vw] max-h-[100vh] bg-background mx-auto my-auto duration-500 shadow-lg overflow-hidden relative",
        isMobileView
          ? "w-[375px] h-[665px] max-h-[80vh] rounded-md"
          : "w-full h-full"
      )}
    >
      {!IsMobile && (
        <Button
          onClick={toggleView}
          variant={"outline"}
          className="absolute top-4 right-4 z-10 shadow-lg rounded-full"
          size={"icon"}
          title="Toggle View"
        >
          {isMobileView ? <Monitor /> : <Smartphone />}
        </Button>
      )}
    </div>
  );
};

export default EditorPreview;
