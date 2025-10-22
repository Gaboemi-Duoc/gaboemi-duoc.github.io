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

// Poner Header y Footer aca jsjs

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
          <div className="container d-felx justiify-content-between align-items-center py-3">
            <h1 className="h4 m-0">GoldenCat</h1>
            <nav>
              <ul className="d-flex list-unstyled m-0 gap-3">
                <li>
                  <Link href="/" className="text-white text-decoration-none">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-white text-decoration-none">
                    Juegos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white text-decoration-none">
                    Consolas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white text-decoration-none">
                    Ofertas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white text-decoration-none">
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <button className="btn btn-outline-light btn-sm">Carrito</button>
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
                {" "}
                politicas de la privacidad
              </a>
              <a href="#" className="text-white text-decoration-none">
                termino y condiciones
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
