import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import AnimatedTab from "../custom/AnimatedTab";
import ChangesHandler from "../custom/ChangesHandler";
import SidebarContent from "../custom/SidebarContent";
import SidebarItem from "../custom/SidebarItem";

const LayoutTab = () => {
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [widthUnit, setWidthUnit] = useState("px");

  useEffect(() => {
    setTimeout(() => {
      SetShowChangeActions(true);
    }, 1000);
  }, []);
  return (
    <>
      <SidebarContent className={cn(ShowChangeActions ? "pb-20" : "mb-0")}>
        <div className="flex flex-col gap-5">
          <SidebarItem title="Type">
            <Tabs className="w-full" defaultValue="list">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="tabs">
                  Tabs
                </TabsTrigger>
                <TabsTrigger className="w-full" value="list">
                  List
                </TabsTrigger>
                <TabsTrigger className="w-full" value="page">
                  Pages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </SidebarItem>
          <SidebarItem title="Number Of Columns">
            <Tabs className="w-full" defaultValue="1">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="1">
                  1
                </TabsTrigger>
                <TabsTrigger className="w-full" value="2">
                  2
                </TabsTrigger>
                <TabsTrigger className="w-full" value="3">
                  3
                </TabsTrigger>
                <TabsTrigger className="w-full" value="4">
                  4
                </TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <Label htmlFor="spacing-input">Spacing</Label>
                <div className="flex justify-center items-center mt-2">
                  <Input
                    type="number"
                    id="spacing-input"
                    className="rounded-r-none border-r-0"
                  />
                  <div className="bg-background border h-[40px] flex items-center px-4 text-muted-foreground select-none">
                    px
                  </div>
                </div>
              </div>
            </Tabs>
          </SidebarItem>
          <SidebarItem title="Max Width">
            <div className="flex">
              <Input type="number" className="rounded-r-none border-r-0" />
              <Select value={widthUnit} onValueChange={setWidthUnit}>
                <SelectTrigger className="w-20 rounded-l-none ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="%">%</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SidebarItem>
        </div>
      </SidebarContent>
      <ChangesHandler
        ShowChangeActions={ShowChangeActions}
        SetShowChangeActions={SetShowChangeActions}
      />
    </>
  );
};

export default AnimatedTab(LayoutTab);
