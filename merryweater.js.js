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
  while (continuar) {
    let entrada = prompt(
      "Ingrese el número correspondiente para continuar:\n1. Convertir USDT a pesos.\n2. Convertir Bitcoin a pesos."
    );

    if (entrada === "1") {
      let usdt = parseFloat(prompt("Ingrese los USDT que desea convertir a pesos:"));
      if (!isNaN(usdt)) {
        const precioUSDT = await obtenerPrecio("tether");
        if (precioUSDT !== null) {
          alert(`${usdt} USDT son ${usdt * precioUSDT} pesos argentinos.`);
        }
      } else {
        alert("Número inválido.");
      }

    } else if (entrada === "2") {
      let btc = parseFloat(prompt("Ingrese los BTC que desea convertir a pesos:"));
      if (!isNaN(btc)) {
        const precioBTC = await obtenerPrecio("bitcoin");
        if (precioBTC !== null) {
          alert(`${btc} BTC son ${btc * precioBTC} pesos argentinos.`);
        }
      } else {
        alert("Número inválido.");
      }

    } else {
      alert("Opción no válida.");
    }

    continuar = confirm("¿Desea continuar?");
  }
}

convertir();
  
