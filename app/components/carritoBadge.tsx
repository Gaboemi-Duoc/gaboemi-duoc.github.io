"use client";

import { useEffect, useState } from "react";

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCartBadge = () => {
      const carrito = localStorage.getItem("carrito");
      if (carrito) {
        try {
          const items = JSON.parse(carrito);
          setItemCount(items.length);
        } catch (error) {
          console.error("Error parsing cart:", error);
        }
      } else {
        setItemCount(0);
      }
    };

    // Update on mount
    updateCartBadge();

    // Listen for storage events (updates from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "carrito") {
        updateCartBadge();
      }
    };

    // Listen for custom events (updates from same tab)
    const handleCartUpdate = () => {
      updateCartBadge();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  if (itemCount === 0) return null;

  return (
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
