import api from "@/utils/Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import {
  LogOut as LogOutAdmin,
  Login as SetAdminLogin,
} from "../store/slice/AdminAuthSlice";
import {
  LogOut as LogOutClient,
  Login as SetClientLogin,
} from "../store/slice/ClientAuthSlice";
import { CleanPromise } from "@/utils/CleanPromise";
import { RemoveSession } from "@/utils/RemoveSession";

const useAuth = () => {
  const admin = useSelector((state: RootState) => state.adminAuth.value);
  const client = useSelector((state: RootState) => state.clientAuth.value);
  const dispatch = useDispatch();

  return {
    admin: admin,
    client: client,
    async SwitchToClient(id: string) {
      try {
        const Results = await api.post(
          `/auth/switch/client`,
          {
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${admin.accessToken}`,
            },
          }
        );
        if (Results?.data?.Token) {
          dispatch(SetClientLogin(Results?.data?.Token));
        }
        return [Results, null];
      } catch (err) {
        return [null, err];
      }
    },
    async AdminLogin(
      email: string,
      password: string,
      callback: Function,
      callbackURL?: string
    ) {
      try {
        const Results = await api.post(`/auth/admin`, {
          email,
          password,
        });

        if (callbackURL) return (location.href = callbackURL);
        if (Results?.data?.Token) {
          dispatch(SetAdminLogin(Results?.data?.Token));
        }
        return [Results, null];
      } catch (err) {
        return [null, err];
      } finally {
        callback();
      }
    },
    async ClientLogin(
      email: string,
      password: string,
      callback: Function,
      callbackURL?: string
    ) {
      try {
        const Results = await api.post(`/auth/client`, {
          email,
          password,
        });
        if (callbackURL) return (location.href = callbackURL);

        if (Results?.data?.Token) {
          dispatch(SetClientLogin(Results?.data?.Token));
        }
        return [Results, null];
      } catch (err) {
        return [null, err];
      } finally {
        callback();
      }
    },
    async AdminLogOut() {
      const [res, error] = await CleanPromise(RemoveSession("Admin"));
      if (res) return dispatch(LogOutAdmin());
    },
    async ClientLogOut() {
      const [res, error] = await CleanPromise(RemoveSession("Client"));
      if (res) return dispatch(LogOutClient());
    },
    LogOutAll() {
      dispatch(LogOutAdmin());
      dispatch(LogOutClient());
      return true;
    },
    AdminLoginWithToken(token: string) {
      dispatch(SetAdminLogin(token));
    },
    ClientLoginWithToken(token: string) {
      dispatch(SetClientLogin(token));
    },
  };
};

export default useAuth;
