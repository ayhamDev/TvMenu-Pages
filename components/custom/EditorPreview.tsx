"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { usePreview } from "@/providers/PreviewProvider";
import { Maximize, Monitor, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { RestaurantPageSkeleton } from "./RestaurantPageSkeleton";
const EditorPreview = () => {
  const IsMobile = useIsMobile();
  const router = useRouter();
  const { iframeRef, PreviewLoaded } = usePreview();
  const [isMobileView, setIsMobileView] = useState(false);
  const [IsFullScreen, setIsFullScreen] = useState(false);
  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  return (
    <ScrollArea
      className={cn(
        "h-full w-full border-2 max-w-[100vw] max-h-[100vh] bg-background mx-auto my-auto duration-500 shadow-lg overflow-hidden relative",
        isMobileView ? "w-[375px] max-h-[80vh] rounded-md" : "w-full h-full"
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

      <Button
        onClick={() => router.push("/preview")}
        variant={"outline"}
        className="absolute top-4 right-20 z-10 shadow-lg rounded-full"
        size={"icon"}
        title="Preview"
      >
        <Maximize />
      </Button>

      {!PreviewLoaded && <RestaurantPageSkeleton />}
      <iframe
        ref={iframeRef}
        src="/preview?edit"
        className={cn(
          "w-full h-full border-none outline-none",
          !PreviewLoaded ? "opacity-0" : "opacity-100"
        )}
      />
    </ScrollArea>
  );
};

export default EditorPreview;
