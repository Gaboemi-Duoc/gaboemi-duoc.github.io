"use client";

import Link from "next/link";
import { useAuth } from "./authProvider";
import { CarritoPanel } from "./components/carritoPanel";

export function Navbar() {
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <header className="bg-dark text-white">
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        async
      />
      <div className="container d-flex justify-content-between align-items-center py-3">
        <h1 className="h4 m-0">
          <Link href="/" className="text-white text-decoration-none">
            Zmart
          </Link>
        </h1>

        <nav>
          <ul className="d-flex list-unstyled m-0 gap-3">
            <li>
              <Link href="/" className="text-white text-decoration-none">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="text-white text-decoration-none"
              >
                Juegos
              </Link>
            </li>
            <li>
              <Link
                href="/consolas"
                className="text-white text-decoration-none"
              >
                Consolas
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="text-white text-decoration-none"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div className="d-flex align-items-center gap-2">
          <CarritoPanel />
          {!isLoading && (
            <>
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-warning btn-sm text-white dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-auto-close="true"
                  >
                    Hola, {user.nombre}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link href="/perfil" className="dropdown-item">
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link href="/pedidos" className="dropdown-item">
                        Mis Pedidos
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-outline-warning btn-sm text-white"
                >
                  Iniciar sesión
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
