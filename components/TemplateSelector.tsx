// TemplateSelector.tsx (Client Component)

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import AvatarMenu from "./AvatarMenu";
import TemplateSidebarTrigger from "./TemplateSidebarTrigger";
import TemplateItem from "./TemplateItem";
import { IUser } from "@/interface/User.interface";
export const templates = [
  {
    id: "menu1",
    name: "Classic Menu",
    image: "/test/template1.jpg",
    preview: "https://14ee4e9326354da9b3dd4f1a41ec276e.elf.site",
  },
  {
    id: "menu2",
    name: "Modern Menu",
    image: "/test/template2.webp",
    preview: "http://dashboard.menuone.com:5173/admin",
  },
  {
    id: "menu3",
    name: "Elegant Menu",
    image: "/test/template3.webp",
    preview: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "menu4",
    name: "Classic Menu",
    image: "/test/template1.jpg",
    preview: "https://14ee4e9326354da9b3dd4f1a41ec276e.elf.site",
  },
  {
    id: "menu5",
    name: "Modern Menu",
    image: "/test/template2.webp",
    preview: "http://dashboard.menuone.com:5173/admin",
  },
  {
    id: "menu6",
    name: "Elegant Menu",
    image: "/test/template3.webp",
    preview: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "menu7",
    name: "Classic Menu",
    image: "/test/template1.jpg",
    preview: "https://14ee4e9326354da9b3dd4f1a41ec276e.elf.site",
  },
  {
    id: "menu8",
    name: "Modern Menu",
    image: "/test/template2.webp",
    preview: "http://dashboard.menuone.com:5173/admin",
  },
  {
    id: "menu9",
    name: "Elegant Menu",
    image: "/test/template3.webp",
    preview: "/placeholder.svg?height=600&width=800",
  },
];

const TemplateSelector = ({ user }: { user: IUser }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const IsMobile = useIsMobile();

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  return (
    <SidebarProvider
      style={{
        // @ts-ignore
        "--sidebar-width": "350px",
      }}
    >
      <Sidebar variant="sidebar" className="select-none bg-background">
        <SidebarHeader className="border-b-2">
          <h4 className="text-xl text-center font-semibold tracking-tight py-[6px]">
            Select a Template
          </h4>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="relative">
            <SidebarGroup className="px-2">
              <RadioGroup
                value={selectedTemplate}
                onValueChange={handleTemplateSelect}
                className="grid grid-cols-2 gap-4 px-2 mb-2"
              >
                {templates.map((template) => (
                  <TemplateItem template={template} key={template.id} />
                ))}
              </RadioGroup>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t-2 p-4">
          <Button size={"sm"}>Select & Edit</Button>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full h-screen transition-all duration-1000 flex relative bg-offbackground">
        {/* Floating toggle button for mobile/desktop view */}
        <div className="flex flex-col w-full">
          <div className="h-[60px] shadow-inner flex justify-end gap-6 items-center px-6">
            <AvatarMenu user={user} />
          </div>
          <div
            className={cn(
              "h-full w-full border-2 max-w-[100vw] max-h-[100vh] bg-background mx-auto my-auto duration-500 shadow-lg overflow-hidden relative",
              isMobileView
                ? "w-[375px] h-[665px]  max-h-[80vh] rounded-md"
                : "w-full h-full"
            )}
          >
            <Button
              onClick={toggleView}
              variant={"outline"}
              className="absolute top-4 right-4 z-10 shadow-lg rounded-full"
              size={"icon"}
            >
              {isMobileView ? <Monitor /> : <Smartphone />}
            </Button>
            {IsMobile && <TemplateSidebarTrigger />}

            <iframe
              src={
                templates.find((template) => template.id === selectedTemplate)
                  ?.preview
              }
              className="w-full h-full p-0 m-0 border-none"
            ></iframe>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default TemplateSelector;
