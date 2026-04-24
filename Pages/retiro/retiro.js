/**
 * Cash Extraction Controller - OOP Integrated
 * Handles numeric keypad logic, amount formatting, and DB transactions
 */
import { AuthService } from "../../Services/AuthService.js";
import { obtenerClientes, guardarClientes } from "../../DB/db_clientes.js";

const state = {
    currentAmount: "0",
    maxAmount: 10000,
    minAmount: 10,
    mode: 'retiro',
    clientData: null,
    accountOrigin: null,
    allClients: []
};

// --- DOM Elements ---
const displayElement = document.getElementById('amount-value');
const generateBtn = document.getElementById('generate-btn');
const modeButtons = document.querySelectorAll('.switch-btn');
const infoText = document.querySelector('.info-text');

/**
 * Initializes the view, reading the URL to know which account is withdrawing
 */
function initializeWithdrawal() {
    // 1. Validar Sesión
    const session = AuthService.obtenerUsuarioActual();
    if (!session) {
        window.location.href = '../landingPage/landingPage.html';
        return;
    }

    // 2. Leer la base de datos fresca
    state.allClients = obtenerClientes();
    state.clientData = state.allClients.find(c => c.id === session.id);

    // 3. Obtener la cuenta desde la URL
    const params = new URLSearchParams(window.location.search);
    const targetAccountNumber = params.get('cuenta');

    if (targetAccountNumber && state.clientData) {
        state.accountOrigin = state.clientData.cuentas.find(c => 
            String(c.numeroCuenta) === targetAccountNumber || 
            String(c.numero) === targetAccountNumber
        );
    }

    if (!state.accountOrigin) {
        alert("❌ No se detectó una cuenta válida para el retiro.");
        window.history.back();
        return;
    }

    // 4. Configurar la UI inicial según el tipo de cuenta
    // 🏗️ FIX: Usamos la función segura
    const isCredit = isCreditAccount(state.accountOrigin);
    
    if (isCredit) {
        setOperationMode('adelanto');
    } else {
        setOperationMode('retiro');
    }

    updateUI();
}

/**
 * Updates the UI with the current state value
 */
function updateUI() {
    const numericValue = parseFloat(state.currentAmount);
    
    // Formatting for display
    displayElement.textContent = numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Toggle CTA Button
    generateBtn.disabled = numericValue < state.minAmount || numericValue > state.maxAmount;
    
    // Animate display on change
    displayElement.parentElement.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
    ], { duration: 150 });
}

/**
 * Appends a digit to the current amount
 */
window.appendDigit = (digit) => {
    if (state.currentAmount.length > 8) return;

    if (state.currentAmount === "0") {
        state.currentAmount = digit;
    } else {
        state.currentAmount += digit;
    }
    
    updateUI();
};

/**
 * Sets a specific predefined amount
 */
window.setQuickAmount = (amount) => {
    state.currentAmount = amount.toString();
    updateUI();
};

/**
 * Removes the last digit
 */
window.deleteDigit = () => {
    if (state.currentAmount.length > 1) {
        state.currentAmount = state.currentAmount.slice(0, -1);
    } else {
        state.currentAmount = "0";
    }
    updateUI();
};

/**
 * Clears the entire amount
 */
window.clearAmount = () => {
    state.currentAmount = "0";
    updateUI();
};

/**
 * Handles the UI and State changes for operation mode (Retiro vs Adelanto)
 */
function setOperationMode(mode) {
    state.mode = mode;
    modeButtons.forEach(b => b.classList.remove('active'));
    
    const activeBtn = Array.from(modeButtons).find(b => b.dataset.mode === mode);
    if (activeBtn) activeBtn.classList.add('active');

    // Adaptamos el texto de información visualmente
    if (mode === 'adelanto') {
        infoText.textContent = "El adelanto en efectivo genera intereses desde el primer día.";
    } else {
        infoText.textContent = "Se generará un código de 8 dígitos válido por 30 minutos.";
    }
}

/**
 * Executes the withdrawal or cash advance in the OOP layer
 */
function processTransaction() {
    if (generateBtn.disabled) return;

    const amount = parseFloat(state.currentAmount);

    try {
        const transactionType = state.mode === 'adelanto' ? 'ADELANTO_EFECTIVO' : 'RETIRO_CAJERO';

        // Ejecutamos el método polimórfico (El padre 'Cuenta' se encarga de las reglas y validaciones)
        state.accountOrigin.withdraw(amount, transactionType);

        // Guardamos los cambios estructurales en la DB
        guardarClientes(state.allClients);
        localStorage.setItem('usuarioLogueado', JSON.stringify(state.clientData.deserializarParaJSON()));

        // Transición visual de éxito
        generateBtn.innerHTML = `<span class="material-symbols-outlined">hourglass_top</span> Procesando...`;
        generateBtn.disabled = true;

        setTimeout(() => {
            // Empaquetamos los datos para la pantalla de confirmación que ya diseñaste
            const confirmParams = new URLSearchParams({
                amount: amount,
                concept: state.mode === 'adelanto' ? 'Adelanto de Efectivo' : 'Retiro sin Tarjeta',
                ref: crypto.randomUUID().slice(0, 8).toUpperCase(),
                type: 'withdrawal' // Activa la vista de retiro en tu confirmacion.js
            });
            
            window.location.href = `../confirmacion/confirmacion.html?${confirmParams.toString()}`;
        }, 1000);

    } catch (error) {
        // En caso de fondos insuficientes u otra regla de negocio rota
        console.error("Transaction Error:", error);
        infoText.innerHTML = `<span style="color: #f87171;">⚠️ ${error.message}</span>`;
        
        // Efecto de error en el input
        displayElement.parentElement.animate([
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
}

// --- Listeners ---
modeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 🏗️ FIX: Usamos la función segura
        const isCredit = isCreditAccount(state.accountOrigin);
        const selectedMode = e.target.dataset.mode;

        if (!isCredit && selectedMode === 'adelanto') {
            infoText.innerHTML = `<span style="color: #f87171;">⚠️ Tu cuenta no soporta adelantos en efectivo.</span>`;
            return;
        }

        setOperationMode(selectedMode);
    });
});


generateBtn.addEventListener('click', processTransaction);

/**
 * Helper para detectar de forma segura si la cuenta es de crédito,
 * sin importar si es un JSON crudo o una clase instanciada.
 */
function isCreditAccount(cuenta) {
    if (!cuenta) return false;
    
    // 1. Intentamos leerlo como propiedad directa (caso JSON)
    let tipoStr = cuenta.tipo || cuenta.tipoProducto;
    
    // 2. Si no existe, usamos el método de la clase (caso POO)
    if (!tipoStr && typeof cuenta.deserializarParaJSON === 'function') {
        tipoStr = cuenta.deserializarParaJSON().tipoProducto;
    }
    
    // 3. Convertimos a texto seguro y validamos
    return String(tipoStr || '').toLowerCase().includes('credito');
}

// Initial Render
document.addEventListener('DOMContentLoaded', initializeWithdrawal);