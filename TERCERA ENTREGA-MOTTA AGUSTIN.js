

// Monedas soportadas con sus ids para la API y nombres bonitos
// Lista de monedas disponibles
const monedas = [
    { id: "tether", nombre: "USDT" },
    { id: "bitcoin", nombre: "BTC" },
  ];
  
  // Crear elementos HTML rápido
  function crearElemento(tipo, atributos = {}, texto = "") {
    const el = document.createElement(tipo);
    for (let key in atributos) {
      el.setAttribute(key, atributos[key]);
    }
    if (texto) el.textContent = texto;
    return el;
  }
  
  // Crear toda la interfaz
  function crearInterfaz() {
    const app = document.getElementById("app");
    app.innerHTML = "";
  
    const contenedor = crearElemento("div", { class: "container" });
  
    const header = crearElemento("header");
    const h1 = crearElemento("h1", {}, "Merryweather");
    header.appendChild(h1);
  
    const main = crearElemento("main");
  
    const formSection = crearElemento("section", { id: "conversor-form" });
    const tituloForm = crearElemento("h2", {}, "Convertidor de Monedas");
  
    const grupoMoneda = crearElemento("div", { class: "form-group" });
    const labelMoneda = crearElemento("label", { for: "moneda" }, "Seleccione la moneda a convertir:");
    const selectMoneda = crearElemento("select", { id: "moneda" });
    monedas.forEach(m => {
      const option = crearElemento("option", { value: m.id }, m.nombre);
      selectMoneda.appendChild(option);
    });
    grupoMoneda.append(labelMoneda, selectMoneda);
  
    const grupoCantidad = crearElemento("div", { class: "form-group" });
    const labelCantidad = crearElemento("label", { for: "cantidad" }, "Ingrese la cantidad:");
    const inputCantidad = crearElemento("input", { type: "number", id: "cantidad", placeholder: "Cantidad" });
    grupoCantidad.append(labelCantidad, inputCantidad);
  
    const btnConvertir = crearElemento("button", { id: "convertir-btn", class: "btn" }, "Convertir");
  
    formSection.append(tituloForm, grupoMoneda, grupoCantidad, btnConvertir);
  
    const resultadoSection = crearElemento("section", { id: "resultado", class: "hidden" });
    const tituloResultado = crearElemento("h3", {}, "Resultado de la Conversión");
    const parrafoResultado = crearElemento("p", { id: "resultado-text" });
    const btnGuardar = crearElemento("button", { id: "guardar-btn", class: "btn" }, "Guardar en la Bitácora");
    const btnContinuar = crearElemento("button", { id: "continuar-btn", class: "btn" }, "Continuar");
  
    resultadoSection.append(tituloResultado, parrafoResultado, btnGuardar, btnContinuar);
  
    const bitacoraSection = crearElemento("section");
    const tituloBitacora = crearElemento("h2", {}, "Bitácora de Conversiones");
    const ulCarrito = crearElemento("ul", { id: "carrito" });
    bitacoraSection.append(tituloBitacora, ulCarrito);
  
    main.append(formSection, resultadoSection, bitacoraSection);
    contenedor.append(header, main);
    app.appendChild(contenedor);
  
    // Eventos
    btnConvertir.addEventListener("click", convertir);
    btnGuardar.addEventListener("click", guardarBitacora);
    btnContinuar.addEventListener("click", continuar);
  
    mostrarBitacora();
  }
  
  // Obtener precio con fetch
  function obtenerPrecio(moneda) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${moneda}&vs_currencies=ars`;
    return fetch(url)
      .then(res => res.json())
      .then(data => data[moneda].ars)
      .catch(() => null);
  }
  
  // Convertir moneda
  function convertir() {
    const moneda = document.getElementById("moneda").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
  
    if (!cantidad || cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Por favor ingrese una cantidad válida mayor que cero.'
      });
      return;
    }
  
    obtenerPrecio(moneda).then(precio => {
      if (precio === null) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener el precio. Intente más tarde.'
        });
        return;
      }
  
      const resultado = cantidad * precio;
  
      document.getElementById("resultado-text").textContent = `${cantidad} ${moneda.toUpperCase()} son ${resultado.toFixed(2)} pesos argentinos.`;
  
      sessionStorage.setItem("ultimaConversion", JSON.stringify({ moneda, cantidad, resultado }));
  
      document.getElementById("resultado").classList.remove("hidden");
      document.getElementById("conversor-form").classList.add("hidden");
    });
  }
  
  // Mostrar bitácora guardada
  function mostrarBitacora() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const ul = document.getElementById("carrito");
    ul.innerHTML = "";
  
    if (carrito.length === 0) {
      ul.innerHTML = "<li>No hay conversiones guardadas.</li>";
      return;
    }
  
    carrito.forEach(item => {
      const li = crearElemento("li", {}, `${item.cantidad} ${item.moneda.toUpperCase()} = ${item.resultado.toFixed(2)} pesos`);
      ul.appendChild(li);
    });
  }
  
  // Guardar conversión en localStorage
  function guardarBitacora() {
    const ultima = sessionStorage.getItem("ultimaConversion");
    if (!ultima) {
      Swal.fire({
        icon: 'info',
        title: 'Nada para guardar',
        text: 'No hay conversión para guardar.'
      });
      return;
    }
  
    const conversion = JSON.parse(ultima);
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(conversion);
  
    localStorage.setItem("carrito", JSON.stringify(carrito));
  
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'Conversión guardada en la bitácora.'
    });
  
    mostrarBitacora();
    continuar();
  }
  
  // Continuar para nueva conversión
  function continuar() {
    document.getElementById("cantidad").value = "";
    document.getElementById("resultado").classList.add("hidden");
    document.getElementById("conversor-form").classList.remove("hidden");
  
    sessionStorage.removeItem("ultimaConversion");
  }
  
  // Arranca la app
  crearInterfaz();
  
