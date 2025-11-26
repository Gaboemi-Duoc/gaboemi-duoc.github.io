"use client";
import { useEffect, useState } from "react";
import Head from "next/head";

// Importación correcta del JSON ❗
import BlogList from "../blogs.json";

// Hook: verifica si Bootstrap está cargado
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

interface Blog {
  id: number;
  titulo: string;
  resumen: string;
  img: string;
  fecha: string;
  autor: string;
}

export default function BlogsPage() {
  const cssLoaded = useCssLoaded();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loader si CSS o DOM no están listos
  if (!mounted || !cssLoaded) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="mt-2 text-muted">Cargando blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Blog - Zmart</title>
        <meta name="description" content="Artículos, reseñas y noticias gamer" />
      </Head>

      <div className="container mt-4">
        <h1 className="mb-4">Blog de Zmart</h1>

        <div className="d-flex flex-wrap justify-content-center gap-4">
          {BlogList.map((blog: Blog) => (
            <div
              key={blog.id}
              className="card producto-card shadow"
              style={{ width: "22rem" }}
            >
              <img
                src={blog.img}
                className="card-img-top"
                alt={blog.titulo}
                style={{ height: "180px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{blog.titulo}</h5>

                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {blog.autor} • {blog.fecha}
                </p>

                <p className="card-text">{blog.resumen}</p>

                <a
                  href={`/blogs/${blog.id}`}
                  className="btn btn-primary w-100"
                >
                  Leer más
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
