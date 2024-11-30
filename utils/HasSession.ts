import { IUser } from "@/interface/User.interface";
import jwt from "jsonwebtoken";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// Prioritize Admin over Client
export async function HasSession(
  CookieStore: ReadonlyRequestCookies
): Promise<IUser | null> {
  // Check for Admin session first
  const adminData = await TryAdmin(CookieStore);
  if (adminData) return adminData;

  // If no Admin session, check for Client session
  return TryClient(CookieStore);
}

// Check for Admin Refresh Token
export async function TryAdmin(
  CookieStore: ReadonlyRequestCookies
): Promise<IUser | null> {
  if (!CookieStore) return null;
  const Admin_RefreshToken = CookieStore.get("Admin_RefreshToken");
  if (!Admin_RefreshToken || !Admin_RefreshToken?.value) return null;

  const Admin_data = jwt.decode(Admin_RefreshToken.value) as IUser;
  return Admin_data;
}

// Check for Client Refresh Token
export async function TryClient(
  CookieStore: ReadonlyRequestCookies
): Promise<IUser | null> {
  if (!CookieStore) return null;
  const Client_RefreshToken = CookieStore.get("Client_RefreshToken");
  if (!Client_RefreshToken || !Client_RefreshToken?.value) return null;

  const client_data = jwt.decode(Client_RefreshToken.value) as IUser;
  return client_data;
}
