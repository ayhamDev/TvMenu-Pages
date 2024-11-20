import api from "./Api";

export const RefreshToken = async (role: "Admin" | "Client") => {
  return api.get<{ Token: string }>(
    `/auth/${role.toLocaleLowerCase()}/refresh`
  );
};
