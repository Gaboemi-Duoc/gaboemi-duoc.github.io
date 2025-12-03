// app/blogs/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import blogsService from "../../service/blogsService";
import type { Blog as ApiBlog, BlogDetail } from "../../components/blog";

// Hook for CSS loading
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
const localBlogs: BlogDetail[] = [
  {
    id: 1,
    titulo: "Nuevos Lanzamientos 2024",
    contenido: "Este artículo detalla los videojuegos más esperados de este año... [Contenido completo]",
    img: "/images/blog1.jpg",
    fecha: "15 de marzo de 2024",
    autor: "Carlos Gómez",
    resumen: "Descubre los videojuegos más esperados de este año",
    descripcion: "Análisis completo de los lanzamientos más importantes del 2024"
  },
  {
    id: 2,
    titulo: "Guía: Cómo Mejorar tu PC Gamer",
    contenido: "Consejos prácticos para actualizar tu equipo sin gastar demasiado... [Contenido completo]",
    img: "/images/blog2.jpg",
    fecha: "10 de marzo de 2024",
    autor: "Ana Rodríguez",
    resumen: "Consejos para actualizar tu equipo sin gastar demasiado",
    descripcion: "Guía completa para optimizar tu PC para gaming"
  },
  {
    id: 3,
    titulo: "Análisis: El Ascenso de los Esports",
    contenido: "Cómo los deportes electrónicos están cambiando la industria del gaming... [Contenido completo]",
    img: "/images/blog3.jpg",
    fecha: "5 de marzo de 2024",
    autor: "Luis Fernández",
    resumen: "Cómo los deportes electrónicos están cambiando la industria",
    descripcion: "Análisis del impacto de los esports en la industria del gaming"
  }
];

export default function BlogPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const cssLoaded = useCssLoaded();
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogDetail[]>([]);

  const fetchBlog = useCallback(async () => {
    if (!id) {
      setError("ID de artículo no válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const blogData = await blogsService.getBlogById(id);

      if (blogData) {
        // Transform to UI format
        const uiBlog: BlogDetail = {
          id: blogData.id_blog,
          titulo: blogData.nombre,
          contenido: blogData.body,
          img: getBlogImage(blogData.id_blog),
          fecha: formatDate(blogData.date),
          autor: blogData.writer,
          resumen: blogData.description || blogData.body.substring(0, 150) + "...",
          descripcion: blogData.description || blogData.body.substring(0, 200) + "...",
        };

        setBlog(uiBlog);

        // Fetch related blogs by same author
        const related = await blogsService.getBlogsByWriter(blogData.writer);
        const uiRelatedBlogs: BlogDetail[] = related
          .filter(b => b.id_blog !== id)
          .slice(0, 3)
          .map((b: ApiBlog) => ({
            id: b.id_blog,
            titulo: b.nombre,
            contenido: b.body,
            img: getBlogImage(b.id_blog),
            fecha: formatDate(b.date),
            autor: b.writer,
            resumen: b.description || b.body.substring(0, 100) + "...",
            descripcion: b.description || b.body.substring(0, 100) + "...",
          }));

        setRelatedBlogs(uiRelatedBlogs);
      } else {
        // Fallback to local data
        const localBlog = localBlogs.find(b => b.id === id);
        if (localBlog) {
          setBlog(localBlog);
          setRelatedBlogs(localBlogs.filter(b => b.id !== id).slice(0, 3));
        } else {
          setError("Artículo no encontrado");
        }
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("No se pudo cargar el artículo. Por favor, intenta nuevamente.");
      
      // Fallback to local data
      const localBlog = localBlogs.find(b => b.id === id);
      if (localBlog) {
        setBlog(localBlog);
        setRelatedBlogs(localBlogs.filter(b => b.id !== id).slice(0, 3));
      } else {
        setError("Artículo no encontrado");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setMounted(true);
    fetchBlog();
  }, [fetchBlog]);

  if (!mounted || !cssLoaded) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="mt-2 text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="mt-3">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || "Artículo no encontrado"}
        </div>
        <div className="text-center mt-4">
          <Link href="/blogs" className="btn btn-primary">
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.titulo} - Blog Zmart</title>
        <meta name="description" content={blog.descripcion} />
      </Head>

      <div className="container mt-5">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/blogs" className="btn btn-outline-secondary">
            ← Volver al Blog
          </Link>
        </div>

        {/* Blog Content */}
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <article>
              {/* Blog Header */}
              <header className="mb-4">
                <h1 className="display-5 fw-bold mb-3">{blog.titulo}</h1>
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3">
                    <span className="badge bg-primary">Artículo</span>
                  </div>
                  <div>
                    <p className="text-muted mb-0">
                      <strong>{blog.autor}</strong> • {blog.fecha}
                    </p>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="mb-5 position-relative" style={{ height: "500px" }}>
                <Image
                  src={blog.img}
                  alt={blog.titulo}
                  fill
                  className="img-fluid rounded shadow-lg"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <p className="text-muted text-center mt-2 small">
                  Imagen ilustrativa
                </p>
              </div>

              {/* Blog Content */}
              <div className="blog-content mb-5">
                <div className="lead mb-4">
                  {blog.descripcion}
                </div>
                
                <div className="content-body">
                  {blog.contenido.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags/Categories */}
              {/* <div className="mb-5">
                <h5 className="mb-3">Categorías</h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-secondary">Videojuegos</span>
                  <span className="badge bg-secondary">Tecnología</span>
                  <span className="badge bg-secondary">Reseñas</span>
                  <span className="badge bg-secondary">Noticias</span>
                </div>
              </div> */}
            </article>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Author Info */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Sobre el autor</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "50px", height: "50px" }}>
                    <span className="text-white fw-bold">
                      {blog.autor.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-1">{blog.autor}</h6>
                    <small className="text-muted">Escritor de Blog</small>
                  </div>
                </div>
                <p className="card-text small">
                  Artículos escritos por {blog.autor} sobre videojuegos, tecnología y cultura gamer.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Artículos relacionados</h5>
                  <div className="list-group list-group-flush">
                    {relatedBlogs.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blogs/${related.id}`}
                        className="list-group-item list-group-item-action border-0 py-3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3" style={{ width: "60px", height: "60px" }}>
                            <Image
                              src={related.img}
                              alt={related.titulo}
                              fill
                              className="rounded"
                              style={{ objectFit: "cover" }}
                              sizes="60px"
                            />
                          </div>
                          <div>
                            <h6 className="mb-1 small">{related.titulo}</h6>
                            <small className="text-muted">{related.fecha}</small>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-top pt-4 mt-5">
          <div className="d-flex justify-content-between">
            <Link href="/blogs" className="btn btn-secondary">
              ← Ver todos los artículos
            </Link>
            <button
              className="btn btn-outline-primary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ↑ Volver arriba
            </button>
          </div>
        </div>
      </div>
    </>
  );
}