import { z } from "zod";
import { EditMenuSchema } from "./EditMenuSchema";

export const MenuOrderSchema = z.object({
  order: z.array(
    EditMenuSchema.extend({
      id: z.string(),
    })
  ),
});
