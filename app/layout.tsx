import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";  // CSS OK
import Script from "next/script";               // <--- IMPORTANTE

import { AuthProvider } from "./authProvider";
import { Navbar } from "./navbar";
import { CartProvider } from "./components/carritoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zmart.cl - Tienda de Videojuegos",
  description: "Compra los mejores juegos al mejor precio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-light d-flex flex-column min-vh-100`}
      >
        <CartProvider>
          <AuthProvider>

            <Navbar />

            <main className="container-fluid flex-grow-1 d-flex flex-column">
              <div className="row justify-content-center flex-grow-1">
                <div className="col-12 col-lg-10 col-xl-8">{children}</div>
              </div>
            </main>

            <footer className="bg-dark text-white py-4 mt-auto">
              <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                <p className="mb-2 mb-md-0">
                  © 2025 Zmart - Todos los derechos reservados
                </p>
              </div>
            </footer>

          </AuthProvider>
        </CartProvider>

        {/* Bootstrap JS – NO rompe el layout */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
