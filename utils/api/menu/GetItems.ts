import api from "@/utils/Api";

export const GetItems = async (domain: string, menuId: string) => {
  return api.get(`/page/${domain}/menu/${menuId}/item`).then((res) => res.data);
};
