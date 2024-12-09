import { IMenuItem } from "@/interface/MenuItem.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";

export const Delete = async (domain: string, itemId: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenuItem }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.delete(`/page/${domain}/item/${itemId}`));
};
