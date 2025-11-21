"use client";

import { useEffect, useState } from "react";

export default function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Cargar del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
      setTheme(saved);
      return;
    }

    // Si no existe, se usa modo automático
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoTheme = prefersDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", autoTheme);
    setTheme(autoTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!theme) return null;

  return (
    <button className="btn btn-secondary" onClick={toggleTheme}>
      {theme === "dark" ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
    </button>
  );
}
