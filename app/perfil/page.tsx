"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./perfil.css";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <div className="perfil-container">

      {/* -------- IZQUIERDA: INFO DEL CLIENTE -------- */}
      <div className="perfil-main">

        <div className="perfil-header">
          <img
            src="app/public/images/defaultimage.jpg"
            className="perfil-avatar"
            alt="avatar"
          />

          <div>
            <h1 className="perfil-nombre">{user.nombre}</h1>
            <p className="perfil-correo">{user.correo}</p>

            <button className="perfil-btn">Editar Perfil</button>
          </div>
        </div>

        {/* -------- INFORMACIÓN DEL CLIENTE -------- */}
        <div className="perfil-section">
          <h2 className="section-title">Información del Cliente</h2>

          <div className="info-grid">
            <div>
              <strong>Nombre:</strong>
              <p>{user.nombre}</p>
            </div>

            <div>
              <strong>Correo:</strong>
              <p>{user.correo}</p>
            </div>

            <div>
              <strong>Dirección:</strong>
              <p>{user.direccion || "No registrada"}</p>
            </div>

            <div>
              <strong>Teléfono:</strong>
              <p>{user.telefono || "No registrado"}</p>
            </div>
          </div>
        </div>

        {/* -------- PEDIDOS RECIENTES -------- */}
        <div className="perfil-section">
          <h2 className="section-title">Pedidos Recientes</h2>

          {/* Aquí simulo pedidos, pero puedes conectar tu API */}
          <div className="pedido-card">
            <img src="https://imgur.com/igz0UQn.png" className="pedido-img" />
            <div>
              <h3>PlayStation 5 Slim</h3>
              <p>Entrega estimada: 2–4 días</p>
              <span className="pedido-status delivered">En camino</span>
            </div>
          </div>

          <div className="pedido-card">
            <img src="https://imgur.com/O0O5xZn.png" className="pedido-img" />
            <div>
              <h3>Controller Xbox Series</h3>
              <p>Entregado el 19 nov</p>
              <span className="pedido-status success">Completado</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------- DERECHA: ESTADÍSTICAS -------- */}
      <div className="perfil-side">

        <p className="side-status">Cliente Activo</p>

        <div className="side-card">
          <h3>Total gastado</h3>
          <p>$ 1,250.000 CLP</p>
        </div>

        <div className="side-card">
          <h3>Pedidos completados</h3>
          <p>8</p>
        </div>

        <div className="side-card">
          <h3>Métodos de pago</h3>
          <p>Visa termina en 4580</p>
        </div>

        <div className="side-card">
          <h3>Miembro desde</h3>
          <p>2023</p>
        </div>
      </div>
    </div>
  );
}
