import { IUser } from "@/interface/User.interface";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";

export type AuthState = {
  value: {
    isAuthenticated: boolean;
    accessToken: string | null;
    data: IUser | null;
  };
};

const DEFUALT_VALUE = {
  accessToken: null,
  isAuthenticated: false,
  data: null,
};

const initialState: AuthState = {
  value: DEFUALT_VALUE,
};
export const AuthSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    Login(state, action: PayloadAction<string>) {
      const decodedToken = jwt.decode(action.payload) as IUser;
      state.value = {
        accessToken: action.payload,
        isAuthenticated: true,
        data: decodedToken,
      };
    },
    LogOut(state) {
      state.value = DEFUALT_VALUE;
    },
  },
});
export const { Login, LogOut } = AuthSlice.actions;
export default AuthSlice.reducer;
