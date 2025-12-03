"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PaymentStatus {
  status: "loading" | "success" | "error" | "cancelled";
  message: string;
  transactionId?: string;
}

export default function PaymentStatusPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "loading",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token_ws = urlParams.get("token_ws");
        const TBK_TOKEN = urlParams.get("TBK_TOKEN");

        if (token_ws) {
          // User completed payment
          const response = await fetch("/api/webpay/return", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token_ws }),
          });

          const data = await response.json();

          if (data.success) {
            setPaymentStatus({
              status: "success",
              message: data.message,
              transactionId: data.data?.buy_order,
            });
            
            // Clear pending payment and cart
            localStorage.removeItem("pendingPayment");
          } else {
            setPaymentStatus({
              status: "error",
              message: data.message || "El pago no pudo ser procesado",
            });
          }
        } else if (TBK_TOKEN) {
          // User cancelled payment
          setPaymentStatus({
            status: "cancelled",
            message: "El pago fue cancelado por el usuario.",
          });
        } else {
          setPaymentStatus({
            status: "error",
            message: "No se recibió respuesta de pago.",
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus({
          status: "error",
          message: "Error al verificar el estado del pago.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <div
                  className="spinner-border text-primary mb-3"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h3 className="mb-3">Verificando pago...</h3>
                <p className="text-muted">
                  Estamos confirmando el estado de tu transacción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body text-center p-5">
              {paymentStatus.status === "success" && (
                <>
                  <div className="mb-4">
                    <div
                      className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bi bi-check-lg text-white"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    </div>
                  </div>
                  <h3 className="text-success mb-3">¡Pago Exitoso!</h3>
                  <p className="mb-4">{paymentStatus.message}</p>
                  {paymentStatus.transactionId && (
                    <p className="text-muted mb-2">
                      ID de transacción: {paymentStatus.transactionId}
                    </p>
                  )}
                  <div className="d-flex gap-3 justify-content-center">
                    <Link href="/" className="btn btn-outline-primary">
                      Volver al Inicio
                    </Link>
                    <Link href="/pedidos" className="btn btn-primary">
                      Ver Mis Pedidos
                    </Link>
                  </div>
                </>
              )}

              {paymentStatus.status === "error" && (
                <>
                  <div className="mb-4">
                    <div
                      className="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bi bi-x-lg text-white"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    </div>
                  </div>
                  <h3 className="text-danger mb-3">Pago No Completado</h3>
                  <p className="mb-4">{paymentStatus.message}</p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Link href="/" className="btn btn-outline-secondary">
                      Volver al Inicio
                    </Link>
                    <Link href="/carrito" className="btn btn-warning">
                      Reintentar Pago
                    </Link>
                  </div>
                </>
              )}

              {paymentStatus.status === "cancelled" && (
                <>
                  <div className="mb-4">
                    <div
                      className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bi bi-exclamation-triangle text-white"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    </div>
                  </div>
                  <h3 className="text-warning mb-3">Pago Cancelado</h3>
                  <p className="mb-4">{paymentStatus.message}</p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Link href="/" className="btn btn-outline-secondary">
                      Volver al Inicio
                    </Link>
                    <Link href="/carrito" className="btn btn-warning">
                      Volver al Carrito
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}