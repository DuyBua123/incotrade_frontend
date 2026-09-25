import axios from "axios";

const apiConfig = {
  baseURL: "https://localhost:7168/api",
  withCredentials: true,
};

export const clientApi = axios.create(apiConfig);

export const serverApi = axios.create(apiConfig);
