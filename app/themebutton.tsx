"use client";

import { useEffect, useState } from "react";

export default function ThemeButton() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Obtener tema guardado
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // APLICAR TEMA AL <html>
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // APLICAR CAMBIO
    document.documentElement.setAttribute("data-theme", newTheme);

    // Guardar
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      className="btn btn-outline-warning btn-sm d-flex align-items-center"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
    </button>
  );
}
