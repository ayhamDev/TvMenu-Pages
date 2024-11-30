"use client";
import SidebarContentTitle from "@/components/other/SidebarContentTitle";
import AnimatedTab from "@/components/sidebar/AnimatedTab";
import SidebarContent from "@/components/sidebar/SidebarContent";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
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
      href: "/edit/menu/menuid/category",
      label: "hot drinks",
    },
    {
      href: "/edit/menu/menuid/category/0",
      label: "Items",
    },
    {
      href: "/edit/menu/menuid/category/0/item",
      label: "hot chocolate",
    },
  ]);
  const [MenuVisable, SetMenuVisable] = useState<boolean>(true);
  const router = useRouter();
  const fields = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    label: `Menu ${index + 1}`,
  }));

  return (
    <>
      <SidebarContent className="mb-16 p-0">
        <SidebarContentTitle>Edit Menu</SidebarContentTitle>
        <div className="p-4 flex flex-col gap-4">
          <SidebarItem>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Menu Title</Label>
              <Input id="title" placeholder="e.g. breakfast" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Menu Caption
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea id="title" placeholder="e.g. breakfast" />
            </div>

            <Label htmlFor="favicon">
              Image <span className="text-muted-foreground">(Optional)</span>
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
          <SidebarItem title="Menu Visibility">
            <div className="flex items-center justify-between ">
              <div className="flex gap-3 items-center">
                {MenuVisable ? (
                  <Eye className={"text-green-300"} />
                ) : (
                  <EyeOff className={"text-red-500"} />
                )}

                <div>
                  <h1>{MenuVisable ? "Visible" : "Hidden"}</h1>
                  <p className="text-muted-foreground text-xs">
                    Your menu will
                    {MenuVisable ? " be visible." : " not be visible"}
                  </p>
                </div>
              </div>
              <Switch checked={MenuVisable} onCheckedChange={SetMenuVisable} />
            </div>
          </SidebarItem>
        </div>
        <SidebarContentTitle>Menu Sections</SidebarContentTitle>
        <div className="p-4 flex flex-col gap-4">
          <SidebarItem
            className="flex-row justify-between items-center cursor-pointer active:opacity-60"
            onClick={() => router.push(`/edit/menu/menuid/category`)}
          >
            <h4>Catagories</h4>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={"secondary"}>8</Badge>
              <ChevronRight />
            </div>
          </SidebarItem>
          <SidebarItem
            className="flex-row justify-between items-center cursor-pointer active:opacity-60"
            onClick={() => router.push(`/edit/menu/menuid/items`)}
          >
            <h4>Menu Items</h4>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={"secondary"}>8</Badge>
              <ChevronRight />
            </div>
          </SidebarItem>
        </div>
      </SidebarContent>
      <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
        <Button variant={"secondary"} className="w-full">
          Cancel
        </Button>
        <Button variant={"default"} className="w-full">
          Save
        </Button>
      </footer>
    </>
  );
};

export default AnimatedTab(page);
