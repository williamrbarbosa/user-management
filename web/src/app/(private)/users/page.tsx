"use client";

import { useExcludeUser, useGetUsers } from "@/modules/users/hooks/users";
import { User, UsersData } from "@/modules/users/users.service";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import UserCreateModal from "./CreateModal";
import UserEditModal from "./EditModal";
import Tag from "@/components/ui/Tag";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [userData, setUsers] = useState<UsersData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const data = useGetUsers(page);
  const excludeUser = useExcludeUser();

  // Set users from data
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const openModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      excludeUser(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [`users_list_${page}`],
            exact: false,
          });
        },
      });
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-start">
            Manage platform members.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          onClick={() => openModal()}
        >
          <PlusIcon className="w-4 h-4" /> New User
        </button>
      </div>

      {/* users table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Created At</th>
              <th className="px-6 py-4 font-semibold">Last Updated At</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {userData?.data.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  <Tag colorKey={user.status} text={user.status} grid={true} />
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {user.created_at &&
                    new Intl.DateTimeFormat("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(user.created_at))}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {user.updated_at &&
                    new Intl.DateTimeFormat("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(user.updated_at))}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                    onClick={() => openModal(user)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => user.id && handleDelete(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/30 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">
            Page {page} of {userData?.meta?.lastPage || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-md border border-gray-300 dark:border-zinc-700 disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              disabled={page >= (data?.meta?.lastPage || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-md border border-gray-300 dark:border-zinc-700 disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedUser && isModalOpen && (
        <UserEditModal
          key={selectedUser.id!}
          userData={selectedUser}
          isOpen={isModalOpen}
          page={page}
          onClose={() => setIsModalOpen(false)}
          onEdited={(updatedUser) => setSelectedUser(updatedUser)}
        />
      )}

      {!selectedUser && isModalOpen && (
        <UserCreateModal
          isOpen={isModalOpen}
          page={page}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}
