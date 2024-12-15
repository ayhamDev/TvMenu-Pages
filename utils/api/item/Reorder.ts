import { IMenuItem } from "@/interface/MenuItem.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Reorder = async (
  domain: string,
  Item: DeepPartial<IMenuItem[]>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.put(`/page/${domain}/item`, Item));
};
