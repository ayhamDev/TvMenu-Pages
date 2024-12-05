import api from "@/utils/Api";

export const GetPage = async (domain: string) => {
  return api.get(`/page/${domain}`).then((res) => res.data);
};
