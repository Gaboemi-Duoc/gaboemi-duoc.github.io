"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import productsList from './products.json'

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
        <a href={`/?id=${prod.id}`} className="producto-link">
          <div className="producto-img">
            <img src={prod.img} alt={prod.nombre} className="img-fluid" />
          </div>
          <div className="producto-info text-center mt-2">
            <h5 className="producto-nombre">{prod.nombre}</h5>
            <p className="producto-precio">${prod.precio}</p>
          </div>
        </a>
        <button onClick={() => onAdd(prod)} className="btn btn-success mt-2 w-100">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

// Carrusel Component
function Carrusel() {
  const imagenes = [
    "/images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
    "/images/hollow-k.jpg",
    "/images/devil-may-cry-5-4318.jpg",
  ];

  return (
    <div id="carouselExample" className="carousel slide mt-3" data-bs-ride="carousel">
      <div className="carousel-inner">
        {imagenes.map((src, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img src={src} className="d-block w-100" alt={`slide-${index}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}

// Carrito Component
function Carrito({ carrito, onRemove }: CarritoProps) {
  if (carrito.length === 0) return null;
  
  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio.replace(/\./g, "")), 0);

  return (
    <div className="carrito-panel p-3 bg-light border rounded mt-3">
      {carrito.map((prod, index) => (
        <div key={index} className="carrito-item d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img src={prod.img} alt={prod.nombre} className="carrito-img me-2" width="50" />
            <div>
              <p className="mb-0">{prod.nombre}</p>
              <p className="mb-0">${prod.precio}</p>
            </div>
          </div>
          <button onClick={() => onRemove(index)} className="btn btn-sm btn-danger">X</button>
        </div>
      ))}
      <p className="mt-2"><strong>Total:</strong> ${total.toLocaleString()}</p>
    </div>
  );
}

// ProductoDetalle Component (placeholder - you'll need to implement this)
function ProductoDetalle({ producto }: { producto: Producto }) {
  return (
    <div className="producto-detalle mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={producto.img} alt={producto.nombre} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="lead">${producto.precio}</p>
          <p>{producto.descripcion}</p>
          <div className="mt-3">
            <p><strong>Género:</strong> {producto.genero}</p>
            <p><strong>Tamaño:</strong> {producto.tamano}</p>
            <p><strong>Jugadores:</strong> {producto.jugadores}</p>
            <p><strong>Lanzamiento:</strong> {producto.lanzamiento}</p>
            <p><strong>Desarrollador:</strong> {producto.desarrollador}</p>
          </div>
          <button className="btn btn-success btn-lg mt-3">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function Page() {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarAlCarrito = (producto: Producto) => setCarrito([...carrito, producto]);
  const eliminarDelCarrito = (index: number) => setCarrito(carrito.filter((_, i) => i !== index));

  const productoId = usePathname ? parseInt(usePathname.toString()) : null;
  const producto = productoId ? productos.find(p => p.id === productoId) : null;

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
            {productos.map(prod => (
              <Producto key={prod.id} prod={prod} onAdd={agregarAlCarrito} />
            ))}
          </div>
        )}
        <Carrito carrito={carrito} onRemove={eliminarDelCarrito} />
      </div>
    </>
  );
}