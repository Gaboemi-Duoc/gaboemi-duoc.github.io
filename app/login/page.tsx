"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import userService from "../service/userService";
import { LoginRequest, User } from "../service/userService";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  data?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      window.location.href = "/"
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    try {
      const loginRequest: LoginRequest = {
        username: username,
        password: password
      };

      const response = await userService.login(
        loginRequest
      );

      if (response.status === 200) {
        await handleSuccessfulLogin();
      }

    } catch (error: unknown) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async () => {
    setMensaje("¡Inicio de sesión exitoso!");
    
    try {
      const user: User = {
        id: Date.now(),
        nombre: username,
        correo: `${username}@example.com`, // You might want to get this from your API
        username: username
      };

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/";
    } catch (userError) {
      console.error("Error fetching user details:", userError);
      const basicUser: User = {
        id: Date.now(),
        nombre: username,
        correo: `${username}@example.com`,
        username: username
      };
      localStorage.setItem("currentUser", JSON.stringify(basicUser));
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/";
    }
  };

  const handleLoginError = (error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status === 401) {
          setMensaje("Credenciales inválidas. Por favor, verifique su nombre de usuario y contraseña.");
        } else if (error.response.status === 500) {
          setMensaje("Error del servidor. Por favor, intente más tarde.");
        } else {
          const errorData = error.response.data as ApiErrorResponse;
          setMensaje(errorData.message || errorData.error || errorData.data || "Error al iniciar sesión");
        }
      } else if (error.request) {
        setMensaje("Error de conexión. Verifique su conexión a internet.");
      } else {
        setMensaje("Error inesperado. Por favor, intente nuevamente.");
      }
    } else if (error instanceof Error) {
      setMensaje(`Error: ${error.message}`);
    } else {
      setMensaje("Error desconocido. Por favor, intente nuevamente.");
    }
    console.error("Login error:", error);
  };

  // Test different endpoints
  const testEndpoints = async () => {
    setMensaje("Probando endpoints...");
    
    try {
      // Test base URL
      const baseTest = await userService.testConnection();
      setMensaje(prev => prev + ` ✓ Servidor activo (${baseTest.status})`);
    } catch (error) {
      setMensaje("❌ No se puede conectar al servidor Spring Boot");
      return;
    }

    // Test if we can reach any user endpoint
    try {
      const userTest = await userService.getUserByID(1); // Try to get any user
      setMensaje(prev => prev + " ✓ Endpoint de usuario funciona");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setMensaje(prev => prev + " ❌ Endpoint /api/usuario no encontrado");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>
            {/* Debug buttons */}
      <div className="mb-4 space-y-2">
        <button 
          onClick={testEndpoints}
          className="w-full text-sm py-1 bg-blue-500 text-white rounded"
          type="button"
        >
          Probar Endpoints
        </button>
        <p className="text-xs text-gray-600 text-center">
          Si falla, verifique que Spring Boot esté ejecutándose en puerto 8080
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            mensaje.includes("éxito") ? "text-green-600" : "text-red-600"
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