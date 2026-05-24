import { api } from "@/services/api";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export async function login(payload: LoginPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: AuthResponse;
  }>("/auth/login", payload);

  return data.data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: AuthResponse;
  }>("/auth/register", payload);

  return data.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function fetchCurrentUser() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/auth/me");

  return data.data;
}
