import api from "@/utils/Api";

export const GetAll = async (domain: string) => {
  return api.get(`/page/${domain}/menu`).then((res) => res.data);
};
