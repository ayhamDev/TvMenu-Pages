import { z } from "zod";

export const CreateMenuSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(3, {
      message: "Title must contain at least 3 character(s)",
    }),
});
