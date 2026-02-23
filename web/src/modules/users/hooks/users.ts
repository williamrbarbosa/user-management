import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { messages } from "@/config/messages";
import { useAppStore } from "@/store";
import { User, UsersData, usersService } from "../users.service";

const QUERY_KEY_LIST = "users_list";
const QUERY_KEY = "user";

export const useGetUsers = (page: number) => {
  const { setLoader, setToast } = useAppStore();

  const { data, isError, isLoading } = useQuery<UsersData, Error>({
    queryKey: [`${QUERY_KEY_LIST}_${page}`],
    queryFn: async () => {
      setLoader(true);
      const response = await usersService.getUsers(page);

      setLoader(false);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setLoader(true);
  }, [isError, setLoader]);

  useEffect(() => {
    if (!isLoading) {
      setLoader(false);
    }
  }, [isLoading, setLoader]);

  useEffect(() => {
    if (isError) {
      setLoader(false);
      setToast({
        show: true,
        type: "error",
        message: messages.USER_LOAD_ERROR_MESSAGE,
      });
    }
  }, [isError, setLoader, setToast]);

  return data;
};

export const useExcludeUser = () => {
  const { setLoader, setToast } = useAppStore();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: string) => {
      setLoader(true);
      return usersService.delete(id);
    },
    onSuccess: (resp) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_LIST],
      });

      setToast({
        show: true,

        type: resp.data.error ? "error" : "success",

        message: resp.data.message || messages.USER_DELETE_SUCCESS_MESSAGE,
      });
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    },
    onError: (error) => {
      setToast({
        show: true,
        type: "error",
        message: error.message || messages.USER_DELETE_ERROR_MESSAGE,
      });
      setLoader(false);
    },
  });

  return mutate;
};

export const useCreateUser = (onCreated?: (user: User) => void) => {
  const { setLoader, setToast } = useAppStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (payload: User) => {
      setLoader(true);
      return usersService.create(payload);
    },
    onSuccess: (resp) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_LIST],
      });
      setToast({
        show: true,

        type: resp.data.error ? "error" : "success",

        message: resp.data.message || messages.USER_CREATE_SUCCESS_MESSAGE,
      });
      onCreated?.(resp.data as User);
      setLoader(false);
    },
    onError: (error) => {
      setToast({
        show: true,
        type: "error",
        message: error.message || messages.USER_CREATE_ERROR_MESSAGE,
      });
      setLoader(false);
    },
  });

  return mutate;
};

export const useGetUserById = (id: string) => {
  const { setLoader, setToast } = useAppStore();

  const { data, isError, isLoading } = useQuery<User, Error>({
    queryKey: [`${QUERY_KEY}_${id}`],
    queryFn: async () => {
      const response = await usersService.getUserById(id);
      return response.data;
    },
  });

  useEffect(() => {
    setLoader(true);
  }, [isError, setLoader]);

  useEffect(() => {
    if (!isLoading) {
      setLoader(false);
    }
  }, [isLoading, setLoader]);

  useEffect(() => {
    if (isError) {
      setLoader(false);
      setToast({
        show: true,
        type: "error",
        message: messages.USER_LOAD_ERROR_MESSAGE,
      });
    }
  }, [isError, setLoader, setToast]);

  return data;
};

export const useEditUser = (id: string, onEdited?: (user: User) => void) => {
  const { setLoader, setToast } = useAppStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (payload: User) => {
      setLoader(true);
      return usersService.update(id, payload);
    },
    onSuccess: (resp) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_LIST, `${QUERY_KEY}_${id}`],
      });
      setToast({
        show: true,

        type: resp.data.error ? "error" : "success",

        message: resp.data.message || messages.USER_EDIT_SUCCESS_MESSAGE,
      });
      onEdited?.(resp.data as User);
      setLoader(false);
    },
    onError: (error) => {
      setToast({
        show: true,
        type: "error",
        message: error.message || messages.USER_EDIT_ERROR_MESSAGE,
      });
      setLoader(false);
    },
  });

  return mutate;
};

export type { User };
