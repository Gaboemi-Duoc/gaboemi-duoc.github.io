"use client";

import { useParams } from "next/navigation";
import productsList from "../../products.json";
import { useCart, CartItem } from "../../components/carritoContext";
import "./style.css";

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

export default function ProductoPage() {
  const { agregarAlCarrito, getItemCount } = useCart();
  const params = useParams();
  const id = Number(params.id);
  const producto = productsList.find((p) => p.id === id);

  if (!producto)
    return <p className="text-center mt-5">Producto no encontrado</p>;

  // Create simplified cart item with only essential details
  const cartProducto: CartItem = {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    img: producto.img,
    tipo: "producto",
  };

  const itemCount = getItemCount(producto.id);

  return (
    <div className="container mt-5">
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
          <ul className="list-unstyled mt-3">
            <li>
              <strong>Genero: </strong>
              {producto.genero}
            </li>
            <li>
              <strong>Tamaño: </strong>
              {producto.tamano}
            </li>
            <li>
              <strong>Jugadores: </strong>
              {producto.jugadores}
            </li>
            <li>
              <strong>Lanzamiento: </strong>
              {producto.lanzamiento}
            </li>
            <li>
              <strong>Desarrollador: </strong>
              {producto.desarrollador}
            </li>
            {itemCount > 0 && (
              <li>
                <strong>En carrito: </strong>
                <span className="badge bg-primary">{itemCount}</span>
              </li>
            )}
          </ul>
          <button
            className="btn btn-success btn-lg mt-3"
            onClick={() => agregarAlCarrito(cartProducto)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
