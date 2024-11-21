import { IUser } from "@/interface/User.interface";
import { AxiosError, AxiosResponse } from "axios";
import api from "./Api";
import { CleanPromise } from "./CleanPromise";
import { log } from "console";

export const IsPageOwner = async (user: IUser | null, domain: string) => {
  if (!user) return false;
  if (user?.Role == "Admin") return true;
  const [res, error] = await CleanPromise<
    AxiosResponse<{ message: string; statusCode: 200 }>,
    AxiosError
  >(
    api.post(`/page/${domain}/stats`, {
      id: user.id,
    })
  );
  if (error) return false;
  if (res && res.status != 200) return false;
  return true;
};
