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
import useCategory from "@/hooks/useCategory";
import useEnableQuery from "@/hooks/useEnableQuery";
import useMenu from "@/hooks/useMenu";
import { ICategory } from "@/interface/Category.interface";
import { IMenu } from "@/interface/Menu.interface";
import { IMenuItem } from "@/interface/MenuItem.interface";
import { cn } from "@/lib/utils";
import { CategoryApi } from "@/utils/api/category";
import { MenuItemApi } from "@/utils/api/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import { z } from "zod";
import { usePreview } from "@/providers/PreviewProvider";

export const EditMenuItemSchema = z.object({
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
  price: z
    .string()
    .max(200, {
      message: "Price must contain at most 200 character(s)",
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

  const params = useParams<{
    domain: string;
    menuId: string;
    categoryId: string;
    itemId: string;
  }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);
  const enabledQuery = useEnableQuery();
  const { sendMessageToPreview } = usePreview();
  const QueryKey = [
    "page",
    params.domain,
    "menu",
    params.menuId,
    "category",
    params.categoryId,
    "item",
    params.itemId,
  ];
  const Menu = useMenu(params.domain, params.menuId);
  const Category = useCategory(params.domain, params.menuId, params.categoryId);
  const { data, error, isLoading } = useQuery<IMenuItem>({
    queryKey: QueryKey,
    queryFn: () =>
      MenuItemApi.FindOne(params.domain, params.itemId, ["menu", "category"]),
    retry: 1,
    enabled: enabledQuery,
  });
  const qc = useQueryClient();
  const { updateBreadcrumbs } = useBreadcrumbs([
    {
      href: "/edit/menu",
      label: "Menu",
    },
    {
      href: `/edit/menu/${params.menuId}`,
      label: Menu ? Menu.title : "",
      isLoading: Menu ? false : true,
    },
    {
      href: `/edit/menu/${params.menuId}/category`,
      label: "Categories",
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}`,
      label: Category ? Category.title : "",
      isLoading: Category ? false : true,
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item`,
      label: "Items",
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item/${params.itemId}`,
      label: data ? data.title : "",
      isLoading: data ? false : true,
    },
  ]);
  const form = useForm<z.infer<typeof EditMenuItemSchema>>({
    resolver: zodResolver(EditMenuItemSchema),
    defaultValues: {
      title: "",
      caption: "",
      price: "",
      imageUrl: "",
      imageId: "",
      visible: true,
    },
  });
  const visible = form.watch("visible");

  useLayoutEffect(() => {
    updateBreadcrumbs([
      {
        href: "/edit/menu",
        label: "Menu",
      },
      {
        href: `/edit/menu/${params.menuId}`,
        label: Menu ? Menu.title : "",
        isLoading: Menu ? false : true,
      },
      {
        href: `/edit/menu/${params.menuId}/category`,
        label: "Categories",
      },
      {
        href: `/edit/menu/${params.menuId}/category/${params.categoryId}`,
        label: Category ? Category.title : "",
        isLoading: Category ? false : true,
      },
      {
        href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item`,
        label: "Items",
      },
      {
        href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item/${params.itemId}`,
        label: data ? data.title : "",
        isLoading: data ? false : true,
      },
    ]);
  }, [data, Menu, Category]);

  const detectChanges = () => {
    if (!data) return false;
    const currentValues = form.getValues();

    return (
      currentValues.title !== data.title ||
      currentValues.caption !== data.caption ||
      currentValues.price !== data.price ||
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
      if (!data.price) {
        data.price = "";
      }
      form.setValue("price", data.price);

      if (!data.imageUrl) {
        data.imageUrl = "";
      }
      form.setValue("imageUrl", data.imageUrl);

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
        price: data.price || "",
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
  const SaveChangesHandler = async (
    menuItem: z.infer<typeof EditMenuItemSchema>
  ) => {
    SetIsSaving(true);
    if (!data) return null;
    const UpdatedMenuItem: DeepPartial<IMenuItem> = {};
    if (menuItem.title != data.title) {
      UpdatedMenuItem.title = menuItem.title;
    }
    if (menuItem.caption != data.caption) {
      UpdatedMenuItem.caption = menuItem.caption;
    }
    if (menuItem.price != data.price) {
      UpdatedMenuItem.price = menuItem.price;
    }
    if (menuItem.imageUrl != data.imageUrl) {
      UpdatedMenuItem.imageUrl =
        menuItem.imageUrl == undefined ? null : menuItem.imageUrl;
    }
    if (menuItem.imageId != data.imageId) {
      UpdatedMenuItem.imageId =
        menuItem.imageId == undefined ? null : menuItem.imageId;
    }
    if (menuItem.visible != data.visible) {
      UpdatedMenuItem.visible = menuItem.visible;
    }

    const [res, error] = await MenuItemApi.Update(
      params.domain,
      params.itemId,
      {
        ...UpdatedMenuItem,
      }
    );
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
      sendMessageToPreview({
        type: "update",
        target: "item",
        id: params.itemId,
        data: res.data,
      });
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
      router.replace(
        `/edit/menu/${params.menuId}/category/${params.categoryId}/item`
      );
    }
  }, [error]);

  return (
    <>
      <SidebarContentTitle>Edit Menu Item</SidebarContentTitle>
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
                        <FormLabel>Item Title</FormLabel>
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
                          Item Caption{" "}
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

                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Item Price{" "}
                          <span className="text-muted-foreground">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-[40px]" />
                          ) : (
                            <Input placeholder="e.g. $2.99" {...field} />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Label htmlFor="favicon">
                  Item Image{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>

                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    <Skeleton className="w-full aspect-square" />
                  ) : (
                    <RenderImage
                      className="bg-background w-full aspect-square rounded-md border"
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
                    target="menu item"
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
            </div>
          </SidebarContent>
          {isLoading ? (
            <footer className="w-full px-4 py-4 bg-background border-t-2 flex gap-4 absolute bottom-0 z-20">
              <Skeleton className="w-full h-[40px]" />
            </footer>
          ) : (
            <DeleteHandler
              target="Menu Item"
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
