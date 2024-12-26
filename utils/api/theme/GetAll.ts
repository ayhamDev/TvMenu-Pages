import api from "@/utils/Api";

export const GetAll = async (domain: string) => {
  return api.get(`/theme`).then((res) => res.data);
};
