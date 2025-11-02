"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nombre: string;
  correo: string;
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      // Optional: Redirect if already logged in
      // router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password }),
      });

      const data = await res.json();
      setMensaje(data.message);

      if (res.ok && data.user) {
        // Save user data to localStorage (automatic login after registration)
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");

        // Clear form
        setNombre("");
        setCorreo("");
        setPassword("");

        // Redirect to home page after successful registration
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      setMensaje("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && (
        <p
          className={`mt-4 text-center ${
            mensaje.includes("éxito") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
          {mensaje.includes("éxito") && " Serás redirigido automáticamente..."}
        </p>
      )}

      {/* Enlace a login */}
      <p className="mt-6 text-center text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-orange-500 hover:text-orange-600 font-medium transition duration-200"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
