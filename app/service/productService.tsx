import axios from "axios";

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
  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get<Product[]>(BASE_URL);
    return response.data;
  }

  // Obtener un producto por ID
  async getProductByID(id: number): Promise<Product> {
    const response = await axios.get<Product>(`${BASE_URL}/${id}`);
    return response.data;
  }

  // Crear un producto
  async createProduct(product: Product): Promise<Product> {
    const response = await axios.post<Product>(BASE_URL, product);
    return response.data;
  }

  // Actualizar un producto
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await axios.put<Product>(`${BASE_URL}/${id}`, product);
    return response.data;
  }

  // Eliminar un producto
  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  }

  // Obtener productos por categoría
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await axios.get<Product[]>(`${BASE_URL}/category/${category}`);
    return response.data;
  }

  // Test de conexión
  async testConnection(): Promise<Product[]> {
    const response = await axios.get<Product[]>(BASE_URL);
    return response.data;
  }

  // Apply discount (as per your controller)
  async applyDiscount(id: number, discount: number): Promise<Product> {
    const response = await axios.put<Product>(`${BASE_URL}/ofertas/${id}`, null, {
      params: { newDiscount: discount }
    });
    return response.data;
  }

  // Update stock
  async updateStock(id: number, stock: number): Promise<Product> {
    const response = await axios.patch<Product>(`${BASE_URL}/${id}/stock`, null, {
      params: { newStock: stock }
    });
    return response.data;
  }
}

// Exportamos la instancia
const productService = new ProductService();
export default productService;