"use client";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { IUser } from "@/interface/User.interface";
import React, { useEffect } from "react";

const InitAuth = ({ user }: { user: IUser }) => {
  const { admin, client } = useAuth();
  const { InitalLoginState } = useRefreshToken(user);
  useEffect(() => {
    if (
      InitalLoginState.admin == true &&
      InitalLoginState.client == true &&
      !admin.accessToken &&
      !client.accessToken
    ) {
      location.href = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/${user.Role}`;
    }
  }, [admin, client, InitalLoginState]);
  return null;
};

export default InitAuth;
