import { Axios, AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import api from "./Api";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const RefreshToken = async (
  role: "Admin" | "Client",
  RefreshToken?: RequestCookie
) => {
  let headers: AxiosHeaders | undefined = new AxiosHeaders();
  if (RefreshToken) {
    headers.set("Cookie", `${RefreshToken.name}=${RefreshToken.value}`);
  } else {
    headers = undefined;
  }

  return api.get<{ message: string; statusCode: number; Token: string }>(
    `/auth/${role.toLocaleLowerCase()}/refresh`,
    {
      headers: { ...headers },
    }
  );
};
