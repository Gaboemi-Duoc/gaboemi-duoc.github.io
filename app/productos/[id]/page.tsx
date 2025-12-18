"use client";

import { useParams } from "next/navigation";
import { useCart, CartItem } from "../../components/carritoContext";
import "./style.css";
import { useEffect, useState } from "react";
import ProductService, { Product } from "../../service/productService";
import productsJSON from "../../product_image_index.json";
import { useGameRating } from "../../components/useGameRating";

interface LocalProductImage {
  id_producto: number;
  img: string;
}

const productsImages = productsJSON as LocalProductImage[];

export default function ProductDetailPage() {
  const { agregarAlCarrito, getItemCount } = useCart();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { rating, loading: ratingLoading, formattedRating, starRating } = useGameRating(product?.nombre || '');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await ProductService.getProductByID(id);

        // Buscar imagen local por id_producto
        const localImage = productsImages.find((p) => p.id_producto === id);

        // Asignar imagen local o default
        const productWithImage = {
          ...data,
          img: localImage?.img ?? "/images/default.jpg",
        };

        setProduct(productWithImage);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Early returns must come AFTER all hooks
  if (loading) return <p className="text-center mt-5">Cargando...</p>;
  if (error || !product)
    return <p className="text-center mt-5">Producto no encontrado</p>;

  // Determine item type based on category
  const itemType = product.cat === "Consolas" ? "consola" : "producto";
  
  // Calculate discounted price if applicable
  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : null;

  // Create cart item
  const cartItem: CartItem = {
    id: product.id_producto,
    nombre: product.nombre,
    precio: product.price.toString(),
    img: product.img || "/images/default.jpg",
    tipo: itemType,
    discount: product.discount > 0 ? product.discount : undefined,
    precioOriginal: product.price,
    precioFinal: discountedPrice || product.price,
  };

  const itemCount = getItemCount(product.id_producto);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Columna Imagen */}
        <div className="col-md-6">
          <img
            src={product.img || "/images/default.jpg"}
            alt={product.nombre}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Columna Info */}
        <div className="col-md-6">
          <h1>{product.nombre}</h1>
          
          {/* Category badge */}
          <span className="badge bg-info mb-3">
            {product.cat}
          </span>

          {/* GameBrain Rating Display */}
          {ratingLoading ? (
            <div className="mb-3">
              <span className="badge bg-secondary">
                Cargando calificación...
              </span>
            </div>
          ) : rating && (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <strong>Calificación GameBrain:</strong>
                <span className="badge bg-success fs-6">
                  {formattedRating}
                </span>
                <span className="text-warning">
                  {'★'.repeat(starRating || 0)}{'☆'.repeat(5 - (starRating || 0))}
                </span>
              </div>
              <div className="small text-muted">
                Basado en {rating.count} calificaciones
                {rating.mean_critics && (
                  <span> • Críticos: {Math.round(rating.mean_critics * 100)}%</span>
                )}
                {rating.mean_players && (
                  <span> • Jugadores: {Math.round(rating.mean_players * 100)}%</span>
                )}
              </div>
            </div>
          )}

          {/* Price display with discount */}
          <div className="price-display mb-3">
            {discountedPrice ? (
              <>
                <span className="lead text-muted text-decoration-line-through me-2">
                  ${product.price}
                </span>
                <span className="lead text-success fw-bold">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="badge bg-danger ms-2">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="lead text-success fw-bold">${product.price}</span>
            )}
          </div>

          <p className="mb-3">{product.description || "Sin descripción disponible"}</p>

          <ul className="list-unstyled mt-3">
            <li><strong>Stock: </strong>
              <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                {product.stock > 0 ? `Disponible (${product.stock})` : "Agotado"}
              </span>
            </li>
            
            {product.detail && product.detail.trim() !== "" && (
              <li className="mb-2"><strong>Detalles: </strong>{product.detail}</li>
            )}

            {product.discount > 0 && (
              <li className="mb-2"><strong>Descuento: </strong>{product.discount}%</li>
            )}

            {itemCount > 0 && (
              <li className="mb-2">
                <strong>En carrito: </strong>
                <span className="badge bg-primary">{itemCount}</span>
              </li>
            )}
          </ul>

          <button
            className={`btn btn-lg mt-3 ${itemType === "consola" ? "btn-primary" : "btn-success"}`}
            onClick={() => agregarAlCarrito(cartItem)}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
          </button>

          {/* Back to catalog link */}
          <div className="mt-3">
            <a 
              href={itemType === "consola" ? "/consolas" : "/productos"} 
              className="text-decoration-none"
            >
              ← Volver a {itemType === "consola" ? "Consolas" : "Juegos"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}