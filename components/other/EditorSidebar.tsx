"use client";
import {
  LucideIcon,
  PaintbrushVertical,
  Settings,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile"; // Import the useIsMobile hook
import { Button } from "../ui/button";

type TabType = "Theme" | "Layout" | "Menu" | "Style" | "Settings";

const EditorSidebar = () => {
  const isMobile = useIsMobile(); // Use the useIsMobile hook to detect mobile devices

  const Tabs: { name: TabType; icon: LucideIcon; path: string }[] = [
    { name: "Menu", icon: Utensils, path: "/edit/menu" },
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
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Mobile Bottom Bar */}
        </SidebarContent>
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
