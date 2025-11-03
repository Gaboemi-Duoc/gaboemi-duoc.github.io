"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import productsList from "../products.json";
import { useCart, CartItem } from "../components/carritoContext";
import { ProductoCard } from "../components/productCard";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img: string;
  genero: string;
  tamano: string;
  jugadores: number;
  lanzamiento: string;
  desarrollador: string;
}

// CSS loading check hook
function useCssLoaded() {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    const checkCssLoaded = () => {
      // Check if Bootstrap CSS is loaded by testing a Bootstrap-specific class
      const testElement = document.createElement("div");
      testElement.className = "container";
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded =
        computedStyle.display !== "inline" && computedStyle.maxWidth !== "";

      document.body.removeChild(testElement);
      return isLoaded;
    };

    const waitForCss = () => {
      if (checkCssLoaded()) {
        setCssLoaded(true);
      } else {
        // If not loaded yet, check again after a short delay
        const interval = setInterval(() => {
          if (checkCssLoaded()) {
            setCssLoaded(true);
            clearInterval(interval);
          }
        }, 50);

        // Fallback: if CSS doesn't load within 3 seconds, proceed anyway
        const timeout = setTimeout(() => {
          setCssLoaded(true);
          clearInterval(interval);
        }, 3000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", waitForCss);
    } else {
      waitForCss();
    }

    // Also listen for window load event as backup
    window.addEventListener("load", waitForCss);

    return () => {
      window.removeEventListener("load", waitForCss);
      document.removeEventListener("DOMContentLoaded", waitForCss);
    };
  }, []);

  return cssLoaded;
}

export default function JuegosPage() {
  const [mounted, setMounted] = useState(false);
  const cssLoaded = useCssLoaded();
  const { agregarAlCarrito } = useCart();

  const createCartItem = (producto: Producto): CartItem => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    img: producto.img,
    tipo: "producto",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner until both mounted and CSS is loaded
  if (!mounted || !cssLoaded) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Cargando estilos...</span>
          </div>
          <p className="mt-2 text-muted">Cargando juegos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Juegos - Tienda de Videojuegos</title>
        <meta name="description" content="Descubre nuestros videojuegos" />
      </Head>

      <div className="container mt-4">
        <h1 className="mb-4">Nuestros Juegos</h1>
        <div
          className="text-center"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {productsList.map((prod: Producto) => (
            <ProductoCard
              key={prod.id}
              prod={prod}
              itemType="producto"
              buttonClass="btn-success"
            />
          ))}
        </div>
      </div>
    </>
  );
}
