"use client";

import { useCart, CartItem } from "./carritoContext";

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
  tipo?: "producto" | "consola";
  marca?: string;
}

interface ProductoProps {
  prod: Producto;
  linkHref?: string;
  buttonText?: string;
  buttonClass?: string;
  itemType?: "producto" | "consola";
}

export function ProductoCard({
  prod,
  linkHref,
  buttonText = "Agregar al carrito",
  buttonClass = "btn-success",
  itemType = "producto",
}: ProductoProps) {
  const { agregarAlCarrito } = useCart();

  // Default link based on item type
  const defaultLink =
    itemType === "consola" ? `/consolas/${prod.id}` : `/productos/${prod.id}`;
  const href = linkHref || defaultLink;

  // Create cart item from product data
  const cartItem: CartItem = {
    id: prod.id,
    nombre: prod.nombre,
    precio: prod.precio,
    img: prod.img,
    tipo: itemType,
  };

  const handleAddToCart = () => {
    agregarAlCarrito(cartItem);
  };

  return (
    <div
      className="mb-4 d-inline-block"
      style={{
        width: "240px",
        height: "400px",
        margin: "0 8px",
      }}
    >
      <div
        className="producto-card d-flex flex-column bg-dark text-white rounded-3 overflow-hidden border border-secondary h-100" // Changed rounded to rounded-3 for more rounding
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <a
          href={href}
          className="producto-link text-decoration-none text-white flex-grow-1 d-flex flex-column"
          style={{
            textDecoration: "none",
            flex: "1 1 auto",
          }}
        >
          <div
            className="producto-img"
            style={{
              height: "180px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={prod.img}
              alt={prod.nombre}
              className="img-fluid w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="producto-info text-center px-3 py-3 d-flex flex-column justify-content-between flex-grow-1" // Increased padding to px-3 py-3
            style={{
              minHeight: "0",
            }}
          >
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <h6
                className="producto-nombre fw-bold mb-2"
                style={{
                  color: "#ffffff",
                  fontSize: "1rem",
                  lineHeight: "1.2",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={prod.nombre}
              >
                {prod.nombre}
              </h6>
              <p className="producto-precio text-warning fw-bold fs-6 mb-2">
                {" "}${prod.precio}
              </p>
            </div>
          </div>
        </a>
        <div
          className="px-3 pb-3 pt-0"
          style={{
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleAddToCart}
            className={`btn ${buttonClass} w-100 fw-bold`}
            style={{
              padding: "0.6rem 0.8rem", 
              fontSize: "0.9rem",
              borderRadius: "12px",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
