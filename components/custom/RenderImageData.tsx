import { toast } from "@/hooks/use-toast";
import { IMedia } from "@/interface/Media.interface";
import { TruncateString } from "@/lib/TruncateString";
import { MediaApi } from "@/utils/api/media";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const RenderImageData = ({
  imageId,
  onRemove,
}: {
  imageId: string | undefined | null;
  onRemove: () => void;
}) => {
  const params = useParams<{ domain: string }>();
  const QueryKey = [params.domain, "media", imageId];
  const { data, isLoading, error } = useQuery<IMedia>({
    queryKey: QueryKey,
    queryFn: () => MediaApi.FindOne(imageId || ""),
    enabled: !!imageId,
  });
  useEffect(() => {
    if (error instanceof AxiosError) {
      onRemove();
      if (error && !error?.response) {
        toast({
          duration: 5000,
          variant: "destructive",
          title: "✘ Failed To Get Media.",
          description: "Server Is Under Maintenance.",
        });
      }
      if (error && error.response && error.response?.status > 401) {
        toast({
          duration: 5000,
          variant: "destructive",
          title: "✘ Failed To Get Media.",
          description: "Something Unexpected Happend Try Again Later.",
        });
      }
      if (error && error.response && error.response?.status <= 400) {
        toast({
          duration: 5000,
          variant: "destructive",
          title: "✘ Failed To Get Media.",
          description:
            error.response?.data?.message ||
            "Something Unexpected Happend Try Again Later.",
        });
      }
    }
  }, [error]);
  if (!data && !isLoading) return null;
  return (
    <div className="flex border-2 w-full justify-between items-center gap-5 bg-background px-4 py-2 rounded-md ">
      <span className="overflow-hidden truncate flex-1 list-item">
        {isLoading ? (
          <Skeleton className="w-full h-full list-item" />
        ) : (
          TruncateString(data?.title, 20)
        )}
      </span>
      <Button
        onClick={() => onRemove()}
        type="button"
        size={"icon"}
        className="w-[24px] h-[24px] rounded-full"
        variant={"secondary"}
      >
        <X />
      </Button>
    </div>
  );
};
export default RenderImageData;
