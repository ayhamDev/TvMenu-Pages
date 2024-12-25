"use client";
import MenuItemLoading from "@/components/custom/MenuItemLoading";
import NotFound from "@/components/custom/NotFound";
import RenderImage from "@/components/custom/RenderImage";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/custom/sortable";
import AnimatedTab from "@/components/custom/AnimatedTab";
import ChangesHandler from "@/components/custom/ChangesHandler";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarItem from "@/components/custom/SidebarItem";
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
import useCategory from "@/hooks/useCategory";
import useEnableQuery from "@/hooks/useEnableQuery";
import useMenu from "@/hooks/useMenu";
import { IMenuItem } from "@/interface/MenuItem.interface";
import { MenuItemApi } from "@/utils/api/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MenuIcon, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { usePreview } from "@/providers/PreviewProvider";
import MenuItem from "@/components/custom/MenuItem";
import { parseAsBoolean, useQueryState } from "nuqs";
import { CreateItemSchema } from "@/schema/CreateItemSchema";
import { ItemOrderSchema } from "@/schema/ItemOrderSchema";

const page = () => {
  const router = useRouter();
  const params = useParams<{
    domain: string;
    menuId: string;
    categoryId: string;
  }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);
  const [IsCreating, SetIsCreating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useQueryState<boolean>(
    "create",
    parseAsBoolean.withDefault(false)
  );
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
  const enabledQuery = useEnableQuery();
  const Menu = useMenu(params.domain, params.menuId);
  const Category = useCategory(params.domain, params.menuId, params.categoryId);
  const { data, error, isLoading } = useQuery<IMenuItem[]>({
    queryKey: QueryKey,
    queryFn: () => MenuItemApi.GetAll(params.domain, params.categoryId),
    retry: 1,
    enabled: enabledQuery,
  });
  const { sendMessage } = usePreview();
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
      isLoading: Menu ? false : true,
    },
    {
      href: "#",
      label: "Items",
    },
  ]);

  const OrderForm = useForm<z.infer<typeof ItemOrderSchema>>({
    resolver: zodResolver(ItemOrderSchema),
    defaultValues: {
      order: [],
    },
  });
  const { move } = useFieldArray({
    control: OrderForm.control,
    name: "order",
  });
  const OrderedList = OrderForm.watch("order");

  const form = useForm({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      title: "",
    },
  });

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
        isLoading: Menu ? false : true,
      },
      {
        href: "#",
        label: "Items",
      },
    ]);
  }, [data, Category, Menu]);
  useEffect(() => {
    if (data && data && data.length != 0) {
      // @ts-ignore
      OrderForm.setValue("order", data);
    }
  }, [data]);

  useEffect(() => {
    if (data && data !== undefined && data.length != 0) {
      const OrderChanged = OrderedList.find(
        // @ts-ignore
        (item, index) => item.id != data[index].id
      );
      if (OrderChanged) {
        SetShowChangeActions(true);
      } else {
        SetShowChangeActions(false);
      }
    }
  }, [OrderedList, data]);

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
        setTimeout(() => {
          router.push(
            `/edit/menu/${params.menuId}/category/${res.data.data.categoryId}/item/${res.data.data.id}`
          );
        }, 100);
      }
      sendMessage({
        type: "update",
        target: "item",
      });
    }
    SetIsCreating(false);
    setIsDialogOpen(false);
  };
  const CancelChangesHandler = () => {
    if (data && data != undefined && data.length != 0) {
      // @ts-ignore
      OrderForm.setValue("order", data);
    }
  };
  const SaveChangesHandler = async (OrderedListDto: { id: string }[]) => {
    if (OrderedListDto.length == 0) return null;
    SetIsSaving(true);
    const [res, error] = await MenuItemApi.Reorder(
      params.domain,
      OrderedListDto
    );
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Reorder Menus.`,
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Reorder Menus.`,
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Reorder Menus.`,
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }
    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Chnages Saved Successfully.",
        description: "Your Changes Were Saved Successfully.",
      });
      SetShowChangeActions(false);

      qc.setQueryData(QueryKey, OrderedList);
      sendMessage({
        type: "update",
        target: "item",
      });
    }
    SetIsSaving(false);
  };
  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Menu Items</SidebarContentTitle>
        <SidebarContent className="mb-16">
          <div className="flex flex-col gap-4">
            {Array(10)
              .fill(true)
              .map((_, index) => (
                <MenuItemLoading key={index} />
              ))}
          </div>
        </SidebarContent>
        <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
          <Skeleton className="h-[40px] w-full" />
        </footer>
      </>
    );

  return (
    <>
      <Form {...OrderForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            SaveChangesHandler(OrderedList.map((item) => ({ id: item.id })));
          }}
        >
          <SidebarContentTitle>Menu Items</SidebarContentTitle>
          <SidebarContent className="mb-16">
            {OrderedList.length == 0 && <NotFound type="menu item" />}
            <Sortable
              value={OrderedList || []}
              id="menu-item"
              onMove={({ activeIndex, overIndex }) => {
                move(activeIndex, overIndex);
              }}
            >
              <div className="flex flex-col gap-4">
                {OrderedList &&
                  OrderedList.map((item, index) => (
                    <SortableItem
                      key={item.id}
                      value={item.id}
                      className="group"
                    >
                      <MenuItem
                        item={item as IMenuItem}
                        href={`/edit/menu/${params.menuId}/category/${params.categoryId}/item/${item.id}`}
                      />
                    </SortableItem>
                  ))}
              </div>
            </Sortable>
          </SidebarContent>
          <ChangesHandler
            ShowChangeActions={ShowChangeActions}
            IsSaving={IsSaving}
            onCancel={CancelChangesHandler}
          />
        </form>
      </Form>
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
