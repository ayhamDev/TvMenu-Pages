"use client";
import DeleteHandler from "@/components/other/DeleteHandler";
import MediaBrowser from "@/components/other/MediaBrowser";
import SidebarContentTitle from "@/components/other/SidebarContentTitle";
import AnimatedTab from "@/components/sidebar/AnimatedTab";
import ChangesHandler from "@/components/sidebar/ChangesHandler";
import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarItem from "@/components/sidebar/SidebarItem";
import SidebarItemNavigator from "@/components/sidebar/SidebarItemNavigator";
import { Button } from "@/components/ui/button";
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
import { IMenu } from "@/interface/Menu.interface";
import { MenuApi } from "@/utils/api/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Delete, Eye, EyeOff, X } from "lucide-react";
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
    .max(600, {
      message: "ImageUrl must contain at most 600 character(s)",
    })
    .optional(),
  imageId: z.string().optional(),
  visible: z.boolean(),
});

const page = () => {
  const router = useRouter();

  const params = useParams<{ domain: string; menuId: string }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);

  const QueryKey = ["page", params.domain, "menu", params.menuId];
  const { data, error, isLoading } = useQuery<IMenu>({
    queryKey: QueryKey,
    queryFn: () => MenuApi.FindOne(params.domain, params.menuId),
    retry: 1,
  });
  const qc = useQueryClient();
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
    // if (menu.imageUrl != data.imageUrl) {
    //   UpdatedMenu.imageUrl = menu.imageUrl;
    // }
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

  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Edit Menu</SidebarContentTitle>
        <SidebarContent className="mb-16 p-0">
          <div className="p-4 flex flex-col gap-4">
            <Skeleton className="h-[315px]" />
            <Skeleton className="h-[75px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
          </div>
        </SidebarContent>
      </>
    );

  return (
    <>
      <SidebarContentTitle>Edit Menu</SidebarContentTitle>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(SaveChangesHandler)}>
          <SidebarContent className="mb-16 p-0 ">
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

                <div className="flex justify-between items-center gap-4">
                  <div className="bg-background min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-md border flex items-center justify-center overflow-hidden">
                    <img src="/icon-128x128.png" />
                  </div>
                  {form.getValues("imageId") ? (
                    <div className="flex justify-between items-center max-w-[240px] w-full bg-background px-4 py-2 rounded-md ">
                      <span className="max-w-[70%] overflow-hidden truncate">
                        Burgers.fwefewfewfwefewfwefwefw
                      </span>
                      <Button
                        type="button"
                        size={"icon"}
                        className="w-[24px] h-[24px] rounded-full"
                        variant={"secondary"}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="Image Url..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <MediaBrowser type="image" form={form} />
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
              <SidebarItemNavigator
                title="Categories"
                href={`/edit/menu/${params.menuId}/category`}
              />
              <DeleteHandler
                target="Menu"
                targetTitle={data?.title || ""}
                id={data?.id || ""}
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
