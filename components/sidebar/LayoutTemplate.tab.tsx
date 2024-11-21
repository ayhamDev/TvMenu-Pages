import { useState } from "react";
import TemplateItem from "../other/TemplateItem";
import { templates } from "../other/TemplateSelector";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import AnimatedTab from "./AnimatedTab";
import SidebarContent from "./SidebarContent";

const LayoutTemplateTab = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  return (
    <>
      <SidebarContent>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={handleTemplateSelect}
          className="grid grid-cols-2 gap-4 my-4 px-4 mb-4"
        >
          {templates.map((template) => (
            <TemplateItem template={template} key={template.id} />
          ))}
        </RadioGroup>
      </SidebarContent>
      <footer className="w-full px-4 py-4 bg-background border-t-2">
        <Button className="w-full">Select</Button>
      </footer>
    </>
  );
};

export default AnimatedTab(LayoutTemplateTab);
