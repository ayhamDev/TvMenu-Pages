"use client";
import NotFound from "@/components/other/NotFound";
import SidebarContentTitle from "@/components/other/SidebarContentTitle";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/other/sortable";
import AnimatedTab from "@/components/sidebar/AnimatedTab";
import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { ICategory } from "@/interface/Category,interface";
import { IMenu } from "@/interface/Menu.interface";
import { CategoryApi } from "@/utils/api/category";
import { MenuItemApi } from "@/utils/api/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Menu, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CreateItemSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(3, {
      message: "Title must contain at least 3 character(s)",
    }),
});

const page = () => {
  const router = useRouter();
  const params = useParams<{
    domain: string;
    menuId: string;
    categoryId: string;
  }>();
  const searchParams = useSearchParams();
  const [IsCreating, SetIsCreating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const qc = useQueryClient();

  const QueryKey = [
    "page",
    params.domain,
    "menu",
    params.menuId,
    "category",
    params.categoryId,
    "item",
  ];
  const { data, error, isLoading } = useQuery<ICategory>({
    queryKey: QueryKey,
    queryFn: () =>
      CategoryApi.FindOne(params.domain, params.categoryId, ["item", "menu"]),
    retry: 1,
  });

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
      href: "#",
      label: "Items",
    },
  ]);
  const form = useForm({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      title: "",
    },
  });

  useLayoutEffect(() => {
    const category = qc.getQueryData<ICategory | undefined>([
      "page",
      params.domain,
      "menu",
      params.menuId,
      "category",
      params.categoryId,
    ]);
    if (category) {
      updateBreadcrumbs([
        {
          href: "/edit/menu",
          label: "Menu",
        },
        {
          href: `/edit/menu/${category.menuId}`,
          label: category?.menu?.title,
        },
        {
          href: `/edit/menu/${category.menuId}/category`,
          label: "Categories",
        },
        {
          href: `/edit/menu/${params.menuId}/category/${category.id}`,
          label: category?.title,
        },
        {
          href: "#",
          label: "Items",
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
          href: `/edit/menu/${data.menuId}`,
          label: data?.menu?.title,
        },
        {
          href: `/edit/menu/${data.menuId}/category`,
          label: "Categories",
        },
        {
          href: `/edit/menu/${params.menuId}/category/${data.id}`,
          label: data?.title,
        },
        {
          href: "#",
          label: "Items",
        },
      ]);
    }
  }, [data]);
  const CreateMenuItemHandler = async (
    data: z.infer<typeof CreateItemSchema>
  ) => {
    SetIsCreating(true);
    const [res, error] = await MenuItemApi.Create(
      params.domain,
      params.categoryId,
      {
        title: data.title,
      }
    );
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu Item.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu Item.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu Item.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }

    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Menu Item Created Successfully.",
        description: "Your Menu Item Was Create Successfully.",
      });
      qc.invalidateQueries(QueryKey);
      if (res.data?.data?.id) {
        router.push(
          `/edit/menu/${params.menuId}/category/${res.data.data.categoryId}/item/${res.data.data.id}`
        );
      }
    }
    SetIsCreating(false);
    setIsDialogOpen(false);
  };
  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Menu Items</SidebarContentTitle>
        <SidebarContent className="mb-16">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
          </div>
        </SidebarContent>
        <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
          <Skeleton className="h-[40px] w-full" />
        </footer>
      </>
    );
  const MenuItems = data?.item || [];

  return (
    <>
      <SidebarContentTitle>Menu Items</SidebarContentTitle>
      <SidebarContent className="mb-16">
        {MenuItems.length == 0 && <NotFound type="menu item" />}
        <Sortable value={MenuItems || []} id="menu">
          <div className="flex flex-col gap-4">
            {MenuItems &&
              MenuItems.map((item, index) => (
                <SortableItem key={item.id} value={item.id} className="group">
                  <SidebarItem
                    className="flex-row justify-between items-center overflow-hidden relative select-none cursor-pointer active:opacity-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/edit/menu/${item.menuId}/category/${item.categoryId}/item/${item.id}`
                      );
                    }}
                  >
                    {/* Use Tailwind group-hover for showing the drag handle */}
                    <SortableDragHandle className="flex items-center absolute left-[-30px] h-full opacity-0 transition-all duration-200 group-hover:left-0 group-hover:opacity-100">
                      <Menu className="size-4 p-4 h-full box-content" />
                    </SortableDragHandle>
                    <div className="flex items-center group-hover:ml-6 transition-all duration-150">
                      <p className="px-3">{item.title}</p>
                    </div>
                  </SidebarItem>
                </SortableItem>
              ))}
          </div>
        </Sortable>
      </SidebarContent>

      <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
        <Form {...form}>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!IsCreating) {
                setIsDialogOpen(open);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(CreateMenuItemHandler)}
              >
                <DialogHeader>
                  <DialogTitle>Create Item</DialogTitle>
                  <DialogDescription>
                    Individual dishes with details like name, description, and
                    price.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-4 items-center">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g.  Garlic Bread"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={IsCreating}>
                    {IsCreating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Plus />
                    )}

                    {IsCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Form>
      </footer>
    </>
  );
};

export default AnimatedTab(page);
