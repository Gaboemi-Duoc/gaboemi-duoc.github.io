"use client";

import { useState } from "react";
import Head from "next/head";
import productsList from "../products.json"; // JSON de videojuegos
import { GenericCart } from "../carrito";

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

interface ProductoCardProps {
  producto: Producto;
  onAdd: (producto: Producto) => void;
}

export default function JuegosPage() {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregar = (p: Producto) => setCarrito([...carrito, p]);
  const eliminar = (index: number) =>
    setCarrito(carrito.filter((_, i) => i !== index));

  const getPrice = (p: Producto) => parseFloat(p.precio.replace(/\./g, ""));

  return (
    <>
      <Head>
        <title>Tienda de Videojuegos</title>
      </Head>

      <div className="container mt-4">
        <div className="row">
          {productsList.map((p: Producto) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="producto-card">
                <a href={`/productos/${p.id}`} className="producto-link">
                  <div className="producto-img">
                    <img src={p.img} alt={p.nombre} className="img-fluid" />
                  </div>
                  <div className="producto-info text-center mt-2">
                    <h5 className="producto-nombre">{p.nombre}</h5>
                    <p className="producto-precio">{p.precio}</p>
                  </div>
                </a>
                <button
                  onClick={() => agregar(p)}
                  className="btn btn-primary mt-2 w-100"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carrito dinámico */}
        <GenericCart
          items={carrito}
          onRemove={eliminar}
          getPrice={getPrice}
          renderItem={(p) => (
            <div className="d-flex align-items-center">
              <img src={p.img} width="50" className="me-2" />
              <div>
                <p className="mb-0">{p.nombre}</p>
                <p className="mb-0">${p.precio}</p>
              </div>
            </div>
          )}
          title="Carrito de Videojuegos"
        />
      </div>
    </>
  );
}
