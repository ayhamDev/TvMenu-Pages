import React from "react";
import { templates } from "./TemplateSelector";
import { RadioGroupItem } from "../ui/radio-group";
import { CheckCircle2 } from "lucide-react";
import { Label } from "../ui/label";

const TemplateItem = ({ template }: { template: (typeof templates)[0] }) => {
  return (
    <div className="relative">
      <RadioGroupItem
        value={template.id}
        id={template.id}
        className="peer sr-only"
      />
      <CheckCircle2 className="peer-data-[state=checked]:opacity-100 opacity-0 duration-150 absolute top-[-6px] right-[-6px] bg-background rounded-full" />
      <Label
        htmlFor={template.id}
        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
      >
        <img
          src={template.image}
          alt={`Preview of ${template.name}`}
          className="w-full max-h-[200px] min-h-[150px] object-cover rounded-md mb-3"
        />
        <span className="text-sm font-medium text-center">{template.name}</span>
      </Label>
    </div>
  );
};

export default TemplateItem;
