"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import ConsolesList from "./consoles.json";
import { GenericCart } from "../carrito";

interface Console {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img: string;
  marca: string;
  lanzamiento: string;
}

interface ConsoleProps {
  console: Console;
  onAdd: (console: Console) => void;
}

interface CarritoProps {
  carrito: Console[];
  onRemove: (index: number) => void;
}

const consoles: Console[] = ConsolesList;

function ConsoleCard({ console, onAdd }: ConsoleProps) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="producto-card">
        <a href={`/consolas/${console.id}`} className="producto-link">
          <div className="producto-img">
            <img src={console.img} alt={console.nombre} className="img-fluid" />
          </div>
          <div className="producto-info text-center mt-2">
            <h5 className="producto-nombre">{console.nombre}</h5>
            <p className="producto-precio">{console.precio}</p>
          </div>
        </a>
        <button
          onClick={() => onAdd(console)}
          className="btn btn-primary mt-2 w-100"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
export default function Page() {
  const [carrito, setCarrito] = useState<Console[]>([]);

  const agregar = (c: Console) => setCarrito([...carrito, c]);
  const eliminar = (index: number) =>
    setCarrito(carrito.filter((_, i) => i !== index));

  return (
    <>
      <Head>
        <title>Tienda de Consolas</title>
      </Head>

      <div className="container mt-4">
        <div className="row">
          {consoles.map((c) => (
            <ConsoleCard key={c.id} console={c} onAdd={agregar} />
          ))}
        </div>

        {/* ✅ Aquí va el carrito */}
        <GenericCart
          items={carrito}
          onRemove={eliminar}
          getPrice={(c) => parseFloat(c.precio.replace(/\./g, ""))}
          renderItem={(c) => (
            <div className="d-flex align-items-center">
              <img src={c.img} width="50" className="me-2" />
              <div>
                <p className="mb-0">{c.nombre}</p>
                <p className="mb-0">${c.precio}</p>
              </div>
            </div>
          )}
          title="Carrito de Consolas"
        />
      </div>
    </>
  );
}
