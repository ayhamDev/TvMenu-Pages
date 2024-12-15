import { Sleep } from "@/lib/Sleep";
import api from "@/utils/Api";

export const Get = async (
  type: "image" | "video",
  search: string,
  IsPublic: boolean,
  clientId: string | null,
  page: number
) => {
  const params = new URLSearchParams({
    type: type as string,
    search,
    // @ts-ignore
    public: IsPublic as string,
    // @ts-ignore
    page: page as string,
    limit: "10",
  });
  if (clientId) {
    params.set("clientId", clientId);
  }

  return api.get(`/media?${params.toString()}`).then((res) => res.data);
};
