import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";
import { IUser } from "@/interface/User.interface";
import api from "./Api";
import { Erica_One } from "next/font/google";
export async function HasSession(
  CookieStore: ReadonlyRequestCookies
): Promise<IUser | null> {
  if (!CookieStore) return null;
  const Client_RefreshToken = CookieStore.get("Client_RefreshToken");
  if (!Client_RefreshToken || !Client_RefreshToken?.value)
    return TryAdmin(CookieStore);
  const client_data = jwt.decode(Client_RefreshToken.value) as IUser;
  return client_data;
}
export async function TryAdmin(
  CookieStore: ReadonlyRequestCookies
): Promise<IUser | null> {
  if (!CookieStore) return null;
  const Admin_RefreshToken = CookieStore.get("Admin_RefreshToken");
  if (!Admin_RefreshToken || !Admin_RefreshToken?.value) return null;
  const Admin_data = jwt.decode(Admin_RefreshToken.value) as IUser;
  return Admin_data;
}
