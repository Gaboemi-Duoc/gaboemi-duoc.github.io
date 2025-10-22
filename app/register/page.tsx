"use client";

import { useState, FormEvent } from "react";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje("");

    const user = { nombre, correo, password };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    setMensaje(data.message);

    if (res.ok) {
      setNombre("");
      setCorreo("");
      setPassword("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto" }}>
      <h2>Crear cuenta</h2>
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
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo Electronico"
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
          Registrase
        </button>
      </form>
      {mensaje && (
        <p style={{ marginTop: "1rem", color: "green" }}>{mensaje}</p>
      )}
    </div>
  );
}
