"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import productsList from "./product_image_index.json";
import "./productos/[id]/style.css";
import { useCart, CartItem } from "./components/carritoContext";
import { ProductoCard } from "./components/productCard";
import ProductService, { Product } from "./service/productService";

// Types
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img: string;
  genero: string;
  tamano: string;
  jugadores: number;
  lanzamiento: string;
  desarrollador: string;
  discount?: number;
  cat?: string;
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Fetch productos desde la API
  useEffect(() => {
    async function fetchProductos() {
      try {
        const apiProductos = await ProductService.getAllProducts();

        const data: Producto[] = apiProductos.map((prod) => {
          // Buscar imagen local por id_producto
          const localImg = productsList.find((p) => p.id_producto === prod.id_producto)?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description || "Sin descripción",
            precio: prod.price.toString(),
            img: prod.img || localImg || "/images/default.jpg",
            genero: prod.cat || "Acción",
            tamano: "N/A",
            jugadores: 1,
            lanzamiento: "Por confirmar",
            desarrollador: "Desconocido",
            discount: prod.discount || 0,
            cat: prod.cat
          };
        });

        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p className="mt-2 text-muted">Cargando GoldenCat...</p>
      </div>
    );
  }

  // Carrusel Component
  const Carrusel = () => {
    const imagenes = [
      "/images/juegos/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
      "/images/juegos/Dispatch.jpg",
      "/images/juegos/devil-may-cry-5-4318.jpg",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % imagenes.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [imagenes.length]);

    const prevSlide = () => setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    const nextSlide = () => setIndex((prev) => (prev + 1) % imagenes.length);

    return (
      <div className="relative mt-3 overflow-hidden rounded-xl h-[400px]">
        <div className="relative w-full h-full">
          {imagenes.map((img, i) => {
            const position = i === index ? "translate-x-0" : "translate-x-full";
            return (
              <img
                key={i}
                src={img}
                alt={`slide-${i}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ${position}`}
              />
            );
          })}
        </div>

        <button onClick={prevSlide} className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full z-10">‹</button>
        <button onClick={nextSlide} className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full z-10">›</button>
      </div>
    );
  };

  // Get only featured products (limit to 8)
  const featuredProducts = productos.slice(0, 8);

  return (
    <>
      <Head>
        <title>Tienda de Videojuegos</title>
        <meta name="description" content="Tu tienda de videojuegos favorita" />
      </Head>

      <div className="container mt-4">
        <Carrusel />
        
        {/* Only show Featured Products section */}
        <div className="mt-5">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          {featuredProducts.length === 0 ? (
            <p className="text-center text-muted">No hay productos disponibles en este momento.</p>
          ) : (
            <div className="text-center" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
              {featuredProducts.map((prod) => (
                <ProductoCard 
                  key={prod.id} 
                  prod={prod} 
                  itemType={prod.cat === "Consolas" ? "consola" : "producto"} 
                  buttonClass={prod.cat === "Consolas" ? "btn-primary" : "btn-success"} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}