import { z } from "zod";
import { EditMenuItemSchema } from "./EditMenuItemSchema";

export const ItemOrderSchema = z.object({
  order: z.array(
    EditMenuItemSchema.extend({
      id: z.string(),
    })
  ),
});
