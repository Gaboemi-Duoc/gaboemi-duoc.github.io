// app/blogs/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import blogsService from "../service/blogsService";
import type { Blog as ApiBlog, UIBlog } from "../components/blog";

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

// Helper functions
const getBlogImage = (id: number): string => {
  const images = [
    "/images/blog1.jpg",
    "/images/blog2.jpg",
    "/images/blog3.jpg",
    "/images/blog4.jpg",
    "/images/blog5.jpg",
  ];
  return images[id % images.length] || "/images/blog-default.jpg";
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Local fallback data
const localBlogs: UIBlog[] = [
  {
    id: 1,
    titulo: "Nuevos Lanzamientos 2024",
    resumen: "Descubre los videojuegos más esperados de este año",
    img: "/images/blog1.jpg",
    fecha: "15 de marzo de 2024",
    autor: "Carlos Gómez"
  },
  {
    id: 2,
    titulo: "Guía: Cómo Mejorar tu PC Gamer",
    resumen: "Consejos para actualizar tu equipo sin gastar demasiado",
    img: "/images/blog2.jpg",
    fecha: "10 de marzo de 2024",
    autor: "Ana Rodríguez"
  },
  {
    id: 3,
    titulo: "Análisis: El Ascenso de los Esports",
    resumen: "Cómo los deportes electrónicos están cambiando la industria",
    img: "/images/blog3.jpg",
    fecha: "5 de marzo de 2024",
    autor: "Luis Fernández"
  }
];

export default function BlogsPage() {
  const cssLoaded = useCssLoaded();
  const [mounted, setMounted] = useState(false);
  const [blogs, setBlogs] = useState<UIBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<UIBlog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogsService.getAllBlogs();
      
      if (response.data && response.data.length > 0) {
        // Transform API response to UI format
        const uiBlogs: UIBlog[] = response.data.map((blog: ApiBlog) => ({
          id: blog.id_blog,
          titulo: blog.nombre,
          resumen: blog.description || blog.body.substring(0, 150) + "...",
          img: getBlogImage(blog.id_blog),
          fecha: formatDate(blog.date),
          autor: blog.writer,
        }));
        
        setBlogs(uiBlogs);
        setFilteredBlogs(uiBlogs);
      } else {
        // Use local data if API returns empty
        setBlogs(localBlogs);
        setFilteredBlogs(localBlogs);
        setTotalBlogs(localBlogs.length);
      }

      // Get total count
      const count = await blogsService.countBlogs();
      setTotalBlogs(count || localBlogs.length);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("No se pudieron cargar los blogs. Por favor, intenta nuevamente.");
      
      // Fallback to local data
      setBlogs(localBlogs);
      setFilteredBlogs(localBlogs);
      setTotalBlogs(localBlogs.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    try {
      setLoading(true);
      
      // Search in both name and description
      const [byName, byDescription] = await Promise.all([
        blogsService.searchBlogsByName(searchTerm),
        blogsService.searchBlogsByDescription(searchTerm)
      ]);

      // Combine and deduplicate results
      const allResults = [...byName, ...byDescription];
      const uniqueResults = Array.from(
        new Map(allResults.map(blog => [blog.id_blog, blog])).values()
      );

      if (uniqueResults.length > 0) {
        // Transform to UI format
        const uiResults: UIBlog[] = uniqueResults.map((blog: ApiBlog) => ({
          id: blog.id_blog,
          titulo: blog.nombre,
          resumen: blog.description || blog.body.substring(0, 150) + "...",
          img: getBlogImage(blog.id_blog),
          fecha: formatDate(blog.date),
          autor: blog.writer,
        }));

        setFilteredBlogs(uiResults);
      } else {
        // Fallback to local search
        const filtered = blogs.filter(blog => 
          blog.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.resumen.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(filtered);
      }
    } catch (err) {
      console.error("Error searching blogs:", err);
      // Fallback to local search
      const filtered = blogs.filter(blog => 
        blog.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.resumen.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, blogs]);

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
        
        {/* Search and Stats Bar */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Buscar'
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setFilteredBlogs(blogs);
                }}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <div className="card bg-light">
              <div className="card-body py-2">
                <small className="text-muted">
                  {filteredBlogs.length} de {totalBlogs} artículos
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Loading State */}
        {loading && blogs.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            />
            <p className="mt-3">Cargando artículos...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted mb-3" style={{ fontSize: "4rem" }}>
              📝
            </div>
            <h4 className="text-muted mb-3">No se encontraron artículos</h4>
            <p className="text-muted mb-4">
              {searchTerm ? `No hay resultados para "${searchTerm}"` : "No hay artículos disponibles"}
            </p>
            {searchTerm && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setFilteredBlogs(blogs);
                }}
              >
                Ver todos los artículos
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="card producto-card shadow"
                  style={{ width: "22rem" }}
                >
                  <div className="position-relative" style={{ height: "180px" }}>
                    <Image
                      src={blog.img}
                      alt={blog.titulo}
                      fill
                      className="card-img-top"
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{blog.titulo}</h5>

                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {blog.autor} • {blog.fecha}
                    </p>

                    <p className="card-text">{blog.resumen}</p>

                    <Link
                      href={`/blogs/${blog.id}`}
                      className="btn btn-primary w-100"
                    >
                      Leer más
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {filteredBlogs.length < totalBlogs && (
              <div className="text-center mt-5">
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={fetchBlogs}
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Cargar más artículos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}