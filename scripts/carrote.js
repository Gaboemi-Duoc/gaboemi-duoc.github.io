
// Carga carrito desde sessionStorage al iniciar
let carrito = [];
carrito = JSON.parse(sessionStorage.getItem("carrito"))
if (!carrito) carrito = [];

function renderCarrote() {
    const contenedor = document.getElementById("carrito-items")
    contenedor.innerHTML = "";

	if (!carrito || carrito.length === 0) {
		contenedor.innerHTML = "";
		contenedor.innerHTML += `
		<h1 class="text-center py-4">Tu carrito está vacío.</h1>
		<h3 class="text-center py-5">Agrega tus juegos para verlos aquí.</h3>
		`;
		return;
	} else {
		carrito.forEach((prod, index) => {
			contenedor.innerHTML += `

					<!-- Left: Image, Name, Price -->
					<div class="col-md-8 d-flex align-items-center" style="margin-top: 1rem; margin-bottom: 1rem;">
						<img src="${prod.img}?v=1731071285&amp;width=300" class="cart-item__image me-3" alt="" loading="lazy" width="100" height="100">
						<div>
							<a href="${prod.link}" class="h5 mb-1 d-block">${prod.nombre}</a>
							<div>
								<strong class="cart-item__final-price product-option">
									<span class="money buckscc-converted buckscc-money" bucks-original="$${prod.precio}" bucks-init="${prod.precio}" bucks-current="$${prod.precio} CLP" bucks-currency="CLP">$${prod.precio} CLP</span>
								</strong>
							</div>
						</div>
					</div>
					<!-- Right: Quantity, Subtotal, Remove -->
					<div class="col-md-4 d-flex flex-column align-items-end justify-content-center h-100">
						<button onclick="eliminarDelCarrito(${index})" class="btn btn-danger btn-sm d-flex align-items-center" aria-label="Eliminar PLAYSTATION PLUS ESSENTIAL 3 MESES - PS4">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" class="icon icon-remove" width="16" height="16" fill="none">
								<path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
								<path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
							</svg>
							Eliminar
						</button>
					</div>
		`;
		});

		// Total
		const contenedor2 = document.getElementById("carrito-total")
		contenedor2.innerHTML = "";
		const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio.replace(/\./g, '')), 0);
		contenedor2.innerHTML += `
					<p class="total-carrito"><strong>Total:</strong> $${total.toLocaleString()} CLP</p>
					<button class="btn btn-success mt-3 float-end">Pagar Pedido</button>`;
	}
}


// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  sessionStorage.setItem("carrito", JSON.stringify(carrito))
  renderCarrote();
}

window.eliminarDelCarrito = eliminarDelCarrito;
renderCarrote()