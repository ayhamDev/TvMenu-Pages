import { z } from "zod";

export const SettingsFormSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(5, {
      message: "Title must contain at least 10 character(s)",
    }),
  shortName: z
    .string()
    .max(40, {
      message: "App Name must contain at most 40 character(s)",
    })
    .min(3, {
      message: "App Name must contain at least 3 character(s)",
    }),
  description: z.string().optional(),
  faviconUrl: z
    .string()
    .max(40, {
      message: "Favicon must contain at most 500 character(s)",
    })

    .optional(),
  faviconId: z
    .string()
    .max(200, {
      message: "Favicon must contain at most 200 character(s)",
    })
    .optional(),
  public: z.boolean(),
  subdomain: z
    .string()
    .max(40, {
      message: "Subdomain must contain at most 40 character(s)",
    })
    .min(2, {
      message: "Subdomain must contain at least 2 character(s)",
    }),
});
