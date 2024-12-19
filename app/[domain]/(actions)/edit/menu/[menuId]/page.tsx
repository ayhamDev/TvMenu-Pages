"use client";
import DeleteHandler from "@/components/custom/DeleteHandler";
import DisplayState from "@/components/custom/DisplayState";
import MediaBrowser from "@/components/custom/MediaBrowser";
import RenderImage from "@/components/custom/RenderImage";
import RenderImageData from "@/components/custom/RenderImageData";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import AnimatedTab from "@/components/custom/AnimatedTab";
import ChangesHandler from "@/components/custom/ChangesHandler";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarItem from "@/components/custom/SidebarItem";
import SidebarItemNavigator from "@/components/custom/SidebarItemNavigator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import useEnableQuery from "@/hooks/useEnableQuery";
import { IMenu } from "@/interface/Menu.interface";
import { cn } from "@/lib/utils";
import { MenuApi } from "@/utils/api/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import { z } from "zod";

export const EditMenuSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(3, {
      message: "Title must contain at least 3 character(s)",
    }),
  caption: z
    .string()
    .max(500, {
      message: "Caption must contain at most 500 character(s)",
    })
    .optional(),
  imageUrl: z
    .string()
    .max(500, {
      message: "ImageUrl must contain at most 500 character(s)",
    })
    .optional(),
  imageId: z
    .string()
    .max(200, {
      message: "ImageUrl must contain at most 200 character(s)",
    })
    .optional(),
  visible: z.boolean(),
});

