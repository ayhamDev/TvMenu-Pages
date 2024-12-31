import { WidgetTypes } from "@/interface/Widget.interface";
import { LucideIcon, CodeXml, PhoneCall } from "lucide-react";

export const WidgetIconMapping = {
  custom: CodeXml,
  call: PhoneCall,
};

export const Types = ["custom", "call"] as const;

export const WidgetIcon = ({
  type,
  size = "24px",
}: {
  size?: string;
  type: WidgetTypes;
}) => {
  const Icon = WidgetIconMapping[type] || WidgetIconMapping["custom"];
  return <Icon size={size} />;
};
