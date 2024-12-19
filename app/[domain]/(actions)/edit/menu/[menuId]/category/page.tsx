"use client";
import MenuItem from "@/components/custom/MenuItem";
import MenuItemLoading from "@/components/custom/MenuItemLoading";
import NotFound from "@/components/custom/NotFound";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import { Sortable, SortableItem } from "@/components/custom/sortable";
import AnimatedTab from "@/components/custom/AnimatedTab";
import ChangesHandler from "@/components/custom/ChangesHandler";
import SidebarContent from "@/components/custom/SidebarContent";
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
import useEnableQuery from "@/hooks/useEnableQuery";
import { ICategory } from "@/interface/Category.interface";
import { IMenu } from "@/interface/Menu.interface";
import { CategoryApi } from "@/utils/api/category";
import { MenuApi } from "@/utils/api/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { EditCategorySchema } from "./[categoryId]/page";
import useMenu from "@/hooks/useMenu";

const CategoryOrderSchema = z.object({
  order: z.array(
    EditCategorySchema.extend({
      id: z.string(),
    })
  ),
});

export const CreateCategorySchema = z.object({
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
  const params = useParams<{ domain: string; menuId: string }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);
  const [IsCreating, SetIsCreating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const enabledQuery = useEnableQuery();
  const qc = useQueryClient();
  const QueryKey = ["page", params.domain, "menu", params.menuId, "category"];
  const { data, error, isLoading } = useQuery<ICategory[]>({
    queryKey: QueryKey,
    queryFn: () => CategoryApi.GetAll(params.domain),
    retry: 1,
    enabled: enabledQuery,
  });
  const Menu = useMenu(params.domain, params.menuId);

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
      href: "#",
      label: "Categories",
    },
  ]);
  const OrderForm = useForm<z.infer<typeof CategoryOrderSchema>>({
    resolver: zodResolver(CategoryOrderSchema),
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
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      title: "",
    },
  });
  useEffect(() => {
    if (data && data.length != 0) {
      // @ts-ignore
      OrderForm.setValue("order", data);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length != 0) {
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

  useLayoutEffect(() => {
    const menu = qc.getQueryData<IMenu | undefined>([
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
        },
        {
          href: "#",
          label: "Categories",
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
          href: `/edit/menu/${params.menuId}`,
          label: Menu ? Menu.title : "",
          isLoading: Menu ? false : true,
        },
        {
          href: "#",
          label: "Categories",
        },
      ]);
    }
  }, [data, Menu]);
  const CreateCategoryHandler = async (
    data: z.infer<typeof CreateCategorySchema>
  ) => {
    SetIsCreating(true);
    const [res, error] = await CategoryApi.Create(
      params.domain,
      params.menuId,
      {
        title: data.title,
      }
    );
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Category.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Category.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Category.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }

    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Category Created Successfully.",
        description: "Your Category Was Create Successfully.",
      });
      qc.invalidateQueries(QueryKey);
      if (res.data?.data?.id) {
        router.push(`/edit/menu/${params.menuId}/category/${res.data.data.id}`);
      }
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
    const [res, error] = await CategoryApi.Reorder(
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

      qc.setQueryData(QueryKey, [...OrderedList]);
    }
    SetIsSaving(false);
  };
  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Menu Categories</SidebarContentTitle>
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
          <SidebarContentTitle>Menu Categories</SidebarContentTitle>
          <SidebarContent className="mb-16">
            {OrderedList.length == 0 && <NotFound type="category" />}
            <Sortable
              value={OrderedList || []}
              id="category"
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
                        item={item as ICategory}
                        href={`/edit/menu/${params.menuId}/category/${item.id}`}
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
                <Plus /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(CreateCategoryHandler)}
              >
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                  <DialogDescription>
                    Breaks down the menu into specific sections, like Beverages,
                    Desserts, or Salads
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
                            <Input placeholder="e.g. Hot Drinks" {...field} />
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
