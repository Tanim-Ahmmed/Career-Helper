"use client";

import { create } from "zustand";

import type { AuthUser } from "@/types/auth";

const AUTH_STORAGE_KEY = "ai-career-helper-auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setSession: (payload: { token: string; user: AuthUser }) => void;
  updateUser: (user: AuthUser) => void;
  clearSession: () => void;
  hydrate: () => void;
};

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as {
      token: string;
      user: AuthUser;
    };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function writeStoredSession(payload: { token: string; user: AuthUser } | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!payload) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setSession: ({ token, user }) => {
    writeStoredSession({ token, user });
    set({
      token,
      user,
      hydrated: true,
    });
  },
  updateUser: (user) => {
    const storedSession = readStoredSession();
    if (storedSession?.token) {
      writeStoredSession({
        token: storedSession.token,
        user,
      });
    }

    set({
      user,
    });
  },
  clearSession: () => {
    writeStoredSession(null);
    set({
      token: null,
      user: null,
      hydrated: true,
    });
  },
  hydrate: () => {
    const storedSession = readStoredSession();

    set({
      token: storedSession?.token ?? null,
      user: storedSession?.user ?? null,
      hydrated: true,
    });
  },
}));

export function getStoredAuthToken() {
  return useAuthStore.getState().token ?? readStoredSession()?.token ?? null;
}
