import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const RenderImage = ({
  imageId,
  imageUrl,
}: {
  imageId: string;
  imageUrl: string;
}) => {
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
    <div className="bg-background w-full aspect-square rounded-md border flex items-center justify-center overflow-hidden relative">
      {(imageId || imageUrl) && isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {(imageId || imageUrl) && (
        <img
          src={imageSrc}
          className={`w-full aspect-square object-contain ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default RenderImage;
