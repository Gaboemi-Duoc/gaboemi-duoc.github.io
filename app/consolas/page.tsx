"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { ProductoCard } from "../components/productCard";
import { useCart } from "../components/carritoContext";
import ProductService, { Product } from "../service/productService";
import productsJSON from "../product_image_index.json"; // imágenes locales

// Interfaces
interface LocalProductImage {
  id_producto: number;
  img: string;
}

// Interfaz para UI
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

export default function ConsolesPage() {
  const [productsList, setProductsList] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsoles() {
      try {
        const res = await ProductService.getAllProducts();
        const apiProducts: Product[] = res.data;

        // Filtramos solo los productos que sean consolas
        const consoles = apiProducts.filter((p) => p.cat === "Consolas");

        const data: Producto[] = consoles.map((prod) => {
          // Buscar imagen local
          const localImg = (productsJSON as LocalProductImage[]).find(
            (p) => p.id_producto === prod.id_producto
          )?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description || "",
            precio: prod.price.toString(), // <-- convertimos a string
            img: prod.img || localImg || "/images/default.jpg",
            genero: "N/A",                // valor por defecto para consolas
            tamano: "N/A",                // valor por defecto para consolas
            jugadores: 1,                 // valor por defecto
            lanzamiento: "Por confirmar", // valor por defecto
            desarrollador: "Desconocido", // valor por defecto
          };
        });

        setProductsList(data);
      } catch (err) {
        console.error("Error al cargar consolas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConsoles();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Cargando consolas...</div>;
  }

  return (
    <>
      <Head>
        <title>Consolas - Tienda de Videojuegos</title>
        <meta name="description" content="Descubre nuestras consolas" />
      </Head>

      <div className="container mt-4">
        <h1 className="mb-4">Nuestras Consolas</h1>
        {productsList.length === 0 ? (
          <p className="text-center">No hay consolas disponibles.</p>
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
