"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: number;
  nombre: string;
  precio: string; // Original price as string
  precioOriginal?: number; // Original price as number for calculations
  img: string;
  tipo: "producto" | "consola";
  discount?: number; // Discount percentage (0-100)
  precioFinal?: number; // Final price after discount
}

interface CartContextType {
  carrito: CartItem[];
  agregarAlCarrito: (item: CartItem) => void;
  eliminarDelCarrito: (index: number) => void;
  actualizarCantidad: (index: number, nuevaCantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
  totalDescuento: number;
  getItemCount: (id: number) => number;
  calcularPrecioFinal: (precio: string, discount?: number) => number;
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

  // Helper function to calculate final price
  const calcularPrecioFinal = (precioStr: string, discount?: number): number => {
    const precio = parseFloat(precioStr.replace(/\./g, ""));
    if (discount && discount > 0) {
      return precio - (precio * discount / 100);
    }
    return precio;
  };

  const agregarAlCarrito = (item: CartItem) => {
    // Calculate final price if not already calculated
    const itemWithFinalPrice = {
      ...item,
      precioFinal: item.precioFinal || calcularPrecioFinal(item.precio, item.discount),
      precioOriginal: item.precioOriginal || parseFloat(item.precio.replace(/\./g, ""))
    };
    setCarrito([...carrito, itemWithFinalPrice]);
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

  // Calculate total price with discounts
  const totalPrecio = carrito.reduce(
    (acc, item) => {
      const precio = item.precioFinal || calcularPrecioFinal(item.precio, item.discount);
      return acc + precio;
    },
    0
  );

  // Calculate total discount amount
  const totalDescuento = carrito.reduce(
    (acc, item) => {
      if (item.discount && item.discount > 0) {
        const precioOriginal = item.precioOriginal || parseFloat(item.precio.replace(/\./g, ""));
        const discountAmount = precioOriginal * (item.discount / 100);
        return acc + discountAmount;
      }
      return acc;
    },
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
        totalDescuento,
        getItemCount,
        calcularPrecioFinal,
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