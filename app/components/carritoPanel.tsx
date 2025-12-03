"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./carritoContext";

export function CarritoPanel() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    totalPrecio,
    vaciarCarrito,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Close payment status message after 5 seconds
  useEffect(() => {
    if (paymentStatus) {
      const timer = setTimeout(() => {
        setPaymentStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  // Handle Webpay payment
  const handleWebpayPayment = async () => {
    if (carrito.length === 0) {
      setPaymentStatus({
        success: false,
        message: "El carrito está vacío",
      });
      setIsOpen(false);
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Generate unique buy order and session ID
      const buyOrder = `ORDER_${Date.now()}`;
      const sessionId = `SESS_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser.id || "guest";

      // Amount must be integer (remove decimals)
      const amount = Math.round(totalPrecio);

      // Return URL for Webpay response
      const returnUrl = `${window.location.origin}/pago/estado`;

      // Create Webpay transaction
      const response = await fetch("/api/webpay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyOrder,
          sessionId,
          amount,
          returnUrl,
          userId,
          cartItems: carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            tipo: item.tipo,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error response
        const errorMessage = data.message || "Failed to create payment";
        throw new Error(`${data.error || "Error"}: ${errorMessage}`);
      }

      if (!data.success) {
        throw new Error("Failed to create payment transaction");
      }

      // Store payment data in localStorage for later verification
      localStorage.setItem("pendingPayment", JSON.stringify({
        token: data.token,
        buyOrder,
        sessionId,
        amount,
        cartItems: carrito,
        timestamp: Date.now(),
      }));

      // Create and submit the form to redirect to Webpay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.url;
      form.style.display = "none";

      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token_ws";
      tokenInput.value = data.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      
      // Close cart panel before redirecting
      setIsOpen(false);
      form.submit();

      // Optionally clear cart after successful payment initiation
      // vaciarCarrito();

    } catch (error) {
      console.error("Payment error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al procesar el pago";
      
      setPaymentStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Group items by ID to calculate quantities
  const itemCounts = carrito.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Get unique items for display and sort them by ID for consistent order
  const uniqueItems = carrito
    .filter(
      (item, index, self) => index === self.findIndex((i) => i.id === item.id)
    )
    .sort((a, b) => a.id - b.id);

  const totalItems = carrito.length;

  return (
    <>
      {/* Payment Status Toast */}
      {paymentStatus && (
        <div 
          className="position-fixed top-0 end-0 mt-4 me-4" 
          style={{ zIndex: 9999, minWidth: "300px" }}
        >
          <div 
            className={`alert ${paymentStatus.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show shadow-lg`}
            role="alert"
          >
            <div className="d-flex align-items-center">
              <i className={`bi ${paymentStatus.success ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              <div>
                <strong>{paymentStatus.success ? 'Éxito' : 'Error'}</strong>
                <div className="small">{paymentStatus.message}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setPaymentStatus(null)}
              aria-label="Cerrar"
            ></button>
          </div>
        </div>
      )}

      {/* Carrito Button */}
      <div className="dropdown" ref={panelRef}>
        <button
          className="btn btn-outline-light btn-sm position-relative"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Procesando...
            </>
          ) : (
            <>
              🛒 Carrito
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </>
          )}
        </button>

        {/* Dropdown Panel */}
        <div
          className={`dropdown-menu p-3 ${isOpen ? "show" : ""}`}
          style={{
            width: "400px",
            maxWidth: "90vw",
            maxHeight: "80vh",
            overflowY: "auto",
            border: "2px solid #495057",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            right: 0,
            left: "auto",
            transform: "translateX(0)",
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "#1a1d20",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
            <h5 className="mb-0 text-warning fw-bold">🛒 Tu Carrito</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar carrito"
              disabled={isProcessing}
            ></button>
          </div>

          {carrito.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-warning mb-3" style={{ fontSize: "4rem" }}>
                🛒
              </div>
              <p className="text-warning mb-0">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div
                className="mb-3"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {uniqueItems.map((prod) => {
                  const quantity = itemCounts[prod.id];
                  const itemIndex = carrito.findIndex((i) => i.id === prod.id);

                  return (
                    <div
                      key={prod.id}
                      className="cart-item d-flex justify-content-between align-items-center mb-2 p-2 border border-secondary rounded bg-dark text-white"
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <img
                          src={prod.img}
                          alt={prod.nombre}
                          className="me-3 rounded"
                          width="50"
                          height="50"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <p
                            className="mb-1 fw-bold text-truncate text-white"
                            title={prod.nombre}
                          >
                            {prod.nombre}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 text-warning small">
                              ${prod.precio} c/u
                            </p>
                            <span className="badge bg-warning text-dark rounded-pill ms-2">
                              {quantity}
                            </span>
                          </div>
                          <p className="mb-0 text-success small fw-bold">
                            $
                            {(
                              parseFloat(prod.precio.replace(/\./g, "")) *
                              quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-1 ms-2">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            style={{ padding: "0.2rem 0.4rem" }}
                            onClick={() =>
                              actualizarCantidad(itemIndex, quantity - 1)
                            }
                            disabled={quantity <= 1 || isProcessing}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            style={{ padding: "0.2rem 0.4rem" }}
                            onClick={() =>
                              actualizarCantidad(itemIndex, quantity + 1)
                            }
                            disabled={isProcessing}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => eliminarDelCarrito(itemIndex)}
                          className="btn btn-outline-danger btn-sm"
                          style={{ padding: "0.2rem 0.4rem" }}
                          title="Eliminar todos"
                          disabled={isProcessing}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="border-top border-secondary pt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-white">
                    Total ({totalItems} items):
                  </span>
                  <span className="fw-bold text-warning fs-5">
                    ${totalPrecio.toLocaleString()}
                  </span>
                </div>

                <div className="d-flex gap-2 mb-2">
                  <button
                    onClick={vaciarCarrito}
                    className="btn btn-outline-light btn-sm flex-fill"
                    disabled={isProcessing}
                  >
                    Vaciar Carrito
                  </button>
                  <Link
                    href="/carrito"
                    className="btn btn-warning btn-sm flex-fill text-dark fw-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver Detalles
                  </Link>
                </div>
                <div className="d-grid gap-2">
                  <button
                    onClick={handleWebpayPayment}
                    disabled={isProcessing}
                    className="btn btn-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card"></i>
                        Proceder al Pago
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}