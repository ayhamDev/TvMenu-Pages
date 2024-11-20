import api from "./Api";

export const RemoveSession = (role: "Admin" | "Client") => {
  return api.get(`/auth/${role.toLowerCase()}/logout`);
};
