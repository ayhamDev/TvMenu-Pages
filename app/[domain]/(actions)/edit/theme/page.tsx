"use client";
import SidebarContentTitle from "@/components/other/SidebarContentTitle";
import TemplateItem from "@/components/other/TemplateItem";
import { templates } from "@/components/other/TemplateSelector";
import AnimatedTab from "@/components/sidebar/AnimatedTab";
import SidebarContent from "@/components/sidebar/SidebarContent";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { useState } from "react";

const page = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  useBreadcrumbs([
    {
      href: "/edit/theme",
      label: "Theme",
    },
  ]);

  return (
    <>
      <SidebarContentTitle>Themes</SidebarContentTitle>
      <SidebarContent>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={handleTemplateSelect}
          className="grid grid-cols-2 gap-4 my-4 px-2 mb-4"
        >
          {templates.map((template) => (
            <TemplateItem template={template} key={template.id} />
          ))}
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
