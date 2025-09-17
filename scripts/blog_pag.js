import blogs from "./blogs.js";


// Renderizado de blogs
function renderBlogs(lista) {
  console.log(blogs)
  const contenedor = document.getElementById("blog-container");
  contenedor.innerHTML = "";

  lista.forEach(blog => {
    contenedor.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="producto-card">
          <!-- Enlace directo a la página del producto -->
          <a href="${blog.link}" class="producto-link">
            <div class="producto-img">
              <img src="${blog.img}" alt="${blog.nombre}" class="img-fluid">
            </div>
            <div class="producto-info text-center mt-2">
              <h5 class="producto-nombre">${blog.nombre}</h5>
              <p class="producto-precio">${blog.descripcion}</p>
            </div>
          </a>
          <a href="${blog.link}" class="btn btn-success mt-2 w-100">Leer el Articulo</a>
        </div>
      </div>
    `;
  });
}
// Inicializar blogs
renderBlogs(blogs);