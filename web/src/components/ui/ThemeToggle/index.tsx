"use client";
import { useThemeStore } from "@/store/useThemeStore";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Garante que o componente só renderize o ícone no cliente
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Enquanto não estiver montado, renderiza um botão vazio ou um placeholder
  // para evitar erro de hidratação (SSR vs Client)
  if (!mounted) return <div className="p-5" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-yellow-400 transition-all hover:ring-2 ring-blue-400 cursor-pointer"
    >
      {theme === "light" ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
