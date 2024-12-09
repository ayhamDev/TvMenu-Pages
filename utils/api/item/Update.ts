import { IMenu } from "@/interface/Menu.interface";
import { IMenuItem } from "@/interface/MenuItem.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Update = async (
  domain: string,
  itemId: string,
  item: DeepPartial<IMenuItem>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenu }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.patch(`/page/${domain}/item/${itemId}`, { ...item }));
};
