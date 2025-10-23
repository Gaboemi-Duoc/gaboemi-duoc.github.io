"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import productsList from "./products.json";
import "./productos/[id]/style.css";

// Types
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

interface ProductoProps {
  prod: Producto;
  onAdd: (producto: Producto) => void;
}

interface CarritoProps {
  carrito: Producto[];
  onRemove: (index: number) => void;
}

// Product data
const productos: Producto[] = productsList;

// Producto Component
function Producto({ prod, onAdd }: ProductoProps) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="producto-card">
        <a href={`/productos/${prod.id}`} className="producto-link">
          <div className="producto-img">
            <img src={prod.img} alt={prod.nombre} className="img-fluid" />
          </div>
          <div className="producto-info text-center mt-2">
            <h5 className="producto-nombre">{prod.nombre}</h5>
            <p className="producto-precio">${prod.precio}</p>
          </div>
        </a>
        <button
          onClick={() => onAdd(prod)}
          className="btn btn-success mt-2 w-100"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

// Carrusel Component
export function Carrusel() {
  const imagenes = [
    "/images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
    "/images/hollow k.jpg",
    "/images/devil-may-cry-5-4318.jpg",
  ];

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  //elemento para que cambie cada 3 seg
  /*useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagenes.length]);
  */

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
          // Determinar la posición actual de la imagen
          let position = "translate-x-full"; // fuera de pantalla derecha por defecto
          if (i === index) position = "translate-x-0"; // visible
          else if (i === prevIndex)
            position =
              direction === "next" ? "-translate-x-full" : "translate-x-full";

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
// Carrito Component
function Carrito({ carrito, onRemove }: CarritoProps) {
  if (carrito.length === 0) return null;

  const total = carrito.reduce(
    (acc, p) => acc + parseFloat(p.precio.replace(/\./g, "")),
    0
  );

  return (
    <div className="carrito-panel p-3 bg-light border rounded mt-3">
      {carrito.map((prod, index) => (
        <div
          key={index}
          className="carrito-item d-flex justify-content-between align-items-center mb-2"
        >
          <div className="d-flex align-items-center">
            <img
              src={prod.img}
              alt={prod.nombre}
              className="carrito-img me-2"
              width="50"
            />
            <div>
              <p className="mb-0">{prod.nombre}</p>
              <p className="mb-0">${prod.precio}</p>
            </div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="btn btn-sm btn-danger"
          >
            X
          </button>
        </div>
      ))}
      <p className="mt-2">
        <strong>Total:</strong> ${total.toLocaleString()}
      </p>
    </div>
  );
}

// ProductoDetalle Component (placeholder - you'll need to implement this)
function ProductoDetalle({ producto }: { producto: Producto }) {
  return (
    <div className="producto-detalle mt-4">
      <div className="row">
        <img src={producto.img} alt={producto.nombre} className="img-fluid" />
      </div>
      <div className="col-md-6">
        <h1>{producto.nombre}</h1>
        <p className="lead">${producto.precio}</p>
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
        <button className="btn btn-success btn-lg mt-3">
          agregar al carro
        </button>
      </div>
    </div>
  );
}
// Main App Component
export default function Page() {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarAlCarrito = (producto: Producto) =>
    setCarrito([...carrito, producto]);
  const eliminarDelCarrito = (index: number) =>
    setCarrito(carrito.filter((_, i) => i !== index));

  const productoId = usePathname ? parseInt(usePathname.toString()) : null;
  const producto = productoId
    ? productos.find((p) => p.id === productoId)
    : null;

  return (
    <>
      <Head>
        <title>Tienda de Videojuegos</title>
        <meta name="description" content="Tu tienda de videojuegos favorita" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        />
      </Head>

      <div className="container mt-4">
        <Carrusel />
        {producto ? (
          <ProductoDetalle producto={producto} />
        ) : (
          <div className="row justify-content-center mt-4">
            {productos.map((prod) => (
              <Producto key={prod.id} prod={prod} onAdd={agregarAlCarrito} />
            ))}
          </div>
        )}
        <Carrito carrito={carrito} onRemove={eliminarDelCarrito} />
      </div>
    </>
  );
}
