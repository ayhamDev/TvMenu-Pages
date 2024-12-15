import { IUser } from "@/interface/User.interface";
import { RefreshToken } from "./RefreshToken";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { CleanPromise } from "./CleanPromise";
import { AxiosError, AxiosResponse } from "axios";

const RequestAccessToken = async (
  User: IUser,
  CookieStore: ReadonlyRequestCookies
) => {
  return await CleanPromise<
    AxiosResponse<{ message: string; statusCode: number; Token: string }>,
    AxiosError<{ message: string; statusCode: number }>
  >(RefreshToken(User.Role, CookieStore.get(`${User.Role}_RefreshToken`)));
};

export { RequestAccessToken };
