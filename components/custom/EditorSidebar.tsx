"use client";
import { useIsMobile } from "@/hooks/use-mobile"; // Import the useIsMobile hook
import {
  Blocks,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  PaintbrushVertical,
  Settings,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

type TabType = "Theme" | "Menu" | "Widget" | "Settings";

const EditorSidebar = () => {
  const isMobile = useIsMobile(); // Use the useIsMobile hook to detect mobile devices
  const sidebar = useSidebar();
  const Tabs: { name: TabType; icon: LucideIcon; path: string }[] = [
    { name: "Menu", icon: Utensils, path: "/edit/menu" },
    // { name: "Widget", icon: Blocks, path: "/edit/widget" },
    { name: "Theme", icon: PaintbrushVertical, path: "/edit/theme" },
    { name: "Settings", icon: Settings, path: "/edit/settings" },
  ];

  const path = usePathname();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-4">
              {Tabs.map((tabItem) => (
                <SidebarMenuItem key={tabItem.name}>
                  <Link
                    href={`/edit/${tabItem.name.toLowerCase()}`}
                    shallow={true}
                  >
                    <SidebarMenuButton
                      isActive={path.includes(tabItem.path)}
                      className="transition-all duration-150"
                      tooltip={tabItem.name}
                    >
                      <tabItem.icon />
                      <span>{tabItem.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Mobile Bottom Bar */}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton
            className="rounded-full max-w-max ml-auto"
            variant={"default"}
            onClick={() => sidebar.toggleSidebar()}
          >
            {sidebar.state == "collapsed" ? <ChevronRight /> : <ChevronLeft />}
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      {/* {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 shadow-md sm:hidden flex z-40 bg-offbackground">
          {Tabs.map((tabItem) => (
            <Link
              href={`/edit/${tabItem.name.toLowerCase()}`}
              key={tabItem.name}
              className="flex-1"
            >
              <Button
                variant={path.includes(tabItem.path) ? "default" : "secondary"}
                className="transition-all duration-150 w-full h-full p-4 rounded-none"
              >
                <tabItem.icon />
              </Button>
            </Link>
          ))}
        </div>
      )} */}
    </>
  );
};

export default EditorSidebar;
