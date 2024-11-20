import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";
import { IUser } from "@/interface/User.interface";

export async function IsAuthenticated(
  CookieStore: ReadonlyRequestCookies
): Promise<[IUser | null, Error | null]> {
  if (!CookieStore) return [null, new Error()];
  const Client_RefreshToken = CookieStore.get("Client_RefreshToken");
  if (!Client_RefreshToken || !Client_RefreshToken?.value)
    return TryAdmin(CookieStore);
  const client_data = jwt.decode(Client_RefreshToken.value) as IUser;
  return [client_data, null];
}
export async function TryAdmin(
  CookieStore: ReadonlyRequestCookies
): Promise<[IUser | null, Error | null]> {
  if (!CookieStore) return [null, new Error()];
  const Admin_RefreshToken = CookieStore.get("Admin_RefreshToken");
  if (!Admin_RefreshToken || !Admin_RefreshToken?.value)
    return [null, new Error()];
  const Admin_data = jwt.decode(Admin_RefreshToken.value) as IUser;
  return [Admin_data, null];
}
