import { Sleep } from "@/lib/Sleep";
import api from "@/utils/Api";

export const FindOne = async (mediaId: string) => {
  return api.get(`/media/${mediaId}`).then((res) => res.data);
};
