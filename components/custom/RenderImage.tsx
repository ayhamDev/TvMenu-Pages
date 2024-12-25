import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface RenderImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId: string;
  imageUrl: string;
  cover?: boolean;
}

const RenderImage = ({
  imageId,
  imageUrl,
  cover = false,
  className,
  ...props
}: RenderImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false); // Optional: Stop showing skeleton if the image fails to load
  };

  const imageSrc = useMemo(
    () =>
      imageId
        ? `${process.env.NEXT_PUBLIC_API_URL}/media/${imageId}/file`
        : imageUrl,
    [imageUrl, imageId]
  );

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden relative",
        className
      )}
    >
      {(imageId || imageUrl) && isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full z-[5]" />
      )}
      {(imageId || imageUrl) && (
        <LazyLoadImage
          src={imageSrc}
          effect="opacity"
          threshold={90}
          width={"100%"}
          height={"100%"}
          className={cn(
            `w-full h-full object-contain ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-1000`,
            cover && "object-cover"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
    </div>
  );
};

export default RenderImage;
