import { ICategory } from "@/interface/Category,interface";
import { IMenu } from "@/interface/Menu.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";

export const Update = async (
  domain: string,
  menuId: string,
  categoryId: string,
  category: DeepPartial<ICategory>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IMenu }>,
    AxiosError<{ message: string; statusCode: number }>
  >(
    api.patch(`/page/${domain}/category/${categoryId}`, { menuId, ...category })
  );
};
