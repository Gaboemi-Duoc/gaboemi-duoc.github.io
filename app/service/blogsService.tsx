interface Blog {
  id_blog: number;
  nombre: string;
  description: string | null;
  body: string;
  date: string;
  writer: string;
}

interface BlogResponse {
  data: Blog[];
  message?: string;
}

class blogsService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }

  // Get all blogs
  async getAllBlogs(): Promise<BlogResponse> {
    try {
      const response = await fetch(`${this.baseURL}/blog`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Don't cache for dynamic data
      });

      if (!response.ok) {
        throw new Error(`Error fetching blogs: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error in getAllBlogs:', error);
      return { data: [], message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get blog by ID
  async getBlogById(id: number): Promise<Blog | null> {
    try {
      const response = await fetch(`${this.baseURL}/blog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error fetching blog: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getBlogById:', error);
      return null;
    }
  }

  // Get recent blogs (last 10)
  async getRecentBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(`${this.baseURL}/blog/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching recent blogs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getRecentBlogs:', error);
      return [];
    }
  }

  // Search blogs by keyword in name
  async searchBlogsByName(keyword: string): Promise<Blog[]> {
    try {
      const response = await fetch(`${this.baseURL}/blog/search/nombre/${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error searching blogs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in searchBlogsByName:', error);
      return [];
    }
  }

  // Search blogs by keyword in description
  async searchBlogsByDescription(keyword: string): Promise<Blog[]> {
    try {
      const response = await fetch(`${this.baseURL}/blog/search/description/${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error searching blogs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in searchBlogsByDescription:', error);
      return [];
    }
  }

  // Get blogs by writer
  async getBlogsByWriter(writer: string): Promise<Blog[]> {
    try {
      const response = await fetch(`${this.baseURL}/blog/writer/${encodeURIComponent(writer)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Error fetching blogs by writer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getBlogsByWriter:', error);
      return [];
    }
  }

  // Count total blogs
  async countBlogs(): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/blog/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error counting blogs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in countBlogs:', error);
      return 0;
    }
  }

  // Create new blog (if you need admin functionality)
  async createBlog(blogData: Omit<Blog, 'id_blog'>): Promise<Blog | null> {
    try {
      const response = await fetch(`${this.baseURL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`Error creating blog: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createBlog:', error);
      return null;
    }
  }
}

export default new blogsService();
export type { Blog };