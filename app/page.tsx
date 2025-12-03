"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import productsList from "./product_image_index.json";
import "./productos/[id]/style.css";
import { useCart, CartItem } from "./components/carritoContext";
import { ProductoCard } from "./components/productCard";
import ProductService, { Product } from "./service/productService"; // <-- import ProductService

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
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Obtener producto individual si estamos en la ruta de detalle
  const productoId = pathname ? parseInt(pathname.split("/").pop() || "") : null;
  const productoDetalle = productoId
    ? productos.find((p) => p.id === productoId)
    : null;

  // Fetch productos desde la API
  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await ProductService.getAllProducts();
        const apiProductos: Product[] = res.data;

        const data: Producto[] = apiProductos.map((prod) => {
          // Buscar imagen local por id_producto
          const localImg = productsList.find((p) => p.id_producto === prod.id_producto)?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description,
            precio: prod.price.toString(),
            img: prod.img || localImg || "/images/default.jpg",
            genero: "Acción",             // valor por defecto
            tamano: "1GB",                // valor por defecto
            jugadores: 1,                 // valor por defecto
            lanzamiento: "2025-01-01",   // valor por defecto
            desarrollador: "Desconocido", // valor por defecto
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

  // ProductoDetalle Component
  const ProductoDetalle = ({ producto }: { producto: Producto }) => {
    const { agregarAlCarrito } = useCart();

    const cartItem: CartItem = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img,
      tipo: "producto",
    };

    return (
      <div className="producto-detalle mt-4">
        <div className="row">
          <div className="col-md-6">
            <img src={producto.img} alt={producto.nombre} className="img-fluid rounded shadow" />
          </div>
          <div className="col-md-6">
            <h1>{producto.nombre}</h1>
            <p className="lead text-success">${producto.precio}</p>
            <p>{producto.descripcion}</p>
            <div className="mt-3">
              <p><strong>Género:</strong> {producto.genero}</p>
              <p><strong>Tamaño:</strong> {producto.tamano}</p>
              <p><strong>Jugadores:</strong> {producto.jugadores}</p>
              <p><strong>Lanzamiento:</strong> {producto.lanzamiento}</p>
              <p><strong>Desarrollador:</strong> {producto.desarrollador}</p>
            </div>
            <button className="btn btn-success btn-lg mt-3" onClick={() => agregarAlCarrito(cartItem)}>Agregar al carrito</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Tienda de Videojuegos</title>
        <meta name="description" content="Tu tienda de videojuegos favorita" />
      </Head>

      <div className="container mt-4">
        <Carrusel />
        {productoDetalle ? (
          <ProductoDetalle producto={productoDetalle} />
        ) : (
          <div className="mt-4 text-center" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            {productos.map((prod) => (
              <ProductoCard key={prod.id} prod={prod} itemType="producto" buttonClass="btn-success" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
