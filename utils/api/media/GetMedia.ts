import { Sleep } from "@/lib/Sleep";
import api from "@/utils/Api";

export const GetMedia = async (
  type: "image" | "video",
  IsPublic: boolean,
  clientId: string | null,
  page: number
) => {
  const params = new URLSearchParams({
    type: type as string,
    // @ts-ignore
    public: IsPublic as string,
    // @ts-ignore
    page: page as string,
    limit: "10",
  });
  if (clientId) {
    params.set("clientId", clientId);
  }
  await Sleep(1000);

  return api.get(`/media?${params.toString()}`).then((res) => res.data);
};
