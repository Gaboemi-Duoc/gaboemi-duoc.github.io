"use client";

import { useParams } from "next/navigation";
import { useCart, CartItem } from "../../components/carritoContext";
import "./style.css";
import { useEffect, useState } from "react";

import ProductService, { Product } from "../../service/productService";

// Importar JSON auxiliar con imágenes
import productsJSON from "../../product_image_index.json";

// Interfaz correcta según tu JSON
interface LocalProductImage {
  id_producto: number;
  img: string;
}

// Cast correcto del JSON (evita errores TS)
const productsImages = productsJSON as LocalProductImage[];

export default function ProductoPage() {
  const { agregarAlCarrito, getItemCount } = useCart();
  const params = useParams();
  const id = Number(params.id);

  const [producto, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProducto() {
      try {
        const response = await ProductService.getProductByID(id);
        const data: Product = response.data;

        // Buscar imagen local por id_producto
        const localImage = productsImages.find((p) => p.id_producto === id);

        // Asignar imagen local o default
        data.img = localImage?.img ?? "/images/default.jpg";

        setProducto(data);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Cargando producto...</p>;
  if (error || !producto)
    return <p className="text-center mt-5">Producto no encontrado</p>;

  // Objeto para el carrito
  const cartProducto: CartItem = {
    id: producto.id_producto,
    nombre: producto.nombre,
    precio: producto.price.toString(),
    img: producto.img ?? "/images/default.jpg",
    tipo: "producto",
  };

  const itemCount = getItemCount(producto.id_producto);

  return (
    <div className="container mt-5">
      <div className="row">

        {/* Columna Imagen */}
        <div className="col-md-6">
          <img
            src={producto.img}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Columna Info */}
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="lead text-success">${producto.price}</p>
          <p>{producto.description}</p>

          <ul className="list-unstyled mt-3">
            <li><strong>Categoría: </strong>{producto.cat}</li>
            <li><strong>Stock: </strong>{producto.stock}</li>
            <li><strong>Detalle: </strong>{producto.detail}</li>
            <li><strong>Descuento: </strong>{producto.discount}%</li>

            {itemCount > 0 && (
              <li>
                <strong>En carrito: </strong>
                <span className="badge bg-primary">{itemCount}</span>
              </li>
            )}
          </ul>

          <button
            className="btn btn-success btn-lg mt-3"
            onClick={() => agregarAlCarrito(cartProducto)}
          >
            Agregar al carrito
          </button>
        </div>

      </div>
    </div>
  );
}
