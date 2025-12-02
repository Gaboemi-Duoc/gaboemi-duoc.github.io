"use client";

import Link from "next/link";
import { useAuth } from "./authProvider";
import { CarritoPanel } from "./components/carritoPanel";
import ThemeButton from "./themebutton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductService, { Product } from "./service/productService";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Buscar productos mientras escribes
  useEffect(() => {
    if (!query) return setResults([]);

    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await ProductService.getAllProducts();
        const filtered = res.data.filter(p =>
          p.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (id: number) => {
    setQuery("");
    setResults([]);
    router.push(`/productos/${id}`); // App Router
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <header className="bg-dark text-white">
      <div className="container d-flex justify-content-between align-items-center py-3 flex-wrap">
        
        <h1 className="h4 m-0">
          <Link href="/" className="text-white text-decoration-none">Zmart</Link>
        </h1>

        <nav className="flex-grow-1 mx-3">
          <ul className="d-flex list-unstyled m-0 gap-3 flex-wrap">
            <li><Link href="/" className="text-white text-decoration-none">Inicio</Link></li>
            <li><Link href="/productos" className="text-white text-decoration-none">Juegos</Link></li>
            <li><Link href="/consolas" className="text-white text-decoration-none">Consolas</Link></li>
            <li><Link href="/contacto" className="text-white text-decoration-none">Contacto</Link></li>
          </ul>
        </nav>

        {/* Barra de búsqueda */}
        <div className="position-relative me-3" style={{ minWidth: "200px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loadingSearch && (
            <div className="spinner-border spinner-border-sm position-absolute top-50 end-0 translate-middle-y me-2"></div>
          )}
          {results.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
              {results.map(prod => (
                <li
                  key={prod.id_producto}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(prod.id_producto)}
                >
                  {prod.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sección derecha */}
        <div className="d-flex align-items-center gap-3">
          <ThemeButton />
          <CarritoPanel />
          {!isLoading && (
            <>
              {user ? (
                <div className="dropdown">
                  <button className="btn btn-outline-warning btn-sm text-white dropdown-toggle"
                          type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Hola, {user.nombre}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><Link href="/perfil" className="dropdown-item">Mi Perfil</Link></li>
                    <li><Link href="/pedidos" className="dropdown-item">Mis Pedidos</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                  </ul>
                </div>
              ) : (
                <Link href="/login" className="btn btn-outline-warning btn-sm text-white">Iniciar sesión</Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
