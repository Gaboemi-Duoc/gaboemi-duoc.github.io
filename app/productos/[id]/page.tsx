"use client";

import { useParams } from "next/navigation";
import productsList from "../../products.json";
import "./style.css";

/*esto todavia no esta terminado, parece que puede que te de error*/
export default function ProductoPage() {
  const params = useParams();
  const id = Number(params.id);
  const producto = productsList.find((p) => p.id === id);

  if (!producto)
    return <p className="text-center mt-5">Producto no encontrado</p>;

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
          <p className="lead tex-success">${producto.precio}</p>
          <p>{producto.descripcion}</p>
          <ul className="list-unstyled mt-3">
            <li>
              <strong>Genero: </strong>
              {producto.genero}
            </li>
            <li>
              <strong>Tamaño:</strong>
              {producto.tamano}
            </li>
            <li>
              <strong>Jugadores:</strong>
              {producto.jugadores}
            </li>
            <li>
              <strong>Lanzamiento:</strong>
              {producto.lanzamiento}
            </li>
            <li>
              <strong>Desarrollador:</strong>
              {producto.desarrollador}
            </li>
          </ul>
          <button className="btn btn-success btn-lg mt-3">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
