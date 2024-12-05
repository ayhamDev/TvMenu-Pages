import api from "@/utils/Api";

export const FindOne = async (
  domain: string,
  itemId: string,
  join?: string[]
) => {
  return api
    .get(`/page/${domain}/item/${itemId}`, {
      params: {
        join: join || [],
      },
    })
    .then((res) => res.data);
};
