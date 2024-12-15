import { IMAGE_TYPES, VIDEO_TYPES } from "@/components/other/MediaBrowser";

export const ValidateFile = (file: File, type: "image" | "video") => {
  const maxSize = (type == "video" ? 24 : 2) * 1024 * 1024; // 24 MB

  console.log(file.type);

  if (type == "image" && !IMAGE_TYPES.includes(file.type)) {
    return "type";
  }
  if (type == "video" && !VIDEO_TYPES.includes(file.type)) {
    return "type";
  }
  if (file.size > maxSize) {
    return "size";
  }

  return true;
};
