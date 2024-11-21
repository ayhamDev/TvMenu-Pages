import { cn } from "@/lib/utils";
import { Globe, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import AnimatedTab from "./AnimatedTab";
import ChangesHandler from "./ChangesHandler";
import SidebarContent from "./SidebarContent";
import SidebarItem from "./SidebarItem";

const SettingsTab = () => {
  const [ShowChangeActions, SetShowChangeActions] = useState<boolean>(false);
  const [SiteVisable, SetSiteVisable] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      SetShowChangeActions(true);
    }, 1000);
  }, []);
  return (
    <>
      <SidebarContent className={cn(ShowChangeActions ? "pb-20" : "mb-0")}>
        <div className="flex flex-col gap-5">
          <SidebarItem title="Site Details">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title-input">Title</Label>
              <Input id="title-input" placeholder="e.g. Coffe Master..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="short_title-input">Short Title</Label>
              <Input
                id="short_title-input"
                placeholder="e.g. Coffe Master..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description-input">Description</Label>
              <Textarea
                id="description-input"
                placeholder="e.g. This is a coffe shop..."
              />
            </div>
            <Label htmlFor="favicon" className="flex items-center gap-1">
              favicon <p className="text-muted-foreground">(site icon)</p>
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

          <SidebarItem title="Site visibility">
            <div className="flex items-center justify-between ">
              <div className="flex gap-3 items-center">
                {SiteVisable ? (
                  <Globe className={"text-green-300"} />
                ) : (
                  <Lock className={"text-red-500"} />
                )}

                <div>
                  <h1>{SiteVisable ? "Public" : "Private"}</h1>
                  <p className="text-muted-foreground text-xs">
                    Your site is{" "}
                    {SiteVisable
                      ? "visible to everyone"
                      : "only visible to you"}
                  </p>
                </div>
              </div>

              <Switch checked={SiteVisable} onCheckedChange={SetSiteVisable} />
            </div>
          </SidebarItem>
          <SidebarItem title={`DNS`}>
            <Tabs className="w-full" defaultValue="defualt">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="defualt">
                  Default
                </TabsTrigger>
                <TabsTrigger className="w-full" value="custom" disabled>
                  Custom
                </TabsTrigger>
              </TabsList>
              <TabsContent value="defualt" className="mt-4">
                <div className="flex items-center">
                  <Input
                    className="rounded-r-none pr-0"
                    placeholder="e.g. coffee-master"
                  />
                  <div className="h-[40px] text-nowrap flex justify-start items-center px-3 bg-background rounded-r-sm text-muted-foreground border border-l-0 select-none">
                    .{process.env.NEXT_PUBLIC_DOMAIN}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-red-400 mt-2 ">
                  DNS has been Verifed
                </p>
              </TabsContent>
              <TabsContent value="custom" className="mt-4">
                <p className="text-muted-foreground text-xs mb-2">
                  Custom Domain Is Optional
                </p>

                <div className="flex items-center">
                  <Input
                    className="rounded-r-none"
                    placeholder="e.g. coffee-master.com"
                  />
                  <Button className="rounded-l-none">Verify</Button>
                </div>
                <p className="text-xs text-muted-foreground text-red-400 mt-2">
                  DNS has been Verifed
                </p>
              </TabsContent>
            </Tabs>
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

export default AnimatedTab(SettingsTab);
