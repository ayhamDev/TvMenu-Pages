import { AxiosError, AxiosResponse } from "axios";
import { CleanPromise } from "@/utils/CleanPromise";
import api from "@/utils/Api";

export const FindPage = async (domain: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: 200 }>,
    AxiosError
  >(api.get(`/page/${domain}/stats`));
};
