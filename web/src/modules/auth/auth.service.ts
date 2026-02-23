import api from "@/services/api";

export type LoginPayload = {
  email: string;
  password: string;
  rememberme?: boolean;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  user_password: string;
  user_confirm_password: string;
};

export type LogoutPayload = {
  id: string;
};

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post("/auth/login", payload);
    return response;
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  logout: async () => {
    const response = await api.patch("/auth/logout");
    return response;
  },
};
