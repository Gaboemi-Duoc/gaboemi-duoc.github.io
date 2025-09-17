import productos from "./productos.js";

// Carga carrito desde sessionStorage al iniciar
let carrito = [];
carrito = JSON.parse(sessionStorage.getItem("carrito"))
if (!carrito) carrito = [];

function renderCarrote() {
    const contenedor = document.getElementById("carrote-container")
    
    contenedor.style.display = "block";
    contenedor.innerHTML = "";

    carrito.forEach((prod, index) => {
        contenedor.innerHTML += `
      
    `;
    });

    // Total
    const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio.replace(/\./g, '')), 0);
    contenedor.innerHTML += `<p class="total-carrito"><strong>Total:</strong> $${total.toLocaleString()}</p>`;
}

