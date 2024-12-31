import { z } from "zod";

export const BlockSchema = z.object({
  name: z
    .string()
    .min(3)
    .min(3, {
      message: "Name must contain at least 3 character(s)",
    })
    .max(60, {
      message: "Name must contain at most 60 character(s)",
    }),
  content: z
    .string()
    .min(3, {
      message: "Block Content must contain at least 5 character(s)",
    })
    .max(1000, {
      message: "Block Content must contain at most 1000 character(s)",
    }),
  visible: z.boolean(),
});
