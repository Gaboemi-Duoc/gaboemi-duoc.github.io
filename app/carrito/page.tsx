"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function CartPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  // Ejemplo: cargar carrito desde localStorage o API
  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <main className="container mt-5" style={{ paddingTop: "2rem" }}>
      <h1>Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div className="row g-3">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="col-12 border rounded p-3 d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{item.nombre}</h5>
                <p className="mb-0">
                  Precio: ${item.precio} x {item.cantidad}
                </p>
              </div>
              <div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    setCarrito(carrito.filter((i) => i.id !== item.id))
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-end mt-4">
        <h5>Total: ${total}</h5>
        <Link href="/checkout" className="btn btn-warning mt-2">
          Ir a pagar
        </Link>
      </div>
    </main>
  );
}
