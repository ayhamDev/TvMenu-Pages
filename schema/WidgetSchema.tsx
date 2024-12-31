import { Types } from "@/components/custom/WidgetIcon";
import { z } from "zod";

export const WidgetSchema = z.object({
  name: z
    .string()
    .max(60, {
      message: "Widget Name must contain at most 60 character(s)",
    })
    .min(3, {
      message: "Widget Name must contain at least 3 character(s)",
    }),
  type: z.enum(Types),
  content: z
    .string()
    .max(5000, {
      message: "Code Content must contain at most 5000 character(s)",
    })
    .optional(),
});
