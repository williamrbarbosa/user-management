"use client";
import { useUsersStore } from "@/modules/users/stores/users.store";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function WelcomePage() {
  const user = useUsersStore((s) => s.user);

  return (
    <div className="w-full flex flex-col gap-2 items-start justify-start">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back
        {user && (
          <span className="ps-3">
            {user?.first_name} {user?.last_name}
          </span>
        )}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        You are now securely logged into the platform.
      </p>

      <div className="p-4 bg-blue-100 dark:bg-blue-900/10 rounded-lg text-blue-700 dark:text-blue-300 font-medium">
        <Link
          href="/users"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Manage Users.
        </Link>
      </div>
    </div>
  );
}
