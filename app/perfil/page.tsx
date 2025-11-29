"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./perfil.css";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Catálogo de imágenes disponibles
  const avatarCatalog = [
    "images/perfiles/avatar1.jpg",
    "images/perfiles/avatar2.jpg",
    "images/perfiles/avatar3.jpg",
    "images/perfiles/avatar4.jpg",
    "images/perfiles/avatar5.jpg",
    "images/perfiles/defaultimage.jpg"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, []);

  // Cambiar avatar del usuario
  const handleAvatarSelect = (img) => {
    const updatedUser = { ...user, avatar: img };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCatalogOpen(false);
  };

  if (!user) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-main">

        <div className="perfil-header">
          
          {/* FOTO DE PERFIL */}
          <div className="avatar-container">
            <img
              src={user.avatar || "images/defaultimage.jpg"}
              className="perfil-avatar"
              alt="avatar"
            />

            {/* 🔧 Botón lápiz flotante */}
            <button
              className="avatar-edit-btn"
              onClick={() => setCatalogOpen(true)}
              aria-label="Editar foto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="black" strokeWidth="2"/>
                <path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="black" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          <div>
            <h1 className="perfil-nombre">{user.nombre}</h1>
            <p className="perfil-correo">{user.correo}</p>
          </div>
        </div>

        {/* ---- CATÁLOGO DE AVATARES ---- */}
        {catalogOpen && (
          <div className="catalogo-overlay">
            <div className="catalogo-box">
              <h3>Elige tu foto de perfil</h3>

              <div className="catalogo-grid">
                {avatarCatalog.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="catalogo-img"
                    onClick={() => handleAvatarSelect(img)}
                  />
                ))}
              </div>

              <button
                className="catalogo-cerrar"
                onClick={() => setCatalogOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

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

          <h3>PlayStation 5 Slim</h3>
          <p>Entrega estimada: 2–4 días</p>
          <div className="pedido-card">
            <img src="images/consolas/psFalsa.jpg" className="pedido-img" />
            <div>
              <span className="pedido-status delivered">En camino</span>
            </div>
          </div>

          <h3>Controller Xbox Series</h3>
          <p>Entregado el 19 nov</p>
          <div className="pedido-card">
            <img src="images/consolas/xboxX.png" className="pedido-img" />
            <div>
              <span className="pedido-status success">Completado</span>
            </div>
          </div>
        </div>

      </div>

      {/* -------- DERECHA -------- */}
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
