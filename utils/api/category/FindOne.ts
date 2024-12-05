import api from "@/utils/Api";

export const FindOne = async (
  domain: string,
  categoryId: string,
  join?: string[]
) => {
  return api
    .get(`/page/${domain}/category/${categoryId}`, {
      params: {
        join: join || [],
      },
    })
    .then((res) => res.data);
};
