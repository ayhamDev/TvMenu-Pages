import { ICategory } from "@/interface/Category.interface";
import { IMenu } from "@/interface/Menu.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Reorder = async (
  domain: string,
  category: DeepPartial<ICategory[]>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.put(`/page/${domain}/category`, category));
};
