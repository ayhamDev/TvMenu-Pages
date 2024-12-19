import api from "@/utils/Api";
import axios from "axios";

export const GetAll = async (domain: string) => {
  return axios.get(`/api/theme`).then((res) => res.data);
};
