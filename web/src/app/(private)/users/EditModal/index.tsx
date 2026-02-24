"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import FormUser from "../FormUser";
import { User } from "@/modules/users/users.service";
import { CircleStackIcon, PencilIcon } from "@heroicons/react/24/outline";
import { UserFormData, userSchema } from "@/schemas/user.schema";
import { useEditUser, useGetUserById } from "@/modules/users/hooks/users";
import Tag from "@/components/ui/Tag";

interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  page: number;
  onClose: () => void;
  onEdited: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = (props) => {
  const { user, isOpen, page, onClose, onEdited } = props;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      password: user.password,
    },
  });

  const userData = useGetUserById(user.id!, {
    initialData: user,
  });
  const sessions = userData?.sessions ?? [];

  const mutate = useEditUser(user.id!, onEdited);
  const queryClient = useQueryClient();
  const idForm = "edit-user";

  const onSubmit: SubmitHandler<UserFormData> = (formValues) => {
    const user: User = {
      ...formValues,
    };

    mutate(user, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`users_list`, page] });
        queryClient.invalidateQueries({ queryKey: [`user`, user.id!] });
        reset();
        onClose();
      },
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-101" onClose={onClose}>
        {/* Fundo escuro */}
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
                  <h5 className="text-sm font-light text-zinc-950 dark:text-gray-100 flex flex-row gap-2">
                    <PencilIcon className="w-5 h-5" /> Edit user
                  </h5>
                  {userData && (
                    <div className="flex flex-row gap-2 w-full">
                      <div className="w-full flex flex-col gap-2">
                        <Dialog.Title className="text-lg font-semibold text-zinc-950 dark:text-gray-100 mb-0">
                          {userData?.first_name} {userData?.last_name}
                        </Dialog.Title>
                        <h5 className="text-xs font-light text-zinc-950 dark:text-gray-100 -mt-2">
                          {userData?.email}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2 space-y-2">
                  <div className="w-full h-full">
                    {userData && (
                      <FormUser
                        idForm={idForm}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        register={register}
                        setValue={setValue}
                        errors={errors}
                      />
                    )}

                    <div className="h-auto justify-end items-end flex flex-row gap-2 p-4 border-y border-gray-300">
                      <button
                        type="submit"
                        form={idForm}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        <CircleStackIcon className="w-4 h-4" /> Save
                      </button>
                    </div>

                    {/* user's sessions table (further implementation example) */}
                    {sessions && (
                      <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400 text-start">
                          User last Sessions
                        </p>
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-300">
                            <tr>
                              <th className="px-6 py-4 font-semibold text-xs">
                                ID
                              </th>
                              <th className="px-6 py-4 font-semibold text-xs">
                                Created At
                              </th>
                              <th className="px-6 py-4 font-semibold text-xs">
                                Terminated At
                              </th>
                              <th className="px-6 py-4 font-semibold text-xs">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {sessions?.map((session) => {
                              const sessionStatus = !session.terminated_at
                                ? "ACTIVE"
                                : "INACTIVE";
                              return (
                                <tr
                                  key={session.id}
                                  className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <span className="font-medium text-xs">
                                      {session.id}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                    {session.created_at &&
                                      new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      }).format(new Date(session.created_at))}
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                    {session.terminated_at &&
                                      new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                      }).format(
                                        new Date(session.terminated_at),
                                      )}
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                    <Tag
                                      colorKey={sessionStatus}
                                      text={sessionStatus}
                                      grid={true}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
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

export default UserEditModal;
