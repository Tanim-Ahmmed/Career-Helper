import axios from "axios";

import { getStoredAuthToken } from "@/store/auth-store";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.trim();

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
