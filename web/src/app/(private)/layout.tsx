"use client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useUsersStore } from "@/modules/users/stores/users.store";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUsersStore((s) => s.user);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 dark:bg-zinc-950 text-zinc-950 dark:text-white duration-300">
      {/* Menu / Navbar */}
      <nav className="w-full bg-white dark:bg-zinc-900 border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand & Links */}
            <div className="flex items-center gap-8">
              <Link href="/home" className="flex items-center gap-2 group">
                <div className="px-2 min-w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
                  UM
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Users <span className="text-blue-600">Management</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/home"
                  className="text-sm font-medium text-gray-500 dark:text-gray-200 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/users"
                  className="text-sm font-medium text-gray-500 dark:text-gray-200 hover:text-blue-600 transition-colors"
                >
                  Users
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 pr-6 border-r border-gray-100">
                <ThemeToggle />
              </div>

              <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
                    {user?.last_name}, {user?.first_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
                    {user?.email}
                  </p>
                </div>

                {/* User's Avatar */}
                <div className="px-2 min-w-10 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-md flex items-center justify-center text-white font-medium shadow-inner">
                  {user?.first_name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-all duration-200 border border-transparent hover:border-red-100 cursor-pointer"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="h-full flex items-center justify-center bg-transparent py-4">
        <div className="max-w-7xl w-full animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-8 rounded-md shadow-xl border border-gray-100 dark:border-gray-700 text-center items-center justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
