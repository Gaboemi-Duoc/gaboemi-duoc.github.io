"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    const data = await res.json();
    setMensaje(data.message);

    if (res.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto" }}>
      <h2>Iniciar Sesión</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem",
            background: "#ff7b00",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Iniciar sesión
        </button>
      </form>

      {/* 🔽 Mensaje de error o éxito */}
      {mensaje && (
        <p style={{ marginTop: "1rem", color: resColor(mensaje) }}>{mensaje}</p>
      )}

      {/* 🔽 Enlace a registro */}
      <p style={{ marginTop: "1rem" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-warning">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

function resColor(msg: string) {
  return msg.includes("incorrecta") || msg.includes("no existe")
    ? "red"
    : "green";
}
