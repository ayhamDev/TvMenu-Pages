import { useState } from "react";
import TemplateItem from "../custom/ThemeItem";
import { templates } from "../custom/TemplateSelector";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import AnimatedTab from "../custom/AnimatedTab";
import SidebarContent from "../custom/SidebarContent";

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
