/**
 * Lógica de Pago de Tarjeta de Crédito - OOP Integrated
 */
import { AuthService } from "../../Services/AuthService.js";
import { obtenerClientes, guardarClientes } from "../../DB/db_clientes.js";

// --- Estado Global ---
const state = {
    clienteActual: null,
    todosLosClientes: [],
    tarjetaCredito: null,
    cuentaOrigen: null, // De dónde sacaremos la plata
    deudaTotal: 0,
    pagoMinimo: 0
};

// --- Elementos del DOM ---
const cardNumberDisplay = document.querySelector('.card-number');
const totalAmountDisplay = document.querySelector('.total-amount');
const minPaymentDisplay = document.querySelectorAll('.option-value')[0];
const totalPaymentDisplay = document.querySelectorAll('.option-value')[1];
const minPaymentRadio = document.querySelector('label[data-amount="120.00"]');
const totalPaymentRadio = document.querySelector('label[data-amount="2400.00"]');

const sourceNameDisplay = document.querySelector('.source-name');
const sourceBalanceDisplay = document.querySelector('.source-balance');
const confirmBtn = document.querySelector('.btn-primary');

// Importamos la lógica de UI que ya tenías
const optionItems = document.querySelectorAll('.option-item:not(.custom-input-wrapper)');
const customAmountInput = document.querySelector('.custom-amount-input');
const customInputContainer = document.querySelector('.custom-input-wrapper');

document.addEventListener('DOMContentLoaded', init);

function init() {
    // 1. Guardián de Rutas
    const session = AuthService.obtenerUsuarioActual();
    if (!session) {
        window.location.href = '../../index.html';
        return;
    }

    // 2. Cargar Base de Datos
    state.todosLosClientes = obtenerClientes();
    state.clienteActual = state.todosLosClientes.find(c => c.id === session.id);

    // 3. Obtener la Tarjeta de la URL (?cuenta=1009)
    const params = new URLSearchParams(window.location.search);
    const targetAccountNumber = params.get('cuenta');

    if (targetAccountNumber && state.clienteActual) {
        state.tarjetaCredito = state.clienteActual.cuentas.find(c => 
            String(c.numeroCuenta || c.numero) === targetAccountNumber
        );
    }

    if (!state.tarjetaCredito) {
        alert("❌ No se detectó la tarjeta de crédito.");
        window.history.back();
        return;
    }

    // 4. Buscar una cuenta de Ahorros o Corriente para pagar
    // 4. Buscar una cuenta de Ahorros o Corriente para pagar
    state.cuentaOrigen = state.clienteActual.cuentas.find(c => {
        // 🏗️ FIX: Extracción segura del tipo (Soporta JSON crudo o Instancia POO)
        let tipoStr = c.tipo || c.tipoProducto;
        
        if (!tipoStr && typeof c.deserializarParaJSON === 'function') {
            tipoStr = c.deserializarParaJSON().tipoProducto;
        }
        
        const tipoSeguro = String(tipoStr || '').toLowerCase();
        return tipoSeguro.includes('ahorros') || tipoSeguro.includes('corriente');
    });

    // 5. Cálculos Matemáticos de la Deuda
    // Recuerda que la deuda es el saldo negativo. Si el saldo es -2400, la deuda es 2400.
    const saldoActual = parseFloat(state.tarjetaCredito.saldo) || 0;
    state.deudaTotal = saldoActual < 0 ? Math.abs(saldoActual) : 0;
    
    // Regla de negocio: El pago mínimo suele ser el 5% de la deuda total
    state.pagoMinimo = state.deudaTotal * 0.05;

    renderUI();
    setupUIListeners();
}

