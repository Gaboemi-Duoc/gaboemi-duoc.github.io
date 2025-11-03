"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Simplified interface for cart items - only essential details
export interface CartItem {
  id: number;
  nombre: string;
  precio: string;
  img: string;
  tipo: "producto" | "consola";
}

interface CartContextType {
  carrito: CartItem[];
  agregarAlCarrito: (item: CartItem) => void;
  eliminarDelCarrito: (index: number) => void;
  actualizarCantidad: (index: number, nuevaCantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
  getItemCount: (id: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("carrito");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event("cartUpdated"));
  }, [carrito]);

  const agregarAlCarrito = (item: CartItem) => {
    setCarrito([...carrito, item]);
  };

  const eliminarDelCarrito = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(index);
      return;
    }

    const item = carrito[index];
    const newCarrito = [...carrito];

    // Remove all instances of this item
    const filteredCarrito = newCarrito.filter((p) => p.id !== item.id);

    // Add the correct quantity
    for (let i = 0; i < nuevaCantidad; i++) {
      filteredCarrito.push(item);
    }

    setCarrito(filteredCarrito);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  const totalItems = carrito.length;

  const totalPrecio = carrito.reduce(
    (acc, item) => acc + parseFloat(item.precio.replace(/\./g, "")),
    0
  );

  const getItemCount = (id: number) => {
    return carrito.filter((item) => item.id === id).length;
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        totalItems,
        totalPrecio,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
