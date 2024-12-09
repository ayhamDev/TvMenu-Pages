import { IMenu } from "@/interface/Menu.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosResponse, AxiosError } from "axios";

export const Delete = async (domain: string, menuId: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenu }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.delete(`/page/${domain}/menu/${menuId}`));
};
