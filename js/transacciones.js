function guardarListaTransaccionesLocalStorage(transacciones) {
  const transaccionesString = JSON.stringify(transacciones);
  localStorage.setItem("movimientos", transaccionesString);
}

function obtenerListaMovimientosLocalStorage() {
  const transacciones = localStorage.getItem("movimientos");
  const transaccionesJSON = JSON.parse(transacciones || "[]");
  return transaccionesJSON;
}

function añadirTransaccion(tipo, monto) {
  if (isNaN(monto) || monto <= 0) {
    alert("Monto inválido");
    return consultarSaldo();
  }

  const listaTransacciones = obtenerListaMovimientosLocalStorage();

  const nuevoSaldo = actualizarSaldo(tipo, monto);

  if (nuevoSaldo === null) {
    return consultarSaldo();
  }

  listaTransacciones.push({
    fecha: new Date().toLocaleString(),
    tipo: tipo,
    monto: monto,
  });

  guardarListaTransaccionesLocalStorage(listaTransacciones);

  return nuevoSaldo;
}

function consultarMovimientos() {
  const transactionsList = obtenerListaMovimientosLocalStorage();

  if (transactionsList.length === 0) {
    alert("¡No hay datos de movimientos disponibles!");
    return;
  }

  transactionsList.forEach((transaction) => {
    console.log(
      `Fecha: ${transaction.fecha} | Tipo: ${transaction.tipo} | Monto: ${transaction.monto}`,
    );
  });
}

function actualizarSaldo(tipo, monto) {
  let saldo = consultarSaldo();

  if (tipo === "consignacion") {
    saldo += monto;
  } else if (tipo === "retiro") {
    if (monto > saldo) {
      alert("Fondos insuficientes");
      return null;
    }

    saldo -= monto;
  }

  localStorage.setItem("saldoTotal", saldo);

  return saldo;
}

function consultarSaldo() {
  return parseFloat(
    localStorage.getItem("saldoTotal") ||
      localStorage.getItem("saldoInicial1") ||
      0,
  );
}

function mostrarMenu() {
  let opcionUsuario = prompt(
    "Seleccione la transacción deseada:\n" +
      "1. Consultar saldo.\n" +
      "2. Retirar dinero.\n" +
      "3. Consignar dinero.\n" +
      "4. Consultar movimientos.\n" +
      "5. Salir.",
  );

  if (opcionUsuario === null) {
    return;
  }

  iniciarTransaccion(opcionUsuario);
}

function iniciarTransaccion(opcionUsuario) {
  switch (opcionUsuario) {
    case "1":
      validarSaldo();
      break;

    case "2":
      retirarDinero();
      break;

    case "3":
      consignarDinero();
      break;

    case "4":
      consultarMovimientos();
      break;

    case "5":
      cerrarSession();
      return;

    default:
      alert("Opción no válida, intente nuevamente");
      break;
  }

  mostrarMenu();
}
