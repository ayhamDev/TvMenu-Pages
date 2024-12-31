import { z } from "zod";

export const CreateBlockSchema = z.object({
  name: z
    .string()
    .min(3)
    .min(3, {
      message: "Name must contain at least 3 character(s)",
    })
    .max(60, {
      message: "Name must contain at most 60 character(s)",
    }),
});
