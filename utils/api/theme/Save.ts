import { IPage } from "@/interface/Page.interface";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";
import { AxiosError, AxiosResponse } from "axios";

export const Save = async (domain: string, selectedThemeId: string) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IPage }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.patch(`/page/${domain}/settings`, { themeId: selectedThemeId }));
};
