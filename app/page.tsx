"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import productsList from "./products.json";
import "./productos/[id]/style.css";
import { useCart, CartItem } from "./components/carritoContext";
import { ProductoCard } from "./components/productCard";

// Types (can be moved to a separate types file)
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

// Product data
const productos: Producto[] = productsList;

// Carrusel Component
function Carrusel() {
  const imagenes = [
    "/images/juegos/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
    "/images/juegos/Dispatch.jpg",
    "/images/juegos/devil-may-cry-5-4318.jpg",
  ];

  const [index, setIndex] = useState(0);

  //elemento para que cambie cada 3 seg
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % imagenes.length);
  };

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl h-[400px]">
      <div className="relative w-full h-full">
        {imagenes.map((img, i) => {
          const position = i === index ? "translate-x-0" : "translate-x-full";
          return (
            <img
              key={i}
              src={img}
              alt={`slide-${i}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ${position}`}
            />
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full z-10"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full z-10"
      >
        ›
      </button>
    </div>
  );
}

// ProductoDetalle Component
function ProductoDetalle({ producto }: { producto: Producto }) {
  const { agregarAlCarrito } = useCart();

  const cartItem: CartItem = {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    img: producto.img,
    tipo: "producto",
  };

  return (
    <div className="producto-detalle mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={producto.img}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="lead text-success">${producto.precio}</p>
          <p>{producto.descripcion}</p>
          <div className="mt-3">
            <p>
              <strong>Género:</strong> {producto.genero}
            </p>
            <p>
              <strong>Tamaño:</strong> {producto.tamano}
            </p>
            <p>
              <strong>Jugadores:</strong> {producto.jugadores}
            </p>
            <p>
              <strong>Lanzamiento:</strong> {producto.lanzamiento}
            </p>
            <p>
              <strong>Desarrollador:</strong> {producto.desarrollador}
            </p>
          </div>
          <button
            className="btn btn-success btn-lg mt-3"
            onClick={() => agregarAlCarrito(cartItem)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
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

// Main App Component
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const cssLoaded = useCssLoaded();
  const pathname = usePathname();
  const productoId = pathname
    ? parseInt(pathname.split("/").pop() || "")
    : null;
  const producto = productoId
    ? productos.find((p) => p.id === productoId)
    : null;

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
          <p className="mt-2 text-muted">Cargando GoldenCat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tienda de Videojuegos</title>
        <meta name="description" content="Tu tienda de videojuegos favorita" />
      </Head>

      <div className="container mt-4">
        <Carrusel />
        {producto ? (
          <ProductoDetalle producto={producto} />
        ) : (
          <div
            className="mt-4 text-center"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px", // Consistent gap between cards
            }}
          >
            {productos.map((prod) => (
              <ProductoCard
                key={prod.id}
                prod={prod}
                itemType="producto"
                buttonClass="btn-success"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
