import productos from "./productos.js";

// Carrito de compras
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    sessionStorage.setItem("carrito", JSON.stringify(carrito))
    renderCarrito(); // actualiza la interfaz
  }
}

// Renderizado de productos (catálogo)
function renderProductos(lista) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  lista.forEach(prod => {
    contenedor.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="producto-card">
          <!-- Enlace directo a la página del producto -->
          <a href="${prod.link}" class="producto-link">
            <div class="producto-img">
              <img src="${prod.img}" alt="${prod.nombre}" class="img-fluid">
            </div>
            <div class="producto-info text-center mt-2">
              <h5 class="producto-nombre">${prod.nombre}</h5>
              <p class="producto-precio">$${prod.precio}</p>
            </div>
          </a>
          <button onclick="agregarAlCarrito(${prod.id})" class="btn btn-success mt-2 w-100">Agregar al carrito</button>
        </div>
      </div>
    `;
  });
}

// Renderizado del carrito
function renderCarrito() {
  const contenedor = document.getElementById("carrito-container");

  // Ocultar carrito si está vacío
  if (carrito.length === 0) {
    contenedor.style.display = "none";
    return;
  }

  contenedor.style.display = "block";
  contenedor.innerHTML = "";

  carrito.forEach((prod, index) => {
    contenedor.innerHTML += `
      <div class="carrito-item">
        <img src="${prod.img}" alt="${prod.nombre}" class="carrito-img">
        <div>
          <p>${prod.nombre}</p>
          <p>$${prod.precio}</p>
        </div>
        <button onclick="eliminarDelCarrito(${index})" class="btn btn-sm btn-danger">X</button>
      </div>
    `;
  });

  // Total
  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio.replace(/\./g, '')), 0);
  contenedor.innerHTML += `<p class="total-carrito"><strong>Total:</strong> $${total.toLocaleString()}</p>`;
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  sessionStorage.setItem("carrito", JSON.stringify(carrito))
  renderCarrito();
}

// Hacer funciones accesibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;

// Inicializar catálogo
renderProductos(productos);
// Carga carrito desde sessionStorage al iniciar
carrito = JSON.parse(sessionStorage.getItem("carrito"))
if (!carrito) carrito = [];
renderCarrito()
