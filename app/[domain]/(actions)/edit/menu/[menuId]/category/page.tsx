"use client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { Menu, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useBreadcrumbs([
    {
      href: "/edit/menu",
      label: "Menu",
    },
    {
      href: "/edit/menu/menuid",
      label: "breakfast",
    },
    {
      href: "#",
      label: "Categories",
    },
  ]);
  const fields = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    label: `Menu ${index + 1}`,
  }));

  return (
    <>
      <SidebarContentTitle>Categories</SidebarContentTitle>
      <SidebarContent className="mb-16">
        <Sortable value={fields} id="menu">
          <div className="flex flex-col gap-4">
            {fields.map((item, index) => (
              <SortableItem key={item.id} value={item.id} className="group">
                <SidebarItem
                  className="flex-row justify-between items-center overflow-hidden relative select-none cursor-pointer active:opacity-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`${location.pathname}/${index}`);
                  }}
                >
                  {/* Use Tailwind group-hover for showing the drag handle */}
                  <SortableDragHandle className="flex items-center absolute left-[-30px] h-full opacity-0 transition-all duration-200 group-hover:left-0 group-hover:opacity-100">
                    <Menu className="size-4 p-4 h-full box-content" />
                  </SortableDragHandle>

                  <div className="flex items-center group-hover:ml-6 transition-all duration-150">
                    <p className="px-3">{item.label}</p>
                  </div>
                </SidebarItem>
              </SortableItem>
            ))}
          </div>
        </Sortable>
      </SidebarContent>

      <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"} className="w-full">
              <Plus /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Breaks down the menu into specific sections, like Beverages,
                Desserts, or Salads
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <div className="flex flex-row gap-4 items-center">
                <Label htmlFor="title_input">Title</Label>
                <Input placeholder="e.g. Breakfast" id="title_input" />
              </div>
            </div>
            <DialogFooter>
              <Button>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </footer>
    </>
  );
};

export default AnimatedTab(page);
