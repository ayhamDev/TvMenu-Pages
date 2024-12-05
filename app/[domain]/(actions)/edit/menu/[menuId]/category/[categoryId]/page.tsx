"use client";
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
import { CategoryApi } from "@/utils/api/category";
import { MenuApi } from "@/utils/api/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
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
    .max(60, {
      message: "Caption must contain at most 500 character(s)",
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
  ];
  const { data, error, isLoading } = useQuery<ICategory>({
    queryKey: QueryKey,
    queryFn: () =>
      CategoryApi.FindOne(params.domain, params.categoryId, ["menu"]),
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
  ]);
  const form = useForm({
    resolver: zodResolver(EditCategorySchema),
    defaultValues: {
      title: "",
      caption: "",
      // imageUrl: "",
      visible: true,
    },
  });
  const visible = form.watch("visible");

  useLayoutEffect(() => {
    const menu = qc.getQueryData<IMenu>([
      "page",
      params.domain,
      "menu",
      params.menuId,
    ]);
    if (menu) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: `/edit/menu/${params.menuId}`,
          label: menu.title,
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
      ]);
    }
  }, []);
  useEffect(() => {
    if (data?.menu) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: `/edit/menu/${params.menuId}`,
          label: data.menu.title,
        },
        {
          href: `/edit/menu/${params.menuId}/category`,
          label: "Categories",
        },
        {
          href: `/edit/menu/${params.menuId}/category/${params.categoryId}`,
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
    const UpdatedMenu: DeepPartial<IMenu> = {};
    if (menu.title != data.title) {
      UpdatedMenu.title = menu.title;
    }
    if (menu.caption != data.caption) {
      UpdatedMenu.caption = menu.caption;
    }
    // if (menu.imageUrl != data.imageUrl) {
    //   UpdatedMenu.imageUrl = menu.imageUrl;
    // }
    if (menu.visible != data.visible) {
      UpdatedMenu.visible = menu.visible;
    }

    const [res, error] = await CategoryApi.Update(
      params.domain,
      params.menuId,
      params.categoryId,
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
      router.replace(`/edit/menu/${params.menuId}/category`);
    }
  }, [error]);

  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Edit Category</SidebarContentTitle>
        <SidebarContent className="mb-16 p-0">
          <div className="p-4 flex flex-col gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[75px]" />
            <Skeleton className="h-[60px]" />
          </div>
        </SidebarContent>
      </>
    );

  return (
    <>
      <SidebarContentTitle>Edit Category</SidebarContentTitle>
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
                        <FormLabel>Menu Title</FormLabel>
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
                          Menu Caption{" "}
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

              <SidebarItem
                className="flex-row justify-between items-center cursor-pointer active:opacity-60 group overflow-hidden"
                onClick={() =>
                  router.push(
                    `/edit/menu/${params.menuId}/category/${params.categoryId}/item`
                  )
                }
              >
                <h4>Menu Items</h4>
                <div className="flex items-center justify-center gap-2">
                  <ChevronRight className="mr-[-35px] opacity-0 group-hover:mr-0 group-hover:opacity-100 duration-200" />
                </div>
              </SidebarItem>
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
