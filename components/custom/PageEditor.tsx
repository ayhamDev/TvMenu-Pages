"use client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import {
  Eye,
  Layout,
  LayoutTemplate,
  Loader2,
  LucideIcon,
  Monitor,
  PaintbrushVertical,
  Send,
  Settings,
  Smartphone,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { Button } from "../ui/button";

import useRefreshToken from "@/hooks/useRefreshToken";
import { IUser } from "@/interface/User.interface";
import { useQueryState } from "nuqs";
import AnimatedPage from "./AnimatedPage";
import LayoutTab from "../legacy/Layout.tab";
import LayoutTemplateTab from "../legacy/LayoutTemplate.tab";
import MenuTab from "../legacy/Menu.tab";
import SettingsTab from "../legacy/Settings.tab";
import StyleTab from "../legacy/Style.tab";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar";

type TabType = "Template" | "Layout" | "Menu" | "Style" | "Settings";

interface IPageEditor {
  user: IUser;
}

const PageEditor = ({ user }: IPageEditor) => {
  useRefreshToken(user);
  const { toast } = useToast();

  // Use useQueryState to manage the 'tab' query param
  const [tab, setTab] = useQueryState<TabType>("tab", {
    defaultValue: "Menu",
    shallow: true,
    history: "push",
    parse: (value) => (value ? (value as TabType) : "Menu"), // Parse the value to TabType
  }); // default to "Menu" if not set in the URL

  const Tabs: { name: TabType; icon: LucideIcon }[] = [
    { name: "Menu", icon: Utensils },
    { name: "Layout", icon: LayoutTemplate },
    { name: "Style", icon: PaintbrushVertical },
    { name: "Template", icon: Layout },
    { name: "Settings", icon: Settings },
  ];

  const [isMobileView, setIsMobileView] = useState(false);
  const [IsPublishing, SetIsPublishing] = useState<boolean>(false);

  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  const ChangeTab = (tab: TabType) => {
    setTab(tab); // Updates the URL query string automatically
  };

  const HandlePublish = () => {
    SetIsPublishing(true);
    setTimeout(() => {
      SetIsPublishing(false);
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Publish Menu.",
        description:
          "Something Went Wrong Please Try Again later, 2023 at 5:57 PM.",
      });
      toast({
        duration: 5000,
        title: "✓ Menu Published Successfully.",
        description: "Your Menu Updates Are Live Now 2023 at 5:57 PM.",
      });
    }, 500);
  };

  // Skeleton Loader for the PageEditor component when InitalLoginState is not 'done'
  // if (InitalLoginState !== "done") {
  //   return (
  //     <SidebarProvider defaultOpen={false} className="pointer-events-none">
  //       <Sidebar collapsible="icon">
  //         <SidebarContent>
  //           <SidebarGroup>
  //             <SidebarMenu className="gap-4">
  //               {Tabs.map((tabItem) => (
  //                 <SidebarMenuItem key={tabItem.name}>
  //                   <SidebarMenuButton
  //                     className="transition-all duration-150"
  //                     onClick={() => ChangeTab(tabItem.name)}
  //                     tooltip={tabItem.name}
  //                   >
  //                     <Skeleton className="h-full w-full rounded-sm" />
  //                   </SidebarMenuButton>
  //                 </SidebarMenuItem>
  //               ))}
  //             </SidebarMenu>
  //           </SidebarGroup>
  //         </SidebarContent>
  //       </Sidebar>

  //       <main className="w-full h-screen transition-all duration-1000 flex relative bg-offbackground">
  //         {/* sidebar content */}
  //         <div className="flex-1 min-w-[350px] max-w-[350px] bg-background border-r md:flex hidden flex-col">
  //           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight bg-background py-4 border-b-2 px-6">
  //             <Skeleton className="w-[150px] h-6" />
  //           </h3>
  //           <SidebarContent className="p-6">
  //             <Skeleton className="h-[300px] w-full" />
  //             <Skeleton className="h-[125px] w-full" />
  //             <Skeleton className="h-[50px] w-full" />
  //             <Skeleton className="h-[150px] w-full" />
  //           </SidebarContent>
  //         </div>
  //         <div className="flex flex-col w-full">
  //           {/* Floating toggle button for mobile/desktop view */}
  //           <div className="min-h-[60px] shadow-inner flex justify-end gap-6 items-center px-6">
  //             <Skeleton className="w-[125px] h-[40px]" />
  //             <Skeleton className="w-[125px] h-[40px]" />
  //             <AvatarMenu user={user} />
  //           </div>
  //           <div
  //             className={cn(
  //               "h-full w-full border-2 max-w-[100vw] max-h-[100vh] bg-background mx-auto my-auto duration-500 shadow-lg overflow-hidden relative",
  //               isMobileView
  //                 ? "w-[375px] h-[665px] max-h-[80vh] rounded-md"
  //                 : "w-full h-full"
  //             )}
  //           >
  //             <Button
  //               onClick={toggleView}
  //               variant={"outline"}
  //               className="absolute top-4 right-4 z-10 shadow-lg rounded-full"
  //               size={"icon"}
  //               title="Toggle View"
  //             >
  //               {isMobileView ? <Monitor /> : <Smartphone />}
  //             </Button>
  //           </div>
  //         </div>
  //       </main>
  //     </SidebarProvider>
  //   );
  // }
  return (
    <AnimatedPage>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className="gap-4">
                {Tabs.map((tabItem) => (
                  <SidebarMenuItem key={tabItem.name}>
                    <SidebarMenuButton
                      isActive={tab === tabItem.name}
                      className="transition-all duration-150"
                      onClick={() => ChangeTab(tabItem.name)}
                      tooltip={tabItem.name}
                    >
                      <tabItem.icon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="w-full h-screen transition-all duration-1000 flex relative bg-offbackground">
          {/* sidebar content */}
          <div className="flex-1 min-w-[350px] max-w-[350px] bg-background border-r md:flex hidden flex-col">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight bg-background py-4 border-b-2 px-6">
              {tab}
            </h3>

            <AnimatePresence mode="wait">
              {tab === "Template" && <LayoutTemplateTab key={tab} />}
              {tab === "Layout" && <LayoutTab key={tab} />}
              {tab === "Menu" && <MenuTab key={tab} />}
              {tab === "Style" && <StyleTab key={tab} />}
              {tab === "Settings" && <SettingsTab key={tab} />}
            </AnimatePresence>
          </div>
          <div className="flex flex-col w-full">
            {/* Floating toggle button for mobile/desktop view */}
            <div className="min-h-[60px] shadow-inner flex justify-end gap-6 items-center px-6">
              <Link href={"/"} prefetch={false}>
                <Button variant={"outline"}>
                  <Eye />
                  View Site
                </Button>
              </Link>
              <Button disabled={IsPublishing} onClick={HandlePublish}>
                {IsPublishing ? <Loader2 className="animate-spin" /> : <Send />}
                Publish
              </Button>
              <AvatarMenu user={user} />
            </div>
            <div
              className={cn(
                "h-full w-full border-2 max-w-[100vw] max-h-[100vh] bg-background mx-auto my-auto duration-500 shadow-lg overflow-hidden relative",
                isMobileView
                  ? "w-[375px] h-[665px] max-h-[80vh] rounded-md"
                  : "w-full h-full"
              )}
            >
              <Button
                onClick={toggleView}
                variant={"outline"}
                className="absolute top-4 right-4 z-10 shadow-lg rounded-full"
                size={"icon"}
                title="Toggle View"
              >
                {isMobileView ? <Monitor /> : <Smartphone />}
              </Button>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </AnimatedPage>
  );
};

export default PageEditor;
