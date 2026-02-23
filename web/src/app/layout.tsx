import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ReactQueryProvider from "@/config/providers/ReactQueryProvider";
import StoreProvider from "@/config/providers/StoreProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Management App",
  description: "User Management App - By William Barbosa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <StoreProvider />
      </body>
    </html>
  );
}
