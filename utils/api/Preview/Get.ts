import api from "@/utils/Api";

export const Get = async (domain: string) => {
  return api.get(`/page/${domain}/preview`).then((res) => res.data);
};
