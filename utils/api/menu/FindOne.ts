import api from "@/utils/Api";

export const FindOne = async (
  domain: string,
  menuId: string,
  join?: string[]
) => {
  return api
    .get(`/page/${domain}/menu/${menuId}`, {
      params: {
        join: join || [],
      },
    })
    .then((res) => res.data);
};
