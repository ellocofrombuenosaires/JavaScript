
let continuar = true;

async function obtenerPrecio(moneda) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${moneda}&vs_currencies=ars`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos[moneda].ars;
  } catch (error) {
    alert("Error al obtener el precio. Intenta más tarde.");
    return null;
  }
}

async function convertir() {
  const monedaSeleccionada = document.getElementById("moneda").value;
  const cantidad = parseFloat(document.getElementById("cantidad").value);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingrese una cantidad válida.");
    return;
  }

  const precio = await obtenerPrecio(monedaSeleccionada);

  if (precio !== null) {
    const resultado = cantidad * precio;
    document.getElementById("resultado-text").innerText = `${cantidad} ${monedaSeleccionada.toUpperCase()} son ${resultado.toFixed(2)} pesos argentinos.`;
    document.getElementById("resultado").classList.remove("hidden");

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ moneda: monedaSeleccionada, cantidad: cantidad, resultado: resultado });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
  }
}

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const listaCarrito = document.getElementById("carrito");
  listaCarrito.innerHTML = ""; 

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.cantidad} ${item.moneda.toUpperCase()} = ${item.resultado.toFixed(2)} pesos`;
    listaCarrito.appendChild(li);
  });
}

function continuarConversión() {
  document.getElementById("conversor-form").classList.remove("hidden");
  document.getElementById("resultado").classList.add("hidden");
  document.getElementById("cantidad").value = "";
}

function agregarAlabitacora() {
  alert("Conversión agregada a la bitácora.");
}

document.getElementById("convertir-btn").addEventListener("click", convertir);
document.getElementById("continuar-btn").addEventListener("click", continuarConversión);
document.getElementById("guardar-btn").addEventListener("click", agregarAlabitacora);

mostrarCarrito();  // Muestra la bitácora al cargar la página.
