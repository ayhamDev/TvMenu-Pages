import { ITheme } from "@/interface/Theme.interface";
import { CheckCircle2 } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";

const ThemeItem = ({ theme }: { theme: ITheme }) => {
  return (
    <div className="relative">
      <RadioGroupItem
        value={theme.name}
        id={theme.name}
        className="peer sr-only"
      />
      <CheckCircle2 className="peer-data-[state=checked]:opacity-100 opacity-0 duration-150 absolute top-[-6px] right-[-6px] bg-background rounded-full" />
      <Label
        htmlFor={theme.name}
        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
      >
        <img
          src={theme.thumbUrl}
          alt={`Preview of ${theme.name}`}
          className="w-full max-h-[200px] min-h-[50px] object-cover rounded-md mb-3"
        />
        <span className="text-sm font-medium text-center">{theme.name}</span>
      </Label>
    </div>
  );
};

export default ThemeItem;