function renderUI() {
    // Formateador
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    // Actualizar Tarjeta
    // Usamos el getter de número o desempaquetamos si es necesario
    const numTarjeta = state.tarjetaCredito.numeroCuenta || 
                       (typeof state.tarjetaCredito.deserializarParaJSON === 'function' ? state.tarjetaCredito.deserializarParaJSON().numeroCuenta : "0000");
    cardNumberDisplay.textContent = `**** ${String(numTarjeta).slice(-4)}`;
    
    totalAmountDisplay.textContent = formatter.format(state.deudaTotal);

    // Actualizar Opciones de Pago (Inyectar valores reales en lugar de los quemados)
    minPaymentDisplay.textContent = formatter.format(state.pagoMinimo);
    minPaymentRadio.dataset.amount = state.pagoMinimo;

    totalPaymentDisplay.textContent = formatter.format(state.deudaTotal);
    totalPaymentRadio.dataset.amount = state.deudaTotal;
    
    // 🏗️ FIX: Actualizar Cuenta Origen (Extracción Segura)
    if (state.cuentaOrigen) {
        // 1. Extraemos un "clon" de los datos públicos usando la función
        let cuentaPublica = state.cuentaOrigen;
        if (typeof state.cuentaOrigen.deserializarParaJSON === 'function') {
            cuentaPublica = state.cuentaOrigen.deserializarParaJSON();
        }

        // 2. Ahora leemos las propiedades desde el clon seguro
        const tipoSeguro = String(cuentaPublica.tipo || cuentaPublica.tipoProducto || '').toLowerCase();
        
        sourceNameDisplay.textContent = tipoSeguro.includes('ahorros') ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
        sourceBalanceDisplay.textContent = `Disponible: ${formatter.format(cuentaPublica.saldo)}`;
    }

    // Si no hay deuda, bloqueamos todo
    if (state.deudaTotal === 0) {
        totalAmountDisplay.textContent = "$0.00";
        document.querySelector('.status-text').textContent = "Al día";
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = "No hay deuda pendiente";
    }
}

function setupUIListeners() {
    // Tu lógica de selección de UI original
    optionItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.option-item').forEach(el => {
                el.classList.remove('selected');
                const radio = el.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
            });

            item.classList.add('selected');
            const radio = item.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            if (customAmountInput) customAmountInput.value = '';
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('focus', () => {
            document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
            customInputContainer.classList.add('selected');
            
            document.querySelectorAll('input[name="payment-type"]').forEach(radio => radio.checked = false);
        });
    }

    // Evento de Retroceso
    document.querySelector('.btn-icon').addEventListener('click', () => window.history.back());

    // MOTOR DE PAGO (Conectado a OOP)
    confirmBtn.addEventListener('click', procesarPago);
}

function procesarPago() {
    if (confirmBtn.disabled) return;

    let finalAmount = 0;
    const selectedOption = document.querySelector('.option-item.selected');

    if (selectedOption) {
        if (selectedOption.classList.contains('custom-input-wrapper')) {
            finalAmount = parseFloat(customAmountInput.value) || 0;
        } else {
            finalAmount = parseFloat(selectedOption.getAttribute('data-amount'));
        }
    }

    if (!finalAmount || finalAmount <= 0) {
        alert('Por favor, selecciona o ingresa un monto válido.');
        return;
    }

    if (finalAmount > state.cuentaOrigen.saldo) {
        alert('❌ Fondos insuficientes en tu cuenta de origen para este pago.');
        return;
    }

    try {
        // 1. Sacamos dinero de la cuenta de ahorros/corriente
        state.cuentaOrigen.withdraw(finalAmount, 'PAGO_TARJETA');

        // 2. Depositamos dinero en la tarjeta de crédito (Reduciendo su deuda negativa)
        state.tarjetaCredito.deposit(finalAmount, 'ABONO_DEUDA');

        // 3. Guardamos la DB
        guardarClientes(state.todosLosClientes);
        localStorage.setItem('usuarioLogueado', JSON.stringify(state.clienteActual.deserializarParaJSON()));

        // 4. Efecto visual y redirección
        confirmBtn.innerHTML = `<span class="material-symbols-outlined">hourglass_top</span> Procesando...`;
        confirmBtn.style.opacity = '0.7';
        confirmBtn.disabled = true;

        setTimeout(() => {
            // Reutilizamos tu vista de éxito
            const confirmParams = new URLSearchParams({
                amount: finalAmount,
                concept: 'Pago Tarjeta de Crédito',
                ref: crypto.randomUUID().slice(0, 8).toUpperCase(),
                type: 'transfer' // Usamos icono de transferencia para el éxito
            });
            window.location.href = `../confirmacion/confirmacion.html?${confirmParams.toString()}`;
        }, 1500);

    } catch (error) {
        console.error("Error al procesar pago:", error);
        alert(error.message);
    }
}