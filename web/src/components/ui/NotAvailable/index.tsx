import React from "react";
import Link from "next/link";

interface NotAvailableProps {
  title?: string;
  description?: string;
  action?: string;
  actionTitle?: string;
}

const NotAvailable: React.FC<NotAvailableProps> = (props) => {
  const { title, description, action, actionTitle } = props;

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title || "Page not available"}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {description || "Sorry, but this section is not available."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={action || "/login"}
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm
              hover:bg-secondary focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {actionTitle || "Sign-in"}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotAvailable;
