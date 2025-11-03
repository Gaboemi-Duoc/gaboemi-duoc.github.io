"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../components/carritoContext";

// CSS loading check hook
function useCssLoaded() {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    const checkCssLoaded = () => {
      const testElement = document.createElement("div");
      testElement.className = "container";
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded =
        computedStyle.display !== "inline" && computedStyle.maxWidth !== "";

      document.body.removeChild(testElement);
      return isLoaded;
    };

    const waitForCss = () => {
      if (checkCssLoaded()) {
        setCssLoaded(true);
      } else {
        const interval = setInterval(() => {
          if (checkCssLoaded()) {
            setCssLoaded(true);
            clearInterval(interval);
          }
        }, 50);

        const timeout = setTimeout(() => {
          setCssLoaded(true);
          clearInterval(interval);
        }, 3000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", waitForCss);
    } else {
      waitForCss();
    }

    window.addEventListener("load", waitForCss);

    return () => {
      window.removeEventListener("load", waitForCss);
      document.removeEventListener("DOMContentLoaded", waitForCss);
    };
  }, []);

  return cssLoaded;
}

export default function CartPage() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalPrecio,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const cssLoaded = useCssLoaded();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner until both mounted and CSS is loaded
  if (!mounted || !cssLoaded) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Cargando estilos...</span>
          </div>
          <p className="mt-2 text-muted">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  const totalItems = carrito.reduce((acc, item) => acc + 1, 0);

  // Group items by ID to show quantities
  const itemQuantities = carrito.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        item: item,
        quantity: 0,
      };
    }
    acc[item.id].quantity += 1;
    return acc;
  }, {} as Record<number, { item: (typeof carrito)[0]; quantity: number }>);

  const groupedItems = Object.values(itemQuantities);

  return (
    <main
      className="container mt-4"
      style={{ paddingTop: "2rem", minHeight: "60vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-warning">🛒 Tu Carrito</h1>
        {carrito.length > 0 && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={vaciarCarrito}
          >
            Vaciar Carrito
          </button>
        )}
      </div>

      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted mb-3" style={{ fontSize: "4rem" }}>
            🛒
          </div>
          <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            ¡Descubre nuestros increíbles productos!
          </p>
          <Link href="/" className="btn btn-warning btn-lg">
            Ir a Comprar
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="mb-4">
            {groupedItems.map(({ item, quantity }) => {
              const itemIndex = carrito.findIndex((i) => i.id === item.id);

              return (
                <div
                  key={item.id}
                  className="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border border-secondary rounded bg-dark text-white"
                  style={{ borderRadius: "10px" }}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <img
                      src={item.img}
                      alt={item.nombre}
                      className="me-3 rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <h6
                        className="mb-1 fw-bold text-truncate"
                        title={item.nombre}
                      >
                        {item.nombre}
                      </h6>
                      <p className="mb-1 text-muted text-capitalize small">
                        Tipo: {item.tipo}
                      </p>
                      <p className="mb-1 text-muted small">
                        ${item.precio} c/u
                      </p>
                      <p className="mb-0 text-success fw-bold">
                        Subtotal: $
                        {(
                          parseFloat(item.precio.replace(/\./g, "")) * quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {/* Quantity controls */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-light btn-sm"
                        style={{ padding: "0.3rem 0.6rem" }}
                        onClick={() =>
                          actualizarCantidad(itemIndex, quantity - 1)
                        }
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2 fw-bold text-white">
                        {quantity}
                      </span>
                      <button
                        className="btn btn-outline-light btn-sm"
                        style={{ padding: "0.3rem 0.6rem" }}
                        onClick={() =>
                          actualizarCantidad(itemIndex, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ padding: "0.3rem 0.6rem" }}
                      onClick={() => eliminarDelCarrito(itemIndex)}
                      title="Eliminar del carrito"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="border-top border-secondary pt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark rounded text-white">
              <div>
                <h5 className="mb-1">Total de items:</h5>
                <h4 className="mb-0 text-warning">{totalItems} items</h4>
              </div>
              <div className="text-end">
                <h5 className="mb-1">Total a pagar:</h5>
                <h3 className="mb-0 text-success">
                  ${totalPrecio.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <Link href="/" className="btn btn-outline-light btn-lg">
                Seguir Comprando
              </Link>
              <Link href="/checkout" className="btn btn-warning btn-lg fw-bold">
                Proceder al Pago
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
