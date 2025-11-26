"use client";

import { useParams } from "next/navigation";
import blogData from "../../blogs.json"; // Import correcto del JSON
import Link from "next/link";

interface Blog {
  id: number;
  titulo: string;
  resumen: string;
  img: string;
  fecha: string;
  autor: string;
}

export default function BlogPage() {
  const params = useParams();
  const id = Number(params.id);

  const blogItem = blogData.find((b: Blog) => b.id === id);

  if (!blogItem)
    return <p className="text-center mt-5">Artículo no encontrado</p>;

  return (
    <div className="container mt-5">
      <div className="row">

        {/* Imagen */}
        <div className="col-md-6">
          <img
            src={blogItem.img}
            alt={blogItem.titulo}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Datos del Blog */}
        <div className="col-md-6">
          <h1>{blogItem.titulo}</h1>

          <p className="text-muted">
            <strong>{blogItem.autor}</strong> • {blogItem.fecha}
          </p>

          <p className="lead">{blogItem.resumen}</p>

          {/* Contenido placeholder (puedes agregarlo después) */}
          <p className="mt-3">
            Este artículo aún no tiene contenido completo, pero pronto será
            actualizado con análisis, reseñas e información detallada.
          </p>

          <Link href="/blogs" className="btn btn-secondary btn-lg mt-3">
            Volver al Blog
          </Link>
        </div>

      </div>
    </div>
  );
}
