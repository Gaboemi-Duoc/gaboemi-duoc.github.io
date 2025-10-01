
function Nav(activePage) { // TODO: parametrizar la pag activa
	return (
		<nav class="navbar navbar-expand-sm fixed-top bg-warning">
			<div class="container-fluid">
				<a class="navbar-brand" href="#"><img src="images/zmart_logo.png" style="height: 46px;" alt=""></img></a>
				<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div id="offcanvasNavbar" class="offcanvas offcanvas-end bg-warning" tabindex="-1">
					<div class="offcanvas-header">
						<h5 id="offcanvasNavbarLabel" class="offcanvas-title">ZMART.CL</h5>
						<button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
							<li class="nav-item">
								<a class="nav-link active" aria-current="page" href="index.html">Home</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="index.html">Productos</a>
							</li>
							<li class="nav-item dropdown">
								<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Más
								</a>
								<ul class="dropdown-menu">
									<li><a class="dropdown-item" href="blogs.html">Blogs</a></li>
									<li><a class="dropdown-item" href="contacto.html">Contacto</a></li>
									<li><a class="dropdown-item" href="nosotros.html">Sobre Nosotros</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
				<a class="me-2" href="carrote.html"><img src="images/istockphoto-1206806317-612x612.jpg" width="40" alt="Carrito"></img></a>
			</div>
		</nav>
	);
}

function Footer() { //TODO: Si es que queremos un footer claro jsjs
	return (
		<footer>

		</footer>
	);
}

function Carrito() { //TODO: Aca deberiamos poner el carrito que te sigue toda la pagina
	return (
		<div>

		</div>
	);
}