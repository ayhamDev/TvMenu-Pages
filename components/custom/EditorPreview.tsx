"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { usePreview } from "@/providers/PreviewProvider";
import { Monitor, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { RestaurantPageSkeleton } from "@/app/[domain]/preview/page";

const EditorPreview = () => {
  const IsMobile = useIsMobile();
  const router = useRouter();
  const { iframeRef } = usePreview();
  const [isMobileView, setIsMobileView] = useState(false);
  const [PreviewLoading, setPreviewLoading] = useState(true);
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

      {PreviewLoading && <RestaurantPageSkeleton />}
      <iframe
        ref={iframeRef}
        src="/preview"
        onLoad={() => {
          setPreviewLoading(false);
        }}
        className={cn(
          "w-full h-full border-none outline-none",
          PreviewLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </ScrollArea>
  );
};

export default EditorPreview;
