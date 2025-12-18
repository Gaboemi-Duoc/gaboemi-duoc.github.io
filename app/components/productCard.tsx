"use client";

import { useCart, CartItem } from "./carritoContext";
import { useState, useEffect } from "react";

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
  cat?: string;
  discount?: number;
}

interface ProductoProps {
  prod: Producto;
  linkHref?: string;
  buttonText?: string;
  buttonTextWhenInCart?: string;
  buttonClass?: string;
  itemType?: "producto" | "consola";
}

export function ProductoCard({
  prod,
  linkHref,
  buttonText = "Agregar al carrito",
  buttonTextWhenInCart = "En carrito",
  buttonClass = "btn-success",
  itemType = "producto",
}: ProductoProps) {
  const { agregarAlCarrito, getItemCount } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Check if product is in cart and update count
  useEffect(() => {
    const count = getItemCount(prod.id);
    setItemCount(count);
    setIsInCart(count > 0);
  }, [getItemCount, prod.id]);

  // Default link based on item type
  const defaultLink = itemType === "consola" 
    ? `/consolas/${prod.id}` 
    : `/productos/${prod.id}`;
  const href = linkHref || defaultLink;

  // Calculate discounted price if applicable
  const priceNum = parseFloat(prod.precio);
  const hasDiscount = prod.discount !== undefined && prod.discount > 0;
  const discountedPrice = hasDiscount
    ? priceNum - (priceNum * prod.discount! / 100)
    : null;

  // Create cart item from product data
  const cartItem: CartItem = {
    id: prod.id,
    nombre: prod.nombre,
    precio: prod.precio,
    img: prod.img,
    tipo: itemType,
    discount: prod.discount
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
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
        className="producto-card d-flex flex-column bg-dark text-white rounded-3 overflow-hidden border border-secondary h-100"
        style={{
          width: "100%",
          height: "100%",
          position: "relative", // Added for absolute positioning context
        }}
      >
        {/* Discount badge - ONLY show when there's an actual discount */}
        {hasDiscount && (
          <div 
            className="position-absolute"
            style={{
              top: "10px",
              right: "10px",
              zIndex: 10,
            }}
          >
            <span className="badge bg-danger p-2 shadow">
              -{prod.discount}%
            </span>
          </div>
        )}

        {/* Cart count badge */}
        {isInCart && (
          <div 
            className="position-absolute"
            style={{
              top: "10px",
              left: "10px",
              zIndex: 10,
            }}
          >
            <span className="badge bg-primary p-2 shadow">
              {itemCount} en carrito
            </span>
          </div>
        )}

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
            className="producto-info text-center px-3 py-3 d-flex flex-column justify-content-between flex-grow-1"
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
              
              {/* Price display - FIXED: Cleaner conditional rendering */}
              <div className="producto-precio mb-2">
                {hasDiscount && discountedPrice ? (
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-muted text-decoration-line-through small">
                      ${prod.precio}
                    </span>
                    <div className="d-flex align-items-center gap-1">
                      <span className="text-warning fw-bold">
                        ${discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-warning fw-bold fs-6">
                    ${prod.precio}
                  </span>
                )}
              </div>

              {/* Category badge - optional */}
              {prod.cat && prod.cat !== "Videojuego" && prod.cat !== "Consolas" && (
                <span className="badge bg-secondary mb-2">
                  {prod.cat}
                </span>
              )}
              {prod.cat === "Consolas" && (
                <span className="badge bg-info mb-2">
                  Consola
                </span>
              )}
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
            className={`btn ${isInCart ? 'btn-warning' : buttonClass} w-100 fw-bold`}
            style={{
              padding: "0.6rem 0.8rem",
              fontSize: "0.9rem",
              borderRadius: "12px",
            }}
          >
            {isInCart ? buttonTextWhenInCart : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}