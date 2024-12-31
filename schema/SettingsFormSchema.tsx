import { z } from "zod";

// Max size for favicon: 1MB
const MAX_FAVICON_SIZE = 1 * 1024 * 1024; // 1MB
// Max dimension for favicon
const MAX_FAVICON_DIMENSION = 192; // 192px for width/height

// Helper function to validate image dimensions from a URL
const validateImageDimensionsFromUrl = async (url: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (
        img.width <= MAX_FAVICON_DIMENSION &&
        img.height <= MAX_FAVICON_DIMENSION
      ) {
        resolve(true);
      } else {
        reject(new Error("Favicon image dimensions must be less than 192px"));
      }
    };
    img.onerror = () =>
      reject(new Error("Invalid image URL or unable to load image"));
    img.src = url;
  });
};

// Helper function to check file size and dimensions from URL (for faviconId)
const validateFaviconId = async (faviconId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/media/${faviconId}/file`;
  return new Promise<boolean>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (
        img.width <= MAX_FAVICON_DIMENSION &&
        img.height <= MAX_FAVICON_DIMENSION
      ) {
        resolve(true);
      } else {
        reject(new Error("Favicon image dimensions must be less than 192px"));
      }
    };
    img.onerror = () =>
      reject(new Error("Invalid favicon ID or unable to load image"));
    img.src = url;
  });
};

export const SettingsFormSchema = z.object({
  title: z
    .string()
    .max(60, {
      message: "Title must contain at most 60 character(s)",
    })
    .min(5, {
      message: "Title must contain at least 5 character(s)", // Corrected from 10 to 5
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
  customCode: z.string().max(5000, {
    message: "Code Content must contain at most 5000 character(s)",
  }),
  faviconUrl: z
    .string()
    .max(500, {
      message: "Favicon must contain at most 500 character(s)", // Corrected from 40 to 500
    })
    .optional()
    .refine(
      async (url) => {
        if (!url) return true;
        try {
          await validateImageDimensionsFromUrl(url);
          return true;
        } catch (err) {
          return false;
        }
      },
      {
        message: `Favicon must be a valid image with dimensions less than ${MAX_FAVICON_DIMENSION}px.`,
      }
    ),
  faviconId: z
    .string()
    .max(200, {
      message: "Favicon must contain at most 200 character(s)", // More descriptive message
    })
    .optional()
    .refine(
      async (faviconId) => {
        if (!faviconId) return true;
        try {
          await validateFaviconId(faviconId);
          return true;
        } catch (err) {
          return false;
        }
      },
      {
        message: `Favicon must correspond to a valid image with dimensions less than ${MAX_FAVICON_DIMENSION}px.`,
      }
    ),
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
