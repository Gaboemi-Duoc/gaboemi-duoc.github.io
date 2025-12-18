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

import { ProductoForCard } from "../components/product";

export default function ConsolesPage() {
  const [productsList, setProductsList] = useState<ProductoForCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsoles() {
      try {
        const apiProducts = await ProductService.getAllProducts();

        // Filtramos solo los productos que sean consolas
        const consoles = apiProducts.filter((p) => p.cat === "Consolas");

        const data: ProductoForCard[] = consoles.map((prod) => {
          // Buscar imagen local
          const localImg = (productsJSON as LocalProductImage[]).find(
            (p) => p.id_producto === prod.id_producto
          )?.img;

          return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.description || "Sin descripción",
            precio: prod.price.toString(), // Convert to string here
            img: localImg || prod.img || "/images/default.jpg",
            genero: prod.cat || "Consola",
            tamano: "N/A",
            jugadores: 1,
            lanzamiento: "Por confirmar",
            desarrollador: prod.detail?.split(',')[0] || "Desconocido",
            stock: prod.stock || 0,
            cat: prod.cat || "Consolas",
            discount: prod.discount || 0
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
                itemType="consola"
                buttonClass="btn-primary"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}