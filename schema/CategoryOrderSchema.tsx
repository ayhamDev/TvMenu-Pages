import { z } from "zod";
import { EditCategorySchema } from "./EditCategorySchema";

export const CategoryOrderSchema = z.object({
  order: z.array(
    EditCategorySchema.extend({
      id: z.string(),
    })
  ),
});
