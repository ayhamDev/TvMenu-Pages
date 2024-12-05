import api from "@/utils/Api";

export const GetItems = async (domain: string, categoryId: string) => {
  return api
    .get(`/page/${domain}/category/${categoryId}/item`)
    .then((res) => res.data);
};
