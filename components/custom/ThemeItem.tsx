import { ITheme } from "@/interface/Theme.interface";
import { CheckCircle2 } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";
import { Skeleton } from "../ui/skeleton";

const ThemeItem = ({ theme }: { theme: ITheme }) => {
  return (
    <div className="relative">
      <RadioGroupItem value={theme.id} id={theme.id} className="peer sr-only" />
      <CheckCircle2 className="peer-data-[state=checked]:opacity-100 opacity-0 duration-150 absolute top-[-6px] right-[-6px] bg-background rounded-full" />
      <Label
        htmlFor={theme.id}
        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
      >
        <img
          src={theme.thumbUrl}
          alt={`Preview of ${theme.name}`}
          className="w-full max-h-[200px] aspect-square object-contain bg-offbackground border-2 rounded-md mb-3"
        />
        <span className="text-sm font-medium text-center">{theme.name}</span>
      </Label>
    </div>
  );
};
export const ThemeItemLoading = () => {
  return (
    <div className="bg-offbackground w-full">
      <div className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 cursor-default transition-all">
        <Skeleton className="w-full max-h-[200px] aspect-square object-contain bg-offbackground border-2 rounded-md mb-3" />
        <Skeleton className="w-[60%] h-[25px]" />
      </div>
    </div>
  );
};

export default ThemeItem;
