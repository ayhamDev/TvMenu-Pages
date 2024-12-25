import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useInView from "@/hooks/useInView";
import { IMedia } from "@/interface/Media.interface";
import { ValidateFile } from "@/lib/ValidateFile";
import { MediaApi } from "@/utils/api/media";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CloudUpload,
  Image,
  Loader2,
  Upload,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import { SearchInput } from "../ui/SearchInpu";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import NotFound from "./NotFound";
import usePage from "@/hooks/usePage";
import { parseAsBoolean, useQueryState } from "nuqs";

const UploadMediaSchema = z.object({
  title: z.string().max(60, {
    message: "Keyword must contain at most 60 character(s)",
  }),
  file: z
    .custom<File>((value) => value && value instanceof File, {
      message: "File is required",
    })
    .refine((files) => files?.size <= 2 * 1024 * 1024, {
      // Max size: 5MB
      message: "File size must be less than or equal to 2MB",
    }),
});

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
export const VIDEO_TYPES = ["video/webm", "video/mp4"];

export const FILE_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

const RenderPrevew = ({ file }: { file: File }) => {
  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    if (!(file instanceof File)) {
      console.warn("Invalid file type provided");
      setBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string); // Set the Base64 string
    };
    reader.onerror = () => {
      console.error("File reading error");
      setBase64(null);
    };

    reader.readAsDataURL(file); // Converts the file to Base64
  }, [file]);

  if (!file || !base64) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <CloudUpload size={"32px"} className="text-muted-foreground" />
        <p className="text-muted-foreground text-center">
          Drag & Drop Your Media Here or Click to Upload
        </p>
      </div>
    );
  }

  return <img className="w-full h-full object-contain" src={base64} />;
};

