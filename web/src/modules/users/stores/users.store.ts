import { create } from "zustand";
import { User } from "../users.service";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUsersStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("user_data") || "null")
      : null,

  setUser: (user) => {
    sessionStorage.setItem("user_data", JSON.stringify(user));

    set({
      user,
    });
  },
}));
