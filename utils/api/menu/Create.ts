import { IMenu } from "@/interface/Menu.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Create = async (domain: string, menu: DeepPartial<IMenu>) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenu }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.post(`/page/${domain}/menu`, menu));
};
