"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { ProductoCard } from "../components/productCard";
import { useCart } from "../components/carritoContext";
import ProductService, { Product } from "../service/productService";
import productsJSON from "../products.json"; // imágenes locales

// Interfaces
interface LocalProductImage {
  id_producto: number;
  img: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // string para UI
  img: string;
  genero: string;
  tamano: string;
  jugadores: number;
  lanzamiento: string;
  desarrollador: string;
}

export default function ProductPage() {
  const [productsList, setProductsList] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await ProductService.getAllProducts();
        const apiProductos: Product[] = res.data;

        // Filtramos todos los productos que NO sean consolas
        const juegos = apiProductos.filter((p) => p.cat !== "Consolas");

        const data: Producto[] = juegos.map((prod) => {
          // Buscar imagen local
          const localImg = (productsJSON as LocalProductImage[]).find(
            (p) => p.id_producto === prod.id_producto
          )?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description,
            precio: prod.price.toString(), // <-- convertimos a string
            img: prod.img || localImg || "/images/default.jpg",
            genero: "Acción", // por defecto
            tamano: "1GB",    // por defecto
            jugadores: 1,     // por defecto
            lanzamiento: "2025-01-01", // por defecto
            desarrollador: "Desconocido", // por defecto
          };
        });

        setProductsList(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando productos...</div>;
  }

  return (
    <>
      <Head>
        <title>Productos - Tienda de Videojuegos</title>
        <meta name="description" content="Descubre nuestros videojuegos" />
      </Head>

      <div className="container mt-4">
        <h1 className="mb-4">Nuestros Juegos</h1>
        {productsList.length === 0 ? (
          <p className="text-center">No hay productos disponibles.</p>
        ) : (
          <div
            className="text-center"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {productsList.map((prod) => (
              <ProductoCard
                key={prod.id}
                prod={prod}
                itemType="producto"
                buttonClass="btn-success"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
