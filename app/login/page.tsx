"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  nombre: string;
  correo: string;
}

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      // Optional: Redirect if already logged in
      // window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();
      setMensaje(data.message);

      if (res.ok && data.user) {
        // Save user data to localStorage
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Optional: Also set a simple flag for quick checks
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to home page
        window.location.href = "/";
      }
    } catch (error) {
      setMensaje("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      {/* Mensaje de error o éxito */}
      {mensaje && (
        <p
          className={`mt-4 text-center ${
            mensaje.includes("Bienvenido") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}

      {/* Enlace a registro */}
      <p className="mt-6 text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-orange-500 hover:text-orange-600 font-medium transition duration-200"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
