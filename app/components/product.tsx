export interface ApiProduct {
  id_producto: number;
  cat: string;
  description: string;
  nombre: string;
  price: number;
  stock: number;
  detail: string;
  discount: number;
  img?: string;
}

export interface ProductoForCard {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // Always string for ProductCard
  img: string;
  genero: string;
  tamano: string;
  jugadores: number;
  lanzamiento: string;
  desarrollador: string;
  tipo?: "producto" | "consola";
  marca?: string;
  cat?: string;
  stock?: number;
  discount?: number;
  detail?: string;
}