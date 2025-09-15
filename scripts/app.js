// Lista de productos (sin cambios)
const productos = [
  { 
    id: 1,
    nombre: "Super Mario Wonder",
    descripcion: "Mario y compañia tienen una nueva aventura en Nintendo Switch",
    precio: "59.990",
    img: "images/images.jpg",
    link:"PROYECTO KIBAproductos/wonderpack/wonder.html" 
  },
  { 
    id: 2,
    nombre: "Hollow Knight",
    descripcion: "Hallownest te espera para una aventura nunca antes vista",
    precio: "19.990",
    img: "images/hollow k.jpg",
    link:"productos/hollowpack/hollow.html"
  },
  { 
    id: 3,
    nombre: "Devil May Cry 5",
    descripcion: "El regreso de uno de los juegos más queridos de Capcom",
    precio: "59.990",
    img: "images/devil-may-cry-5-4318.jpg" 
  },
  { 
    id: 4,
    nombre: "Minecraft",
    descripcion: "Un juego de minecraft",
    precio: "12.990",
    img: "images/FWrTzT7XoAAqMAj.png" 
  },
  { 
    id: 5,
    nombre: "street fighter 6",
    descripcion: "juego de pelea",
    precio: "69.990",
    img: "images/Str6.jpg" 
  },
  { 
    id: 6,
    nombre: "Battlefield 6",
    descripcion: "un juego que esta reviviendo",
    precio: "59.990",
    img:"images/disparo6.jpg" 
  }
];

// Carrito de compras
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
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
  renderCarrito();
}

// Inicializar catálogo
renderProductos(productos);
