"use client";
import DeleteHandler from "@/components/other/DeleteHandler";
import SidebarContentTitle from "@/components/other/SidebarContentTitle";
import AnimatedTab from "@/components/sidebar/AnimatedTab";
import ChangesHandler from "@/components/sidebar/ChangesHandler";
import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarItem from "@/components/sidebar/SidebarItem";
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
import { ICategory } from "@/interface/Category,interface";
import { IMenu } from "@/interface/Menu.interface";
import { IMenuItem } from "@/interface/MenuItem.interface";
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

export const EditCategorySchema = z.object({
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
  // imageUrl: z.string().optional(),
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
  const { data, error, isLoading } = useQuery<IMenuItem>({
    queryKey: QueryKey,
    queryFn: () =>
      MenuItemApi.FindOne(params.domain, params.itemId, ["menu", "category"]),
    retry: 1,
  });
  const qc = useQueryClient();
  const { updateBreadcrumbs } = useBreadcrumbs([
    {
      href: "/edit/menu",
      label: "Menu",
    },
    {
      href: `/edit/menu/${params.menuId}`,
      label: "",
      isLoading: true,
    },
    {
      href: `/edit/menu/${params.menuId}/category`,
      label: "Categories",
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}`,
      label: "",
      isLoading: true,
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item`,
      label: "item",
    },
    {
      href: `/edit/menu/${params.menuId}/category/${params.categoryId}/item`,
      label: "",
      isLoading: true,
    },
  ]);
  const form = useForm({
    resolver: zodResolver(EditCategorySchema),
    defaultValues: {
      title: "",
      caption: "",
      price: "",
      // imageUrl: "",
      visible: true,
    },
  });
  const visible = form.watch("visible");

  useLayoutEffect(() => {
    const category = qc.getQueryData<ICategory>([
      "page",
      params.domain,
      "menu",
      params.menuId,
      "category",
      params.categoryId,
    ]);
    if (category && category.menu) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: `/edit/menu/${category.menuId}`,
          label: category.menu.title,
          isLoading: true,
        },
        {
          href: `/edit/menu/${category.menuId}/category`,
          label: "Categories",
        },
        {
          href: `/edit/menu/${category.menuId}/category/${category.id}`,
          label: category.title,
        },
        {
          href: `/edit/menu/${category.menuId}/category/${category.id}/item`,
          label: "items",
        },
        {
          href: `/edit/menu/${category.menuId}/category/${category.id}/item/${params.itemId}`,
          label: "",
          isLoading: true,
        },
      ]);
    }
  }, []);
  useEffect(() => {
    if (data && data.menu && data.category) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: `/edit/menu/${data.menuId}`,
          label: data.menu.title,
          isLoading: true,
        },
        {
          href: `/edit/menu/${data.menuId}/category`,
          label: "Categories",
        },
        {
          href: `/edit/menu/${data.menuId}/category/${data.categoryId}`,
          label: data.category.title,
        },
        {
          href: `/edit/menu/${data.menuId}/category/${data.categoryId}/item`,
          label: "items",
        },
        {
          href: `/edit/menu/${data.menuId}/category/${data.categoryId}/item/${data.id}`,
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
      // form.setValue("imageUrl", data.imageUrl);
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
        // imageUrl: data.imageUrl,
        visible: data.visible,
      });
    } else {
      form.reset(); // Reset to the default initial state if `data` is unavailable
    }
    SetIsSaving(false);
    SetShowChangeActions(false);
  };
  const SaveChangesHandler = async (
    menu: z.infer<typeof EditCategorySchema>
  ) => {
    SetIsSaving(true);
    if (!data) return null;
    const UpdatedMenu: DeepPartial<IMenuItem> = {};
    if (menu.title != data.title) {
      UpdatedMenu.title = menu.title;
    }
    if (menu.caption != data.caption) {
      UpdatedMenu.caption = menu.caption;
    }
    if (menu.price != data.price) {
      UpdatedMenu.price = menu.price;
    }
    // if (menu.imageUrl != data.imageUrl) {
    //   UpdatedMenu.imageUrl = menu.imageUrl;
    // }
    if (menu.visible != data.visible) {
      UpdatedMenu.visible = menu.visible;
    }

    const [res, error] = await MenuItemApi.Update(
      params.domain,
      params.itemId,
      {
        ...UpdatedMenu,
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
      router.replace(
        `/edit/menu/${params.menuId}/category/${params.categoryId}/item`
      );
    }
  }, [error]);

  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Edit Menu Item</SidebarContentTitle>
        <SidebarContent className="mb-16 p-0">
          <div className="p-4 flex flex-col gap-4">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[75px]" />
          </div>
        </SidebarContent>
      </>
    );

  return (
    <>
      <SidebarContentTitle>Edit Menu Item</SidebarContentTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(SaveChangesHandler)}>
          <SidebarContent className="mb-16 p-0">
            <div className="p-4 flex flex-col gap-4">
              <SidebarItem>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. breakfast" {...field} />
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
                          <Textarea placeholder="e.g. breakfast" {...field} />
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
                          <Input placeholder="e.g. $2.99" {...field} />
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

                <div className="flex justify-center items-center gap-2">
                  <Label
                    htmlFor="favicon"
                    className="bg-background min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-md border flex items-center justify-center overflow-hidden"
                  >
                    <img src="/icon-128x128.png" />
                  </Label>
                  <Input
                    type="file"
                    id="favicon"
                    accept="image/png, image/jpeg, image/x-icon"
                  />
                </div>
              </SidebarItem>
              <SidebarItem>
                <div className="flex items-center justify-between ">
                  <div className="flex gap-3 items-center">
                    {visible ? (
                      <Eye className={"text-green-300"} />
                    ) : (
                      <EyeOff className={"text-red-500"} />
                    )}

                    <div>
                      <h1>{visible ? "Visible" : "Hidden"}</h1>
                      <p className="text-muted-foreground text-xs">
                        Your menu will
                        {visible ? " be visible." : " not be visible"}
                      </p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SidebarItem>
              <DeleteHandler
                id={params.itemId}
                target="Menu Item"
                targetTitle={data?.title || ""}
                queryKey={QueryKey}
              />
            </div>
          </SidebarContent>
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
