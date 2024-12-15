import { ICategory } from "@/interface/Category.interface";
import { IMenu } from "@/interface/Menu.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosResponse, AxiosError } from "axios";

export const Delete = async (domain: string, categoryId: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: ICategory }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.delete(`/page/${domain}/category/${categoryId}`));
};
