import { z } from "zod";

export const EditMenuItemSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(3, {
      message: "Title must contain at least 3 character(s)",
    }),
  caption: z
    .string()
    .max(500, {
      message: "Caption must contain at most 500 character(s)",
    })
    .optional(),
  price: z
    .string()
    .max(200, {
      message: "Price must contain at most 200 character(s)",
    })
    .optional(),
  imageUrl: z
    .string()
    .max(500, {
      message: "ImageUrl must contain at most 500 character(s)",
    })
    .optional(),
  imageId: z
    .string()
    .max(200, {
      message: "ImageUrl must contain at most 200 character(s)",
    })
    .optional(),
  visible: z.boolean(),
});
