import { AxiosError, AxiosResponse } from "axios";
import api from "./Api";
import { CleanPromise } from "./CleanPromise";

export const FindPage = async (domain: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: 200 }>,
    AxiosError
  >(api.get(`/page/${domain}/stats`));
};
