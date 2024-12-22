import api from "@/utils/Api";

export const GetAll = async (domain: string, categoryId: string) => {
  return api
    .get(`/page/${domain}/category/${categoryId}/item`)
    .then((res) => res.data);
};
