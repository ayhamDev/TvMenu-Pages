"use client";
import AnimatedTab from "@/components/custom/AnimatedTab";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import { templates } from "@/components/custom/TemplateSelector";
import ThemeItem from "@/components/custom/ThemeItem";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import useMenuTheme from "@/hooks/useMenuTheme";
import { useParams } from "next/navigation";
import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const page = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const params = useParams<{ domain: string }>();
  const Themes = useMenuTheme(params.domain);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  useBreadcrumbs([
    {
      href: "/edit/theme",
      label: "Theme",
    },
  ]);
  if (!Themes)
    return (
      <>
        <SidebarContentTitle>Themes</SidebarContentTitle>
        <SidebarContent></SidebarContent>
        <footer className="w-full px-4 py-4 bg-background border-t-2 flex  gap-4"></footer>
      </>
    );
  return (
    <>
      <SidebarContentTitle>Themes</SidebarContentTitle>
      <SidebarContent>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={handleTemplateSelect}
          className="my-4 px-2 mb-4"
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              300: 1,
              400: 2,
            }}
          >
            <Masonry gutter="15px">
              {Themes &&
                Themes.map((theme, index) => (
                  <ThemeItem theme={theme} key={index} />
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </RadioGroup>
      </SidebarContent>
      <footer className="w-full px-4 py-4 bg-background border-t-2 flex  gap-4">
        <Button className="w-full" variant={"secondary"}>
          Cancel
        </Button>

        <Button className="w-full">Save</Button>
      </footer>
    </>
  );
};

export default AnimatedTab(page);
