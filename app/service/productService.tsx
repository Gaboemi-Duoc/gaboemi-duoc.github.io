import axios, { AxiosResponse } from "axios";

// URL base de la API
const BASE_URL = "https://goldencatapi-production.up.railway.app/api/product";

// Interfaz del producto según tu API real
export interface Product {
  id_producto: number;
  cat: string;
  description: string;
  nombre: string;
  price: number;
  stock: number;
  detail: string;
  discount: number;
  img?: string; // imagen opcional
}

class ProductService {
  // Obtener todos los productos
  getAllProducts(): Promise<AxiosResponse<Product[]>> {
    return axios.get(BASE_URL);
  }

  // Obtener un producto por ID
  getProductByID(id: number): Promise<AxiosResponse<Product>> {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // Crear un producto
  createProduct(product: Product): Promise<AxiosResponse<Product>> {
    return axios.post(BASE_URL, product);
  }

  // Actualizar un producto
  updateProduct(
    id: number,
    product: Partial<Product>
  ): Promise<AxiosResponse<Product>> {
    return axios.put(`${BASE_URL}/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Promise<AxiosResponse<void>> {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  // Test de conexión
  testConnection(): Promise<AxiosResponse<Product[]>> {
    return axios.get(BASE_URL);
  }
}

// Exportamos la instancia (arregla el warning ESLint import/no-anonymous-default-export)
const productService = new ProductService();
export default productService;
