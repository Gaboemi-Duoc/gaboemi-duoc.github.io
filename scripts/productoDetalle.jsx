import React from "react";
import { useParams } from "react-router-dom";
import { productos } from "./productos";

function ProductoDetalle() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === parseInt(id));

  if (!producto) {
    return <h2 className="text-center mt-5">Producto no encontrado 😢</h2>;
  }

  return (
    <main style={{ paddingTop: "4.5rem" }}>
      <div className="producto-detalle-container mt-5 p-4 d-flex flex-wrap justify-content-center align-items-start gap-4">
        <div className="producto-imagen text-center">
          <img
            src={producto.img}
            alt={producto.nombre}
            className="producto-detalle-img img-fluid rounded shadow"
          />
        </div>
        <div className="producto-detalle-info" style={{ maxWidth: "500px" }}>
          <h1>{producto.nombre}</h1>
          <p className="precio fs-4 text-success fw-bold">
            ${producto.precio.toLocaleString()}
          </p>
          <p>{producto.descripcion}</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">
              <strong>Género:</strong> {producto.genero}
            </li>
            <li className="list-group-item">
              <strong>Tamaño:</strong> {producto.tamano}
            </li>
            <li className="list-group-item">
              <strong>Jugadores:</strong> {producto.jugadores}
            </li>
            <li className="list-group-item">
              <strong>Lanzamiento:</strong> {producto.lanzamiento}
            </li>
            <li className="list-group-item">
              <strong>Desarrollador:</strong> {producto.desarrollador}
            </li>
          </ul>
          <button className="btn btn-success w-100 mb-2">Comprar Ahora</button>
          <button
            className="btn btn-secondary w-100"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductoDetalle;
