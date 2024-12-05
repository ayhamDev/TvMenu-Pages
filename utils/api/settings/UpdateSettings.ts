import { IPage } from "@/interface/Page.interface";
import { AxiosError, AxiosResponse } from "axios";
import { DeepPartial } from "react-hook-form";
import api from "@/utils/Api";
import { CleanPromise } from "@/utils/CleanPromise";

export const UpdateSettings = async (
  domain: string,
  changes: DeepPartial<IPage>
) => {
  return CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; data: IPage }>,
    AxiosError<{ message: string; statusCode: number }>
  >(api.patch(`/page/${domain}/settings`, changes));
};
