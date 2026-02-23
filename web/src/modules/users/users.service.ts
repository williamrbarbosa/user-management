import api from "@/services/api";

export type User = {
  id?: string;

  first_name: string;
  last_name: string;
  email: string;
  password?: string;

  status: string;

  login_count?: number;

  created_at?: Date;
  updated_at?: Date;
};

export type UsersData = {
  data: User[];
  meta: { total: number; page: number; lastPage: number };
};

export const usersService = {
  create: async (payload: User) => {
    const response = await api.post("users", payload);
    return response;
  },
  update: async (id: string, payload: User) => {
    const response = await api.put(`users/${id}`, payload);
    return response;
  },
  delete: async (id: string) => {
    const response = await api.delete(`users/${id}`);
    return response;
  },
  getUsers: async (page = 1) => {
    const response = await api.get<UsersData>(`users?page=${page}`);
    return response;
  },
  getUserById: async (id: string) => {
    const response = api.get<User>(`users/${id}`);
    return response;
  },
};
