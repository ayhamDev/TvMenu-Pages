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
import { IMenu } from "@/interface/Menu.interface";
import { MenuApi } from "@/utils/api/menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCategorySchema } from "./[menuId]/category/page";
import { EditMenuSchema } from "./[menuId]/page";

const MenuOrderSchema = z.object({
  order: z.array(
    EditMenuSchema.extend({
      id: z.string(),
    })
  ),
});
export const CreateMenuSchema = z.object({
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
  const params = useParams<{ domain: string }>();
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [IsSaving, SetIsSaving] = useState<boolean>(false);
  const [IsCreating, SetIsCreating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const qc = useQueryClient();
  const enabledQuery = useEnableQuery();
  const QueryKey = ["page", params.domain, "menu"];

  const { data, error, isLoading } = useQuery<IMenu[]>({
    queryKey: QueryKey,
    queryFn: () => MenuApi.GetAll(params.domain),
    retry: 1,
    enabled: enabledQuery,
  });
  useBreadcrumbs([
    {
      href: "/edit/menu",
      label: "Menu",
    },
  ]);
  const OrderForm = useForm<z.infer<typeof MenuOrderSchema>>({
    resolver: zodResolver(MenuOrderSchema),
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
    resolver: zodResolver(CreateMenuSchema),
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
    if (data) {
      const OrderChanged = OrderedList.find(
        (item, index) => item.id != data[index].id
      );
      if (OrderChanged) {
        SetShowChangeActions(true);
      } else {
        SetShowChangeActions(false);
      }
    }
  }, [OrderedList, data]);

  const CancelChangesHandler = () => {
    if (data && data.length != 0) {
      // @ts-ignore
      OrderForm.setValue("order", data);
    }
  };
  const CreateMenuHandler = async (
    data: z.infer<typeof CreateCategorySchema>
  ) => {
    SetIsCreating(true);
    const [res, error] = await MenuApi.Create(params.domain, {
      title: data.title,
    });
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Create Menu.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }

    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Menu Created Successfully.",
        description: "Your Menu Was Create Successfully.",
      });
      qc.invalidateQueries(QueryKey);
      if (res.data?.data?.id) {
        router.push(`/edit/menu/${res.data.data.id}`);
      }
    }
    SetIsCreating(false);
    setIsDialogOpen(false);
  };
  const SaveChangesHandler = async (OrderedListDto: { id: string }[]) => {
    if (OrderedListDto.length == 0) return null;
    SetIsSaving(true);
    const [res, error] = await MenuApi.Reorder(params.domain, OrderedListDto);
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
    }
    SetIsSaving(false);
  };
  if (isLoading)
    return (
      <>
        <SidebarContentTitle>Menus</SidebarContentTitle>
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
          <SidebarContentTitle>Menus</SidebarContentTitle>
          <SidebarContent className="mb-16">
            {!data && <NotFound type="menu" />}
            <Sortable
              value={OrderedList || []}
              id="menu"
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
                        item={item as IMenu}
                        href={`/edit/menu/${item.id}`}
                      />
                    </SortableItem>
                  ))}
              </div>
            </Sortable>
            <FormMessage />
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
                <Plus /> Add Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(CreateMenuHandler)}
              >
                <DialogHeader>
                  <DialogTitle>Create Menu</DialogTitle>
                  <DialogDescription>
                    Represents the top-level grouping, such as Breakfast, Lunch,
                    or Dinner
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
                            <Input placeholder="e.g. Breakfast" {...field} />
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
