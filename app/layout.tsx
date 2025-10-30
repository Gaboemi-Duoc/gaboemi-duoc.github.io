import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-light`}
      >
        <header className="bg-dark text-white">
          <div className="container d-flex justify-content-between align-items-center py-3">
            <h1 className="h4 m-0">GoldenCat</h1>

            <nav>
              <ul className="d-flex list-unstyled m-0 gap-3">
                <li>
                  <Link href="/" className="text-white text-decoration-none">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/productos"
                    className="text-white text-decoration-none"
                  >
                    Juegos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consolas"
                    className="text-white text-decoration-none"
                  >
                    Consolas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="text-white text-decoration-none"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="d-flex align-items-center gap-2">
              {/* 🔽 Botón Carrito apunta a /cart */}
              <Link href="/carrito" className="btn btn-outline-light btn-sm">
                Carrito
              </Link>

              {/* 🔽 Nuevo botón de inicio de sesión */}
              <Link
                href="/login"
                className="btn btn-outline-warning btn-sm text-white"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </header>

        <main className="container mt-4">{children}</main>

        <footer className="bg-dark text-white mt-5 py-4">
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
      </body>
    </html>
  );
}
