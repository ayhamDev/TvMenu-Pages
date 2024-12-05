import api from "@/utils/Api";

export const GetCategories = async (domain: string, menuId: string) => {
  return api
    .get(`/page/${domain}/menu/${menuId}/category`)
    .then((res) => res.data);
};
