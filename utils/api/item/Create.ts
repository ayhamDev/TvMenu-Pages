import { IMenu } from "@/interface/Menu.interface";
import { IMenuItem } from "@/interface/MenuItem.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Create = async (
  domain: string,
  categoryId: string,
  menuItem: DeepPartial<IMenuItem>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenuItem }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.post(`/page/${domain}/item`, { categoryId, ...menuItem }));
};
