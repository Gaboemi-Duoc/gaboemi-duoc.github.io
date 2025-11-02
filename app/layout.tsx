import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { AuthProvider } from "./authProvider";
import { Navbar } from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda de Videojuegos",
  description: "Compra los mejores juegos al mejor precio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-light d-flex flex-column min-vh-100`}
      >
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
                © 2025 Goldencat - Todos los derechos reservados
              </p>
              <div>
                <a href="#" className="text-white text-decoration-none me-3">
                  Políticas de privacidad
                </a>
                <a href="#" className="text-white text-decoration-none">
                  Términos y condiciones
                </a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