const MediaBrowser = ({
  onChange,
  type,
}: {
  onChange: (imageId: string) => void;
  type: "image" | "video";
}) => {
  const params = useParams<{ domain: string }>();
  const { admin } = useAuth();
  const PageData = usePage(params.domain);
  const FileRef = useRef<HTMLInputElement | null>(null);
  const [BrowserOpen, SetBrowserOpen] = useQueryState<boolean>(
    "mediaBrowser",
    parseAsBoolean.withDefault(false)
  );
  const [OpenUpload, SetOpenUpload] = useState<boolean>(false);
  const [Uploading, SetUploading] = useState<boolean>(false);
  const [CurrentTab, SetCurrentTab] = useState<"client" | "menuone">("client");
  const [page] = useState<number>(1);
  const [Search, SetSearch] = useState<string>("");
  const [SearchValue] = useDebounce(Search, 1000);
  const [LastViewRef, InView] = useInView({
    threshold: 0.5,
  });
  const [SelectedImageId, SetImageId] = useState<string | undefined>(undefined);

  const UploadForm = useForm<z.infer<typeof UploadMediaSchema>>({
    resolver: zodResolver(UploadMediaSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });
  const qc = useQueryClient();

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
      MediaApi.Get(
        type,
        SearchValue,
        CurrentTab == "client" ? false : true,
        CurrentTab == "client" ? PageData?.clientId || null : null,
        pageParam as number
      ),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    enabled: BrowserOpen,
    retry: 2,
  });

  const handleFileUpload = async (data: z.infer<typeof UploadMediaSchema>) => {
    SetUploading(true);
    const [res, error] = await MediaApi.Upload(
      data.title,
      data.file,
      CurrentTab == "client" ? PageData?.clientId || null : null
    );
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Upload.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Upload.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Upload.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }
    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Media Uploaded Successfully.",
        description: "Your Media Was Uploaded Successfully.",
      });
      ResetForm();
      qc.invalidateQueries(QueryKey);
    }
    SetUploading(false);
    SetOpenUpload(false);
  };
  const HandleFileDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const newFile = e.dataTransfer.files[0];

    if (newFile && newFile instanceof File) {
      const results = ValidateFile(newFile, type);
      if (results == "type")
        return toast({
          duration: 5000,
          variant: "destructive",
          title: "✘ File Type Is Not Supported.",
          description:
            "The File Type Provided Is Not Supported Make Sure You Use The Correct Formats.",
        });
      if (results == "size")
        return toast({
          duration: 5000,
          variant: "destructive",
          title: "✘ The File Is Too big.",
          description:
            "The File Must Not Exceed 2MB For Images, 24MB For Videos.",
        });
      UploadForm.setValue("file", newFile);
    }
  };
  const ResetForm = () => {
    UploadForm.reset({
      title: "",
      file: undefined,
    });
    SetImageId(undefined);
  };

  useEffect(() => {
    if (InView) {
      fetchNextPage();
    }
  }, [InView]);

  return (
    <Dialog
      onOpenChange={(value) => {
        SetBrowserOpen(value);

        if (value == false) {
          ResetForm();
        }
      }}
      open={BrowserOpen}
    >
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
              <Form {...UploadForm}>
                <Dialog
                  onOpenChange={(value) => {
                    if (Uploading) return null;
                    SetOpenUpload(value);
                  }}
                  open={OpenUpload}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => SetOpenUpload(true)}
                    >
                      <Upload />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form
                      onSubmit={(e) => {
                        e.stopPropagation();
                        UploadForm.handleSubmit(handleFileUpload)(e);
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Upload
                        </DialogTitle>
                        <DialogDescription>
                          Enter Keywords And Upload Your Media Below
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-4 flex flex-col gap-5">
                        <FormField
                          control={UploadForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Keywords</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Burger, cheese, pasta..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={UploadForm.control}
                          name="file"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div
                                  onDrop={HandleFileDrop}
                                  onDragOver={(e) => e.preventDefault()}
                                  className="max-h-[400px] h-[400px] overflow-hidden border-4 border-dashed rounded-md grid items-center cursor-pointer relative group"
                                  onClick={() => FileRef.current?.click()}
                                >
                                  <div className="absolute inset-0 bg-offbackground group-hover:opacity-60 group-drop opacity-0 transition-all duration-200" />
                                  <RenderPrevew file={field.value} />

                                  <Input
                                    ref={FileRef}
                                    className="hidden"
                                    type="file"
                                    multiple={false}
                                    onChange={(e) => {
                                      const files = e?.currentTarget?.files;
                                      if (!files || files.length == 0)
                                        return null;
                                      UploadForm.setValue("file", files[0]);
                                    }}
                                    accept={`${
                                      type == "video"
                                        ? VIDEO_TYPES.join(",")
                                        : IMAGE_TYPES.join(",")
                                    }`}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant={"secondary"}
                          onClick={() => {
                            SetOpenUpload(false);
                            ResetForm();
                          }}
                          disabled={Uploading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={Uploading}>
                          {Uploading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Upload"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </Form>
            </div>
          </div>
        </DialogHeader>
        {!data && !isLoading && !isFetching && <NotFound type="media" />}
        <ScrollArea className="h-[50vh]">
          <RadioGroup
            value={SelectedImageId || undefined}
            onValueChange={(value) => SetImageId(value)}
          >
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                300: 1,
                400: 2,
              }}
            >
              <Masonry gutter="15px">
                {data?.pages?.flat()?.map((media) => (
                  <div
                    key={media.id}
                    className="rounded-sm h-auto w-full relative"
                  >
                    <RadioGroupItem
                      value={media.id}
                      id={media.id}
                      className="peer sr-only"
                    />
                    <CheckCircle2 className="peer-data-[state=checked]:opacity-100 opacity-0 duration-150 absolute top-[-6px] right-[-6px] bg-background rounded-full" />
                    <Label
                      htmlFor={media.id}
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <img
                        className="w-full"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/media/${media.id}/file`}
                      />
                    </Label>
                  </div>
                ))}

                {isLoading || isFetching
                  ? [200, 100, 150, 220, 140, 160, 120, 70, 90, 180].map(
                      (height, index) => (
                        <Skeleton
                          key={index}
                          style={{
                            height: height,
                          }}
                          className={`w-full`}
                        />
                      )
                    )
                  : null}
              </Masonry>
            </ResponsiveMasonry>
          </RadioGroup>
          {data &&
            data.pages[data.pages.length - 1].length >= 10 &&
            !isLoading &&
            !isFetching && (
              <div
                ref={LastViewRef}
                className="h-[120px] grid place-items-center"
              >
                {InView && <Loader2 className="animate-spin" />}
              </div>
            )}
        </ScrollArea>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => {
              SetBrowserOpen(false);
              ResetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!SelectedImageId}
            onClick={() => {
              if (!SelectedImageId) return null;
              onChange(SelectedImageId);
              SetBrowserOpen(false);
              ResetForm();
            }}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaBrowser;
