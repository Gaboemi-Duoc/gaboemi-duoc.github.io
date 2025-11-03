"use client";

import { useParams } from "next/navigation";
import ConsolesList from "../../consoles.json";
import { useCart, CartItem } from "../../components/carritoContext";
import "./style.css";

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
  const { agregarAlCarrito, getItemCount } = useCart();

  const consoleItem = ConsolesList.find((c: Console) => c.id === id);

  if (!consoleItem)
    return <p className="text-center mt-5">Consola no encontrada</p>;

  // Create simplified cart item with only essential details
  const cartConsole: CartItem = {
    id: consoleItem.id,
    nombre: consoleItem.nombre,
    precio: consoleItem.precio,
    img: consoleItem.img,
    tipo: "consola",
  };

  const itemCount = getItemCount(consoleItem.id);

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
            {itemCount > 0 && (
              <li>
                <strong>En carrito: </strong>
                <span className="badge bg-primary">{itemCount}</span>
              </li>
            )}
          </ul>
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={() => agregarAlCarrito(cartConsole)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
