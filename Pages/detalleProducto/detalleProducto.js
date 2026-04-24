import { AuthService } from "../../Services/AuthService.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. GUARDIÁN DE RUTAS
    const usuarioLogueado = AuthService.obtenerUsuarioActual();
    if (!usuarioLogueado) {
        window.location.href = '../../index.html';
        return;
    }

    // 2. LEER QUÉ CUENTA QUEREMOS VER
    const params = new URLSearchParams(window.location.search);
    const tipoCuentaBuscada = params.get('state') || 'ahorros';

    // 3. BUSCADOR INTELIGENTE
    const cuentaReal = usuarioLogueado.cuentas.find(c => {
        const tipoDB = (c.tipo || c.tipoProducto || '').toLowerCase();
        const tipoURL = tipoCuentaBuscada.toLowerCase();
        
        return tipoDB === tipoURL || 
               tipoURL.includes(tipoDB) || 
               (tipoURL === 'tarjeta_credito' && tipoDB === 'credito');
    });

    if (cuentaReal) {
        updateAccountState(cuentaReal);
        renderMovimientos(cuentaReal.movimientos);
        actualizarEnlacesAcciones(cuentaReal); // NUEVO: Actualiza los botones de la vista
    } else {
        console.error(`❌ No se encontró la cuenta: ${tipoCuentaBuscada} en el portafolio.`);
        document.getElementById('account-type-label').textContent = "Cuenta no encontrada";
        document.getElementById('account-balance').textContent = "$0.00";
    }
});

/**
 * Updates the UI based on the REAL account object
 */
function updateAccountState(cuenta) {
    // 1. Extracción de datos seguros (Salvavidas)
    const tipo = cuenta.tipo || cuenta.tipoProducto || 'ahorros';
    const numeroStr = String(cuenta.numeroCuenta || cuenta.numero || "0000");
    const saldoNumerico = parseFloat(cuenta.saldo) || 0; // Previene NaN

    // 2. Formateo de dinero
    const saldoFormateado = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
    }).format(saldoNumerico);

    // 3. Actualización de textos principales
    document.getElementById('account-type-label').textContent = getVisualName(tipo);
    document.getElementById('account-number').textContent = `**** ${numeroStr.slice(-4)}`;
    document.getElementById('account-balance').textContent = saldoFormateado;
    
    // 4. Lógica condicional según el tipo de producto
    const balanceLabel = document.getElementById('balance-label');
    const btnText = document.getElementById('central-action-text');
    const btnIcon = document.getElementById('central-action-icon');
    const creditDetails = document.getElementById('credit-details');
    const adelantoBtn = document.getElementById('adelanto-btn');

    if (tipo.includes('credito')) {
        // Vista para Tarjeta de Crédito
        if (balanceLabel) balanceLabel.textContent = 'Saldo Actual (Deuda)';
        if (btnText) btnText.textContent = 'Pagar Tarjeta';
        if (btnIcon) btnIcon.textContent = 'payments';
        if (creditDetails) creditDetails.classList.remove('hidden');
        if (adelantoBtn) adelantoBtn.classList.remove('hidden'); // Opciones adicionales de tarjeta
    } else {
        // Vista para Cuentas (Ahorro / Corriente)
        if (balanceLabel) balanceLabel.textContent = 'Saldo Disponible';
        if (btnText) btnText.textContent = 'Retirar';
        if (btnIcon) btnIcon.textContent = tipo.includes('corriente') ? 'local_atm' : 'atm';
        if (creditDetails) creditDetails.classList.add('hidden');
        if (adelantoBtn) adelantoBtn.classList.add('hidden');
    }
}

/**
 * Actualiza los href de los botones para que lleven el contexto de la cuenta actual
 */
function actualizarEnlacesAcciones(cuenta) {
    const tipo = cuenta.tipo || cuenta.tipoProducto || 'ahorros';
    const numero = cuenta.numeroCuenta || cuenta.numero;

    // Buscamos los botones en el HTML. (Asegúrate de que tengan estas clases o IDs)
    const btnTransferir = document.querySelector('a[href*="transferencia.html"]');
    const btnCentral = document.getElementById('central-action-btn'); 

    // Al botón de transferir le pasamos la cuenta origen en la URL
    if (btnTransferir) {
        btnTransferir.href = `../transferencia/transferencia.html?origen=${numero}`;
    }

    // El botón central cambia de destino según el producto
    if (btnCentral) {
        if (tipo.includes('credito')) {
            // Si es crédito, va a la vista de pagos
            btnCentral.href = `../pagarTarjeta/pagarTarjeta.html?cuenta=${numero}`;
        } else {
            // Si es cuenta, va a la vista de retiro
            btnCentral.href = `../retiro/retiro.html?cuenta=${numero}`;
        }
    }
}

/**
 * Renderiza el historial de transacciones dinámicamente
 */
function renderMovimientos(movimientos) {
    const contenedor = document.getElementById('transactions-container'); 
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!movimientos || movimientos.length === 0) {
        contenedor.innerHTML = `
            <div class="transaction-item" style="justify-content: center; opacity: 0.5;">
                <p>No hay movimientos recientes.</p>
            </div>`;
        return;
    }

    const historialReciente = [...movimientos].reverse();

    historialReciente.forEach(mov => {
        // 🏗️ FIX: Programación Defensiva. Si mov.tipo no existe, usamos un texto vacío ('').
        // Además lo convertimos a mayúsculas por seguridad.
        const tipoSeguro = String(mov.tipo || '').toUpperCase();

        // Ahora evaluamos sobre la variable segura, esto nunca lanzará error
        const esIngreso = tipoSeguro.includes('DEPOSITO') || tipoSeguro.includes('TRANSFER_IN');
        const signo = esIngreso ? '+' : '-';
        const claseMonto = esIngreso ? 'positive' : 'negative'; 
        const iconName = esIngreso ? 'south_west' : 'north_east';

        const montoFormateado = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD'
        }).format(mov.monto || 0); // También blindamos el monto por si acaso

        // Blindamos la fecha por si es inválida
        const fechaMostrada = mov.fecha 
            ? new Date(mov.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Fecha desconocida';

        const div = document.createElement('div');
        div.className = 'transaction-item';
        
        div.innerHTML = `
            <div class="item-info">
                <div class="icon-box">
                    <span class="material-symbols-outlined">${iconName}</span>
                </div>
                <div class="item-text">
                    <p class="item-title">${mov.concepto || mov.tipo || 'Transacción'}</p>
                    <p class="item-date">${fechaMostrada}</p>
                </div>
            </div>
            <p class="item-amount ${claseMonto}">${signo}${montoFormateado}</p>
        `;

        div.addEventListener('click', () => {
            div.style.backgroundColor = 'var(--surface-container-highest)';
            setTimeout(() => div.style.backgroundColor = '', 200);
        });

        contenedor.appendChild(div);
    });
}

/**
 * Traduce el tipo técnico de la DB a un nombre bonito para el usuario
 */
function getVisualName(value) {
    if (!value) return 'Producto Financiero';

    const names = {
        'ahorros': 'Cuenta de Ahorros',
        'corriente': 'Cuenta Corriente',
        'credito': 'Tarjeta de Crédito',
        'tarjeta_credito': 'Tarjeta de Crédito'
    };
    
    return names[value.toLowerCase()] || value;
}