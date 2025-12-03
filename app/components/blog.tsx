export interface Blog {
  id_blog: number;
  nombre: string;
  description: string | null;
  body: string;
  date: string;
  writer: string;
}

export interface UIBlog {
  id: number;
  titulo: string;
  resumen: string;
  img: string;
  fecha: string;
  autor: string;
}

export interface BlogDetail extends UIBlog {
  contenido: string;
  descripcion: string;
}