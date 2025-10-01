// Datos de productos
const productos = [
  { id: 1, nombre: "Super Mario Wonder", descripcion: "Mario y compañia tienen una nueva aventura en Nintendo Switch", precio: "59.990", img: "images/images.jpg", genero:"Aventura", tamano:"Próximamente", jugadores:1, lanzamiento:"Por confirmar", desarrollador:"Nintendo" },
  { id: 2, nombre: "Hollow Knight", descripcion: "Hallownest te espera para una aventura nunca antes vista", precio: "19.990", img: "images/hollow k.jpg", genero:"Aventura / Metroidvania", tamano:"Próximamente", jugadores:1, lanzamiento:"Por confirmar", desarrollador:"Team Cherry" },
  { id: 3, nombre: "Devil May Cry 5", descripcion: "El regreso de uno de los juegos más queridos de Capcom", precio: "59.990", img: "images/devil-may-cry-5-4318.jpg", genero:"Acción / Hack and Slash", tamano:"Próximamente", jugadores:1, lanzamiento:"2019", desarrollador:"Capcom" },
  { id: 4, nombre: "Minecraft", descripcion: "Un juego de minecraft", precio: "12.990", img: "images/FWrTzT7XoAAqMAj.png", genero:"Sandbox / Aventura", tamano:"Varía según plataforma", jugadores:4, lanzamiento:"2011", desarrollador:"Mojang" },
  { id: 5, nombre: "Street Fighter 6", descripcion: "El último juego de la saga de peleas más famosa", precio: "69.990", img: "images/Str6.jpg", genero:"Lucha", tamano:"Próximamente", jugadores:2, lanzamiento:"2023", desarrollador:"Capcom" },
  { id: 6, nombre: "Battlefield 6", descripcion: "La saga Battlefield vuelve con batallas épicas", precio: "59.990", img:"images/disparo6.jpg", genero:"Shooter / Guerra", tamano:"Próximamente", jugadores:64, lanzamiento:"2023", desarrollador:"EA DICE" },
  { id: 7, nombre: "Metroid Prime 4", descripcion: "Samus Aran regresa en una nueva misión intergaláctica", precio: "69.990", img:"images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png", genero:"Aventura / Shooter", tamano:"Próximamente", jugadores:1, lanzamiento:"Por confirmar", desarrollador:"Retro Studios" },
  { id: 8, nombre: "The Legend of Zelda: Tears of the Kingdom", descripcion: "La secuela de Breath of the Wild llega con un mundo aún más grande", precio: "69.990", img:"images/0WxlWsN.jpeg", genero:"Aventura / RPG", tamano:"Próximamente", jugadores:1, lanzamiento:"2023", desarrollador:"Nintendo" },
  {id: 9,nombre: "Hollow Knight: Silksong",descripcion: "La esperada secuela de Hollow Knight, acompañando a Hornet en una nueva aventura por Hallownest.",precio: "29.990",img: "images/hollowsilksong.jpg",genero: "Aventura / Metroidvania",tamano: "Próximamente",jugadores: 1,lanzamiento: "Por confirmar",desarrollador: "Team Cherry"}
];

// Componente para cada producto en la lista
function Producto({ prod, onAdd }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="producto-card">
        <a href={`?id=${prod.id}`} className="producto-link">
          <div className="producto-img">
            <img src={prod.img} alt={prod.nombre} className="img-fluid" />
          </div>
          <div className="producto-info text-center mt-2">
            <h5 className="producto-nombre">{prod.nombre}</h5>
            <p className="producto-precio">${prod.precio}</p>
          </div>
        </a>
        <button onClick={() => onAdd(prod)} className="btn btn-success mt-2 w-100">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

// Carrusel
function Carrusel() {
  const imagenes = [
    "images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
    "images/hollow k.jpg",
    "images/devil-may-cry-5-4318.jpg",
  ];

  return (
    <div id="carouselExample" className="carousel slide mt-3" data-bs-ride="carousel">
      <div className="carousel-inner">
        {imagenes.map((src, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img src={src} className="d-block w-100" alt={`slide-${index}`} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}

// Carrito
function Carrito({ carrito, onRemove }) {
  if (carrito.length === 0) return null;
  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio.replace(/\./g, "")), 0);

  return (
    <div className="carrito-panel p-3 bg-light border rounded mt-3">
      {carrito.map((prod, index) => (
        <div key={index} className="carrito-item d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img src={prod.img} alt={prod.nombre} className="carrito-img me-2" width="50" />
            <div>
              <p className="mb-0">{prod.nombre}</p>
              <p className="mb-0">${prod.precio}</p>
            </div>
          </div>
          <button onClick={() => onRemove(index)} className="btn btn-sm btn-danger">X</button>
        </div>
      ))}
      <p className="mt-2"><strong>Total:</strong> ${total.toLocaleString()}</p>
    </div>
  );
}

// Detalle de producto
function ProductoDetalle({ producto }) {
  if (!producto) return <h2 className="text-center mt-5">Producto no encontrado 😢</h2>;
  return (
    <main style={{ paddingTop: "4.5rem" }}>
      <div className="producto-detalle-container mt-5 p-4 d-flex flex-wrap justify-content-center align-items-start gap-4">
        <div className="producto-imagen text-center">
          <img src={producto.img} alt={producto.nombre} className="producto-detalle-img img-fluid rounded shadow" />
        </div>
        <div className="producto-detalle-info" style={{ maxWidth: "500px" }}>
          <h1>{producto.nombre}</h1>
          <p className="precio fs-4 text-success fw-bold">${producto.precio}</p>
          <p>{producto.descripcion}</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item"><strong>Género:</strong> {producto.genero}</li>
            <li className="list-group-item"><strong>Tamaño:</strong> {producto.tamano}</li>
            <li className="list-group-item"><strong>Jugadores:</strong> {producto.jugadores}</li>
            <li className="list-group-item"><strong>Lanzamiento:</strong> {producto.lanzamiento}</li>
            <li className="list-group-item"><strong>Desarrollador:</strong> {producto.desarrollador}</li>
          </ul>
          <button className="btn btn-success w-100 mb-2">Comprar Ahora</button>
          <button className="btn btn-secondary w-100" onClick={() => window.history.back()}>Volver</button>
        </div>
      </div>
    </main>
  );
}

// Componente principal
function App() {
  const [carrito, setCarrito] = React.useState([]);

  const agregarAlCarrito = (producto) => setCarrito([...carrito, producto]);
  const eliminarDelCarrito = (index) => setCarrito(carrito.filter((_, i) => i !== index));

  // Detectar si hay ?id= en la URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const producto = productos.find(p => p.id === id);

  return (
    <div className="container mt-4">
      <Carrusel />
      {producto ? (
        <ProductoDetalle producto={producto} />
      ) : (
        <div className="row justify-content-center mt-4">
          {productos.map(prod => <Producto key={prod.id} prod={prod} onAdd={agregarAlCarrito} />)}
        </div>
      )}
      <Carrito carrito={carrito} onRemove={eliminarDelCarrito} />
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
