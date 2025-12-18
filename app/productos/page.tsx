"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { ProductoCard } from "../components/productCard";
import ProductService, { Product } from "../service/productService";
import productsJSON from "../product_image_index.json";

// Interfaces
interface LocalProductImage {
  id_producto: number;
  img: string;
}

// Import the interface
import { ProductoForCard } from "../components/product";

export default function ProductPage() {
  const [productsList, setProductsList] = useState<ProductoForCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const apiProductos = await ProductService.getAllProducts();

        // Filtramos todos los productos que NO sean consolas
        const juegos = apiProductos.filter((p) => p.cat !== "Consolas");

        const data: ProductoForCard[] = juegos.map((prod) => {
          // Buscar imagen local
          const localImg = (productsJSON as LocalProductImage[]).find(
            (p) => p.id_producto === prod.id_producto
          )?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description || "Sin descripción",
            precio: prod.price.toString(), // Convert to string
            img: prod.img || localImg || "/images/default.jpg",
            genero: prod.cat || "Acción",
            tamano: "N/A",
            jugadores: 1,
            lanzamiento: "Por confirmar",
            desarrollador: prod.detail?.split(',')[0] || "Desconocido",
            stock: prod.stock || 0,
            cat: prod.cat || "Videojuego",
            discount: prod.discount || 0,
            detail: prod.detail
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