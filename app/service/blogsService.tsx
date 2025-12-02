import axios, { AxiosResponse } from "axios";

// URL base de la API para blogs
const BASE_URL = "https://goldencatapi-production.up.railway.app/api/blogs";

// Interfaz del blog según tu API
export interface Blog {
  id_blog: number;
  titulo: string;
  contenido: string;
  autor: string;
  fecha: string;
  imagen?: string; // imagen opcional
}

class BlogService {
  // Obtener todos los blogs
  getAllBlogs(): Promise<AxiosResponse<Blog[]>> {
    return axios.get(BASE_URL);
  }

  // Obtener un blog por ID
  getBlogByID(id: number): Promise<AxiosResponse<Blog>> {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // Crear un blog
  createBlog(blog: Blog): Promise<AxiosResponse<Blog>> {
    return axios.post(BASE_URL, blog);
  }

  // Actualizar un blog
  updateBlog(
    id: number,
    blog: Partial<Blog>
  ): Promise<AxiosResponse<Blog>> {
    return axios.put(`${BASE_URL}/${id}`, blog);
  }

  // Eliminar un blog
  deleteBlog(id: number): Promise<AxiosResponse<void>> {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  // Test de conexión
  testConnection(): Promise<AxiosResponse<Blog[]>> {
    return axios.get(BASE_URL);
  }
}

// Exportamos la instancia
const blogService = new BlogService();
export default blogService;
