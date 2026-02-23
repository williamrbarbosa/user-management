import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/modules/users/users.service";
import api from "@/services/api";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, sessionId: string, user: User) => void;
  terminateSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("accessToken") || null,
  isAuthenticated: !!Cookies.get("accessToken"),

  setSession: (token, sessionId, user) => {
    localStorage.setItem("accessToken", token);
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("user_data", JSON.stringify(user));
    Cookies.set("accessToken", token, { expires: 7 }); // Expires in 7 days

    api.defaults.headers.common.Authorization = token;
    api.defaults.headers.common.SessionId = `${sessionId}`;

    set({ token, isAuthenticated: true });

    set({
      token,
      isAuthenticated: true,
    });
  },

  terminateSession: () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("user_data");
    Cookies.remove("accessToken");

    delete api.defaults.headers.common.Authorization;
    delete api.defaults.headers.common.SessionId;

    set({ token: null, isAuthenticated: false });
  },
}));
