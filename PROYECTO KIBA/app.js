const productos = [
  {
    id: 1,
    nombre: "Super Mario Wonder",
    descripcion: "Mario y compañia tienen una nueva aventura en Nintendo Switch",
    precio: "59.990",
    img: "imagenes/images.jpg"
  },
  {
    id: 2,
    nombre: "Hollow Knight",
    descripcion: "Hallownest te espera para una aventura nunca antes vista",
    precio: "19.990",
    img: "imagenes/hollow k.jpg"
  },
  {
    id: 3,
    nombre: "Devil May Cry 5",
    descripcion: "El regreso de uno de los juegos más queridos de Capcom",
    precio: "59.990",
    img: "imagenes/devil-may-cry-5-4318.jpg"
  },
  {
    id: 4,
    nombre: "Minecraft",
    descripcion: "Un juego de minecraft",
    precio: "12.990",
    img: "imagenes/FWrTzT7XoAAqMAj.png"
  },
  {
    id: 5,
    nombre: "street fighter 6",
    descripcion: "juego de pelea",
    precio: "69.990",
    img: "imagenes/Str6.jpg"
  },
  {
    id:6,
    nombre: "Battlefield 6",
    descripcion: "un juego que esta reviviendo",
    precio: "59.990",
    img:"imagenes/disparo6.jpg"
  }
];

// Renderizado dinámico
function renderProductos(lista) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  lista.forEach(prod => {
    contenedor.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card">
          <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <p>${prod.precio}</p>
            <a href="#" class="btn btn-primary">Comprar</a>
          </div>
        </div>
      </div>
    `;
  });
}

renderProductos(productos);