const page = () => {
  const router = useRouter();

  const params = useParams<{ domain: string; menuId: string }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);

  const enabledQuery = useEnableQuery();
  const qc = useQueryClient();
  const QueryKey = ["page", params.domain, "menu", params.menuId];

  const { data, error, isLoading } = useQuery<IMenu>({
    queryKey: QueryKey,
    queryFn: () => MenuApi.FindOne(params.domain, params.menuId),
    retry: 1,
    enabled: enabledQuery,
  });

  const { updateBreadcrumbs } = useBreadcrumbs([
    {
      href: "/edit/menu",
      label: "Menu",
    },
    {
      href: "#",
      label: "",
      isLoading: true,
    },
  ]);
  const form = useForm<z.infer<typeof EditMenuSchema>>({
    resolver: zodResolver(EditMenuSchema),
    defaultValues: {
      title: "",
      caption: "",
      imageUrl: "",
      imageId: "",
      visible: true,
    },
  });
  const visible = form.watch("visible");
  useLayoutEffect(() => {
    const menus =
      qc.getQueryData<IMenu[]>(["page", params.domain, "menu"]) || [];
    if (menus.length != 0) {
      const menu = menus.find((menu) => menu.id == params.menuId);
      if (!menu) return;
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: "#",
          label: menu.title,
        },
      ]);
    }
  }, []);
  useEffect(() => {
    if (data) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: "#",
          label: data.title,
        },
      ]);
    }
  }, [data]);
  const detectChanges = () => {
    if (!data) return false;
    const currentValues = form.getValues();
    return (
      currentValues.title !== data.title ||
      currentValues.caption !== data.caption ||
      currentValues.imageUrl !== data.imageUrl ||
      currentValues.imageId !== data.imageId ||
      currentValues.visible !== data.visible
    );
  };

  // Monitor changes
  useEffect(() => {
    SetShowChangeActions(detectChanges());
  }, [form.watch(), data]);

  useEffect(() => {
    if (data) {
      form.setValue("title", data.title);
      if (!data.caption) {
        data.caption = "";
      }
      form.setValue("caption", data.caption);
      if (!data.imageUrl) {
        data.imageUrl = "";
      }
      form.setValue("imageUrl", data.imageUrl);
      form.setValue("caption", data.caption);
      if (!data.imageId) {
        data.imageId = "";
      }
      form.setValue("imageId", data.imageId);

      form.setValue("visible", data.visible);
    }
  }, [data]);

  const CancelChangesHandler = () => {
    // Reset the form values to the default or fetched data
    if (data) {
      form.reset({
        title: data.title,
        caption: data.caption || "",
        imageUrl: data.imageUrl || "",
        imageId: data.imageId || "",
        visible: data.visible,
      });
    } else {
      form.reset(); // Reset to the default initial state if `data` is unavailable
    }
    SetIsSaving(false);
    SetShowChangeActions(false);
  };
  const SaveChangesHandler = async (menu: z.infer<typeof EditMenuSchema>) => {
    SetIsSaving(true);
    if (!data) return null;
    const UpdatedMenu: DeepPartial<IMenu> = {};
    if (menu.title != data.title) {
      UpdatedMenu.title = menu.title;
    }
    if (menu.caption != data.caption) {
      UpdatedMenu.caption = menu.caption;
    }
    if (menu.imageUrl != data.imageUrl) {
      UpdatedMenu.imageUrl = menu.imageUrl == undefined ? null : menu.imageUrl;
    }
    if (menu.imageId != data.imageId) {
      UpdatedMenu.imageId = menu.imageId == undefined ? null : menu.imageId;
    }
    if (menu.visible != data.visible) {
      UpdatedMenu.visible = menu.visible;
    }

    const [res, error] = await MenuApi.Update(params.domain, params.menuId, {
      ...UpdatedMenu,
    });
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }
    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Changes Saved Successfully.",
        description: "Your Changes Were Saved Successfully.",
      });
      const prevQueryKey = QueryKey.slice(0, QueryKey.length - 1);
      qc.invalidateQueries(prevQueryKey);
      qc.invalidateQueries(QueryKey);
      SetShowChangeActions(false);
    }
    SetIsSaving(false);
  };
  useEffect(() => {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response?.status >= 400
    ) {
      router.replace("/edit/menu");
    }
  }, [error]);

  return (
    <>
      <SidebarContentTitle>Edit Menu</SidebarContentTitle>

      <Form {...form}>
        <form
          className="flex-1 flex flex-col overflow-hidden relative"
          onSubmit={form.handleSubmit(SaveChangesHandler)}
        >
          <SidebarContent className={cn("p-0", "mb-[70px]")}>
            <div className="p-4 flex flex-col gap-4 relative">
              <SidebarItem>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menu Title</FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-[40px]" />
                          ) : (
                            <Input placeholder="e.g. breakfast" {...field} />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Menu Caption{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-[80px]" />
                          ) : (
                            <Textarea placeholder="e.g. breakfast" {...field} />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Label htmlFor="favicon">
                  Image{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>

                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    <Skeleton className="w-full aspect-square" />
                  ) : (
                    <RenderImage
                      imageId={form.getValues("imageId") || ""}
                      imageUrl={form.getValues("imageUrl") || ""}
                    />
                  )}

                  {form.getValues("imageId") ? (
                    <RenderImageData
                      onRemove={() => form.setValue("imageId", undefined)}
                      imageId={form.getValues("imageId")}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            {isLoading ? (
                              <Skeleton className="w-full h-[40px]" />
                            ) : (
                              <Input
                                className="w-full"
                                placeholder="Image Url..."
                                {...field}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                {isLoading ? (
                  <Skeleton className="w-full h-[40px]" />
                ) : (
                  <MediaBrowser
                    type="image"
                    onChange={(imageId) => form.setValue("imageId", imageId)}
                  />
                )}
              </SidebarItem>
              <SidebarItem>
                <div className="flex items-center justify-between ">
                  <DisplayState
                    isLoading={isLoading}
                    visible={visible}
                    target="menu"
                  />

                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-[44px] h-[24px] rounded-full" />
                          ) : (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SidebarItem>
              <SidebarItemNavigator
                title="Categories"
                href={`/edit/menu/${params.menuId}/category`}
              />
            </div>
          </SidebarContent>
          {isLoading ? (
            <footer className="w-full px-4 py-4 bg-background border-t-2 flex gap-4 absolute bottom-0 z-20">
              <Skeleton className="w-full h-[40px]" />
            </footer>
          ) : (
            <DeleteHandler
              target="Menu"
              targetTitle={data?.title || ""}
              id={data?.id || ""}
              queryKey={QueryKey}
            />
          )}
          <ChangesHandler
            ShowChangeActions={ShowChangeActions}
            IsSaving={IsSaving}
            onCancel={CancelChangesHandler}
          />
        </form>
      </Form>
    </>
  );
};

export default AnimatedTab(page);
