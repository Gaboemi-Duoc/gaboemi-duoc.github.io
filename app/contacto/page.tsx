"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

// CSS loading check hook
function useCssLoaded() {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    const checkCssLoaded = () => {
      const testElement = document.createElement("div");
      testElement.className = "container";
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded =
        computedStyle.display !== "inline" && computedStyle.maxWidth !== "";

      document.body.removeChild(testElement);
      return isLoaded;
    };

    const waitForCss = () => {
      if (checkCssLoaded()) {
        setCssLoaded(true);
      } else {
        const interval = setInterval(() => {
          if (checkCssLoaded()) {
            setCssLoaded(true);
            clearInterval(interval);
          }
        }, 50);

        const timeout = setTimeout(() => {
          setCssLoaded(true);
          clearInterval(interval);
        }, 3000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", waitForCss);
    } else {
      waitForCss();
    }

    window.addEventListener("load", waitForCss);

    return () => {
      window.removeEventListener("load", waitForCss);
      document.removeEventListener("DOMContentLoaded", waitForCss);
    };
  }, []);

  return cssLoaded;
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const cssLoaded = useCssLoaded();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner until both mounted and CSS is loaded
  if (!mounted || !cssLoaded) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Cargando estilos...</span>
          </div>
          <p className="mt-2 text-muted">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Zmart - Nosotros</title>
        <meta
          name="description"
          content="Conoce más sobre Zmart, tu tienda de videojuegos y tecnología en Chile"
        />
      </Head>

      <div className="container mt-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="text-warning mb-3">Sobre Zmart</h1>
          <p className="lead text-white">
            Tu destino líder en videojuegos y tecnología en Chile
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card bg-dark text-white h-100 border-warning">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="fs-1">🎯</div>
                </div>
                <h3 className="card-title text-warning text-center">
                  Nuestra Misión
                </h3>
                <p className="card-text">
                  En Zmart, nos dedicamos a brindar la mejor experiencia de
                  compra en videojuegos y tecnología a la comunidad chilena.
                  Ofrecemos productos de calidad, precios competitivos y un
                  servicio al cliente excepcional que supera las expectativas de
                  nuestros clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card bg-dark text-white h-100 border-warning">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="fs-1">🚀</div>
                </div>
                <h3 className="card-title text-warning text-center">
                  Nuestra Visión
                </h3>
                <p className="card-text">
                  Ser la tienda de referencia en Chile para los amantes de los
                  videojuegos y la tecnología, reconocida por nuestra
                  innovación, variedad de productos y compromiso con la
                  comunidad gamer. Aspiramos a expandirnos por todo el país
                  llevando la mejor tecnología a cada rincón de Chile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="card bg-dark text-white border-secondary mb-5">
          <div className="card-body">
            <h2 className="text-warning text-center mb-4">Nuestra Historia</h2>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <p className="mb-3">
                  Fundada en 2010 en Santiago de Chile, Zmart nació de la pasión
                  de un grupo de amigos por los videojuegos y la tecnología. Lo
                  que comenzó como un pequeño local en el centro de Santiago,
                  hoy se ha convertido en una de las tiendas más importantes del
                  rubro en el país.
                </p>
                <p className="mb-3">
                  A lo largo de los años, hemos crecido junto con la comunidad
                  gamer chilena, adaptándonos a las nuevas tecnologías y
                  tendencias. Desde los clásicos juegos retro hasta las últimas
                  novedades en realidad virtual, hemos estado presentes en cada
                  etapa de la evolución del gaming en Chile.
                </p>
                <p>
                  Hoy contamos con presencia online a nivel nacional y seguimos
                  comprometidos con nuestros valores fundacionales: pasión por
                  los videojuegos, honestidad con nuestros clientes y búsqueda
                  constante de la excelencia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-warning text-center mb-4">Nuestros Valores</h2>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-dark text-white h-100 border-secondary">
              <div className="card-body text-center">
                <div className="fs-1 mb-3">🤝</div>
                <h5 className="text-warning">Confianza</h5>
                <p className="small">
                  Construimos relaciones duraderas basadas en la transparencia y
                  honestidad con nuestros clientes y colaboradores.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-dark text-white h-100 border-secondary">
              <div className="card-body text-center">
                <div className="fs-1 mb-3">🎮</div>
                <h5 className="text-warning">Pasión</h5>
                <p className="small">
                  Vivimos y respiramos videojuegos. Esta pasión se refleja en
                  cada producto que ofrecemos y en cada consejo que compartimos.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-dark text-white h-100 border-secondary">
              <div className="card-body text-center">
                <div className="fs-1 mb-3">🌟</div>
                <h5 className="text-warning">Calidad</h5>
                <p className="small">
                  Seleccionamos cuidadosamente cada producto para garantizar que
                  cumpla con los más altos estándares de calidad y rendimiento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="card bg-dark text-white border-warning">
          <div className="card-body">
            <h2 className="text-warning text-center mb-4">
              ¿Por Qué Elegir Zmart?
            </h2>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <strong className="text-warning">
                      🎯 Amplia Variedad:
                    </strong>
                    <span className="text-white">
                      {" "}
                      Desde juegos retro hasta las últimas novedades
                    </span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-warning">🚀 Envío Rápido:</strong>
                    <span className="text-white">
                      {" "}
                      Despachamos a todo Chile en tiempo récord
                    </span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-warning">
                      💬 Soporte Expertos:
                    </strong>
                    <span className="text-white">
                      {" "}
                      Nuestro equipo conoce cada producto que vendemos
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <strong className="text-warning">
                      💰 Precios Competitivos:
                    </strong>
                    <span className="text-white">
                      {" "}
                      Las mejores ofertas del mercado chileno
                    </span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-warning">🛡️ Garantía:</strong>
                    <span className="text-white">
                      {" "}
                      Todos nuestros productos incluyen garantía
                    </span>
                  </li>
                  <li className="mb-3">
                    <strong className="text-warning">🇨🇱 100% Chileno:</strong>
                    <span className="text-white">
                      {" "}
                      Empresa local que entiende a los gamers chilenos
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5">
          <h3 className="text-warning mb-3">
            ¿Listo para vivir la experiencia Zmart?
          </h3>
          <p className="text-white mb-4">
            Únete a la comunidad gamer más grande de Chile y descubre por qué
            somos la elección preferida
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link href="/productos" className="btn btn-warning btn-lg">
              Ver Juegos
            </Link>
            <Link href="/consolas" className="btn btn-outline-light btn-lg">
              Ver Consolas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
