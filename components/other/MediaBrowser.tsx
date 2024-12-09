import { EditMenuSchema } from "@/app/[domain]/(actions)/edit/menu/[menuId]/page";
import useAuth from "@/hooks/useAuth";
import useInView from "@/hooks/useInView";
import { IMedia } from "@/interface/Media.interface";
import { MediaApi } from "@/utils/api/media";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image, Loader2, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { SearchInput } from "../ui/SearchInpu";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import NotFound from "./NotFound";
const MediaBrowser = ({
  form,
  type,
}: {
  form: UseFormReturn<z.infer<typeof EditMenuSchema>>;
  type: "image" | "video";
}) => {
  const params = useParams<{ domain: string }>();
  const { admin, client } = useAuth();
  const FileRef = useRef<HTMLInputElement | null>(null);
  const [BrowserOpen, SetBrowserOpen] = useState<boolean>(false);
  const [Uploading, SetUploading] = useState<boolean>(false);
  const [CurrentTab, SetCurrentTab] = useState<"client" | "menuone">("client");
  const [page] = useState<number>(1);
  const [Search, SetSearch] = useState<string>("");
  const [SearchValue] = useDebounce(Search, 1000);
  const [LastViewRef, InView] = useInView({
    threshold: 1,
    rootMargin: "200px",
  });

  const QueryKey = useMemo(() => {
    return [
      params.domain,
      "media",
      { type, tab: CurrentTab, page, SearchValue },
    ];
  }, [type, CurrentTab, page, SearchValue]);
  const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery<
    IMedia[]
  >({
    queryKey: QueryKey,
    queryFn: ({ pageParam = 1 }) =>
      MediaApi.GetMedia(
        type,
        CurrentTab == "client" ? false : true,
        null,
        pageParam as number
      ),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    enabled: BrowserOpen,
  });

  const HandleFileUpload = () => {
    SetUploading(true);
  };
  useEffect(() => {
    console.log(InView);
  }, [InView]);
  // useEffect(() => {
  //   qc.setQueryData(QueryKey, null);
  //   if (!isFetching) {
  //     refetch();
  //   }
  // }, [SearchValue, CurrentTab]);

  return (
    <Dialog onOpenChange={(value) => SetBrowserOpen(value)} open={BrowserOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"secondary"}>
          <Image />
          Choose {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5">Media Browser</DialogTitle>
          <div className="flex flex-col gap-4">
            <Tabs
              className="w-full"
              onValueChange={(value) => {
                SetCurrentTab(value as "client" | "menuone");
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="client" className="w-full">
                  {admin.accessToken ? "Client" : "My Uploads"}
                </TabsTrigger>
                <TabsTrigger value="menuone" className="w-full">
                  Menuone
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="w-full flex items-center gap-4">
              <SearchInput
                className="w-full"
                placeholder="Search Keywords..."
                onChange={(e) => SetSearch(e.target.value)}
                value={Search}
              />
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  FileRef.current?.click();
                }}
                disabled={Uploading}
              >
                {Uploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload />
                    Upload
                  </>
                )}
              </Button>
              <Input
                ref={FileRef}
                onChange={HandleFileUpload}
                className="hidden"
                type="file"
                id="image"
                multiple={false}
                accept="image/png, image/jpeg, image/x-icon"
              />
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          {!data && !isLoading && !isFetching && <NotFound type="media" />}
          <ScrollArea className="h-[50vh]">
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                300: 1,
                500: 2,
              }}
            >
              <Masonry gutter="12px">
                {data?.pages?.flat()?.map((media) => (
                  <div
                    key={media.id}
                    className="rounded-sm overflow-hidden h-auto w-full"
                  >
                    <img
                      className=" w-full"
                      src={`${process.env.NEXT_PUBLIC_API_URL}/media/${media.id}/file`}
                    />
                  </div>
                ))}
                {isLoading || isFetching
                  ? [200, 100, 150, 140, 146, 60].map((height, index) => (
                      <Skeleton
                        key={index}
                        style={{
                          height: height,
                        }}
                        className={`w-full`}
                      />
                    ))
                  : null}
              </Masonry>
            </ResponsiveMasonry>
            {!data && !isLoading && (
              <div
                ref={LastViewRef}
                className="h-[100px] grid place-items-center"
              >
                {InView && <Loader2 className="animate-spin" />}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant={"secondary"}>Cancel</Button>
          <Button>Choose</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaBrowser;
