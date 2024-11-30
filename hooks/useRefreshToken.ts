import axios, { AxiosError, AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "./useAuth";
import { IUser } from "@/interface/User.interface";
import { CleanPromise } from "@/utils/CleanPromise";
import api from "@/utils/Api";
import { RemoveSession } from "@/utils/RemoveSession";
import { RefreshToken } from "@/utils/RefreshToken";

const useRefreshToken = (user: IUser) => {
  const {
    admin,
    client,
    AdminLoginWithToken,
    ClientLoginWithToken,
    AdminLogOut,
    ClientLogOut,
  } = useAuth();

  const [InitalLoginState, SetInitalLoginState] = useState<{
    client: boolean;
    admin: boolean;
  }>({ admin: false, client: false });

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (user.Role === "Admin" && admin.accessToken) {
          config.headers.Authorization = `Bearer ${admin.accessToken}`;
        } else if (user.Role === "Client" && client.accessToken) {
          config.headers.Authorization = `Bearer ${client.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const apiinterceptors = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error instanceof AxiosError) {
          const originalRequest = error.config;
          if (
            error.response?.status === 401 &&
            originalRequest &&
            typeof originalRequest?.headers?.Authorization == "string"
          ) {
            const results =
              originalRequest?.headers?.Authorization?.match(/^Bearer\s(.+)$/);

            if (results) {
              const user = jwt.decode(results[1]) as IUser;
              try {
                const res = await RefreshToken(user.Role);
                if (res?.status === 200 && res?.data?.Token) {
                  user.Role === "Client"
                    ? ClientLoginWithToken(res.data.Token)
                    : AdminLoginWithToken(res.data.Token);
                  console.log("Token Refreshed");

                  originalRequest.headers[
                    "Authorization"
                  ] = `Bearer ${res.data.Token}`;
                  return api(originalRequest);
                } else {
                  return user.Role === "Client"
                    ? ClientLogOut()
                    : AdminLogOut();
                }
              } catch (err) {
                return Promise.reject(err);
              }
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(apiinterceptors);
    };
  }, [admin, client]);

  useEffect(() => {
    const fetchNewTokenIfUnauthenticated = async () => {
      if (user.Role == "Client" && !client.accessToken) {
        const [ClientRes, ClientError] = await CleanPromise(
          RefreshToken("Client")
        );
        if (ClientRes?.data?.Token) {
          ClientLoginWithToken(ClientRes.data.Token);
          console.log("Client token refreshed on page load");
        } else if (ClientError) {
          ClientLogOut();
        }
      }
      SetInitalLoginState((prev) => ({ ...prev, client: true }));
    };
    fetchNewTokenIfUnauthenticated();
  }, [client, user]);
  useEffect(() => {
    // Check if admin or client user is not authenticated
    const fetchNewTokenIfUnauthenticated = async () => {
      if (user.Role == "Admin" && !admin.accessToken) {
        const [AdminRes, AdminError] = await CleanPromise(
          RefreshToken("Admin")
        );
        if (AdminRes?.data?.Token) {
          AdminLoginWithToken(AdminRes.data.Token);
          console.log("Admin token refreshed on page load");
        } else if (AdminError) {
          AdminLogOut();
        }
      }
      SetInitalLoginState((prev) => ({ ...prev, admin: true }));
    };

    fetchNewTokenIfUnauthenticated();
  }, [admin, user]);

  return { InitalLoginState };
};

export default useRefreshToken;
