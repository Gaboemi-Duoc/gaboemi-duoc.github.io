
const productos = [
	{id: 1, nombre: "Super Mario Wonder", descripcion: "Mario y compañia tienen una nueva aventura en Nintendo Switch", precio: "59.990", img: "images/images.jpg", link:"wonder.html"},
	{id: 2, nombre: "Hollow Knight", descripcion: "Hallownest te espera para una aventura nunca antes vista", precio: "19.990", img: "images/hollow k.jpg", link:"hollow.html"},
	{id: 3, nombre: "Devil May Cry 5", descripcion: "El regreso de uno de los juegos más queridos de Capcom", precio: "59.990", img: "images/devil-may-cry-5-4318.jpg", link:"devil5.html"},
	{id: 4, nombre: "Minecraft", descripcion: "Un juego de minecraft", precio: "12.990", img: "images/FWrTzT7XoAAqMAj.png", link:"minecraft.html"},
	{id: 5, nombre: "Street Fighter 6", descripcion: "El último juego de la saga de peleas más famosa", precio: "69.990", img: "images/Str6.jpg", link:"street.html"},
	{id: 6, nombre: "Battlefield 6", descripcion: "La saga Battlefield vuelve con batallas épicas", precio: "59.990", img:"images/disparo6.jpg", link:"battlefield.html"},
	{id: 7, nombre: "Metroid Prime 4", descripcion: "Samus Aran regresa en una nueva misión intergaláctica", precio: "69.990", img:"images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png", link:"metroid.html"},
	{id: 8, nombre: "The Legend of Zelda: Tears of the Kingdom", descripcion: "La secuela de Breath of the Wild llega con un mundo aún más grande", precio: "69.990", img:"images/0WxlWsN.jpeg", link:"zelda.html"}
];

function Producto({ prod, onAdd }) {
	return (
		<div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
			<div className="producto-card">
				<a href={prod.link} className="producto-link">
				<div className="producto-img">
					<img src={prod.img} alt={prod.nombre} className="img-fluid" />
				</div>
				<div className="producto-info text-center mt-2">
					<h5 className="producto-nombre">{prod.nombre}</h5>
					<p className="producto-precio">${prod.precio}</p>
				</div>
				</a>
				<button
				onClick={() => onAdd(prod)}
				className="btn btn-success mt-2 w-100"
				>
				Agregar al carrito
				</button>
			</div>
		</div>
	);
}

function Carrusel() {
	const imagenes = [
		"images/djg4d1m-9ac6075f-3922-4301-8ec4-7c83e270d964.png",
		"images/hollow k.jpg",
		"images/devil-may-cry-5-4318.jpg",
	];

	return (
		<div
		id="carouselExample"
		className="carousel slide mt-3"
		data-bs-ride="carousel" /* ← ACTIVA EL MOVIMIENTO AUTOMÁTICO */
		>
		<div className="carousel-inner">
			{imagenes.map((src, index) => (
			<div
				key={index}
				className={`carousel-item ${index === 0 ? "active" : ""}`}
			>
				<img src={src} className="d-block w-100" alt={`slide-${index}`} />
			</div>
			))}
		</div>
		<button
			className="carousel-control-prev"
			type="button"
			data-bs-target="#carouselExample"
			data-bs-slide="prev"
		>
			<span className="carousel-control-prev-icon" aria-hidden="true"></span>
			<span className="visually-hidden">Anterior</span>
		</button>
		<button
			className="carousel-control-next"
			type="button"
			data-bs-target="#carouselExample"
			data-bs-slide="next"
		>
			<span className="carousel-control-next-icon" aria-hidden="true"></span>
			<span className="visually-hidden">Siguiente</span>
		</button>
		</div>
	);
}

function Carrito({ carrito, onRemove }) {
	if (carrito.length === 0) return null;

	const total = carrito.reduce(
		(acc, p) => acc + parseFloat(p.precio.replace(/\./g, "")),
		0
	);

	return (
		<div className="carrito-panel p-3 bg-light border rounded mt-3">
		{carrito.map((prod, index) => (
			<div
			key={index}
			className="carrito-item d-flex justify-content-between align-items-center mb-2"
			>
			<div className="d-flex align-items-center">
				<img
				src={prod.img}
				alt={prod.nombre}
				className="carrito-img me-2"
				width="50"
				/>
				<div>
				<p className="mb-0">{prod.nombre}</p>
				<p className="mb-0">${prod.precio}</p>
				</div>
			</div>
			<button
				onClick={() => onRemove(index)}
				className="btn btn-sm btn-danger"
			>
				X
			</button>
			</div>
		))}
		<p className="mt-2">
			<strong>Total:</strong> ${total.toLocaleString()}
		</p>
		</div>
	);
}

function App() {
	const [carrito, setCarrito] = React.useState([]);

	const agregarAlCarrito = (producto) => {
		setCarrito([...carrito, producto]);
	};

	const eliminarDelCarrito = (index) => {
		setCarrito(carrito.filter((_, i) => i !== index));
	};

	return (
		<div className="container mt-4">
		{/* Carrusel arriba */}
		<Carrusel />

		{/* Productos */}
		<div className="row justify-content-center mt-4">
			{productos.map((prod) => (
			<Producto key={prod.id} prod={prod} onAdd={agregarAlCarrito} />
			))}
		</div>

		{/* Carrito */}
		<Carrito carrito={carrito} onRemove={eliminarDelCarrito} />
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);