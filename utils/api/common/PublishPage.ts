import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";

export const PublishPage = (domain: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number }>,
    AxiosError<{ message: string; statuscode: number }>
  >(api.post(`/page/${domain}/publish`));
};
