"use client";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import FormUser from "../FormUser";
import { User } from "@/modules/users/users.service";
import { CircleStackIcon, PlusIcon } from "@heroicons/react/24/outline";
import { UserFormData, userSchema } from "@/schemas/user.schema";
import { useCreateUser } from "@/modules/users/hooks/users";

interface UserCreateModalProps {
  isOpen: boolean;
  page: number;
  onClose: () => void;
  onCreated: (user: User) => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = (props) => {
  const { isOpen, page, onClose, onCreated } = props;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      status: "ACTIVE",
      password: "",
    },
  });
  const queryClient = useQueryClient();

  const mutate = useCreateUser(onCreated);

  const idForm = "create-user";

  const onSubmit: SubmitHandler<UserFormData> = (formValues) => {
    const user: User = {
      ...formValues,
      email: formValues.email,
      status: "ACTIVE",
    };

    mutate(user, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`users_list_${page}`],
          exact: false,
        });
        reset();
        onClose();
      },
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-101" onClose={onClose}>
        {/* dark background */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-6xl transform overflow-hidden rounded-md text-left align-middle shadow-xl transition-all bg-white dark:bg-gray-800">
                {/* Ícone de Fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <span className="sr-only">Close modal</span>
                  <XMarkIcon
                    className="h-8 w-8 text-zinc-950 dark:text-gray-100 cursor-pointer"
                    aria-hidden="true"
                  />
                </button>

                <div className="flex flex-col gap-2 w-full p-8 mx-auto bg-gray-300 dark:bg-zinc-900">
                  <Dialog.Title className="text-3xl font-semibold text-zinc-950 dark:text-gray-100 mb-0 flex flex-row gap-2 items-center">
                    <PlusIcon className="w-6 h-6" /> Add User
                  </Dialog.Title>
                </div>

                <div className="p-2 space-y-2">
                  <div className="w-full h-full">
                    <FormUser
                      idForm={idForm}
                      handleSubmit={handleSubmit}
                      onSubmit={onSubmit}
                      register={register}
                      setValue={setValue}
                      errors={errors}
                    />

                    <div className="h-auto justify-end items-end flex flex-row gap-2 p-4 pb-1 border-t border-gray-300">
                      <button
                        type="submit"
                        form={idForm}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        <CircleStackIcon className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserCreateModal;
