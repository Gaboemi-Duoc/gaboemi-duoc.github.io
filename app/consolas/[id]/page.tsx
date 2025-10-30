"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ConsolesList from "../../consoles.json";
import { GenericCart } from "../../carrito";

interface Console {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img: string;
  marca: string;
  lanzamiento: string;
}

export default function ConsolePage() {
  const params = useParams();
  const id = Number(params.id);

  const consoleItem = ConsolesList.find((c: Console) => c.id === id);

  const [carrito, setCarrito] = useState<Console[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  const agregarAlCarrito = (c: Console) => {
    const nuevoCarrito = [...carrito, c];
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  if (!consoleItem)
    return <p className="text-center mt-5">Consola no encontrada</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={consoleItem.img}
            alt={consoleItem.nombre}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h1>{consoleItem.nombre}</h1>
          <p className="lead text-success">${consoleItem.precio}</p>
          <p>{consoleItem.descripcion}</p>
          <ul className="list-unstyled mt-3">
            <li>
              <strong>Marca: </strong>
              {consoleItem.marca}
            </li>
            <li>
              <strong>Lanzamiento: </strong>
              {consoleItem.lanzamiento}
            </li>
          </ul>
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={() => agregarAlCarrito(consoleItem)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* ✅ Carrito dinámico */}
      <div className="mt-5">
        <GenericCart
          items={carrito}
          onRemove={(index) =>
            setCarrito(carrito.filter((_, i) => i !== index))
          }
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
    </div>
  );
}
