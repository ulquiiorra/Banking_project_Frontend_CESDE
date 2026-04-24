/**
 * Transfer Logic Controller - OOP Integrated
 */
import { AuthService } from "../../Services/AuthService.js";
import { obtenerClientes, guardarClientes } from "../../DB/db_clientes.js";

const state = {
    usuarioSession: null,
    todosLosClientes: [],
    originAccounts: [],
    destinations: [],
    selectedOrigin: null,
    selectedDest: null, // Para "Mis Cuentas"
    cuentaTercero: '',  // Para "A Terceros"
    amount: 0,
    concepto: '',
    transferMode: 'propias' // 'propias' o 'terceros'
};

// --- DOM Elements ---
const originContainer = document.getElementById('origin-accounts');
const destContainer = document.getElementById('destination-list');
const destInputContainer = document.getElementById('destination-input-container');
const inputTercero = document.getElementById('cuenta-destino-tercero');
const tabPropias = document.getElementById('tab-propias');
const tabTerceros = document.getElementById('tab-terceros');

const errorBox = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const confirmBtn = document.getElementById('confirm-btn');
const amountInput = document.getElementById('transfer-amount');
const conceptInput = document.querySelector('.input-concept-wrapper input');

function init() {
    state.usuarioSession = AuthService.obtenerUsuarioActual();
    if (!state.usuarioSession) {
        window.location.href = '../landingPage/landingPage.html';
        return;
    }

    state.todosLosClientes = obtenerClientes();

    state.originAccounts = state.usuarioSession.cuentas.map(c => ({
        id: String(c.numeroCuenta || c.numero),
        type: getVisualName(c.tipo || c.tipoProducto),
        balance: parseFloat(c.saldo) || 0,
        label: `**** ${String(c.numeroCuenta || c.numero).slice(-4)}`
    }));

    // 🏗️ NUEVO: Inyectamos el "Fondeo Externo" al final de la lista
    state.originAccounts.push({
        id: 'EXTERNAL',
        type: 'Fondeo Externo',
        balance: null, // Usamos null para identificar que no tiene saldo numérico
        label: 'PSE / Cajero'
    });

    if (state.originAccounts.length > 0) {
        state.selectedOrigin = state.originAccounts[0].id;
    }

    state.destinations = state.originAccounts.map(c => ({
        ...c,
        icon: c.type.includes('Crédito') ? 'credit_card' : (c.type.includes('Corriente') ? 'account_balance' : 'savings')
    }));

    renderOrigins();
    renderDestinations();
    setupListeners();
    validateTransfer();
}

function renderOrigins() {
    originContainer.innerHTML = state.originAccounts.map(acc => {
        // 🏗️ FIX: Validamos si es la cuenta externa
        const isExternal = acc.id === 'EXTERNAL';
        const balanceText = isExternal 
            ? 'Ilimitado' 
            : `$${acc.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

        return `
        <button class="card-origin ${state.selectedOrigin === acc.id ? 'active' : ''}" 
                onclick="window.selectOrigin('${acc.id}')">
            <div class="vortex-orb" style="${isExternal ? 'background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);' : ''}"></div>
            <p class="type">${acc.type}</p>
            <p class="balance">${balanceText}</p>
        </button>
        `;
    }).join('');
}

function renderDestinations() {
    destContainer.innerHTML = state.destinations.map(dest => {
        const isSame = dest.id === state.selectedOrigin;
        const isActive = dest.id === state.selectedDest;
        
        return `
            <div class="dest-item ${isActive ? 'active' : ''} ${isSame ? 'error' : ''}" 
                 onclick="window.selectDestination('${dest.id}')">
                <div class="vortex-orb"></div>
                <div class="item-main">
                    <div class="icon-circle">
                        <span class="material-symbols-outlined">${dest.icon}</span>
                    </div>
                    <div class="item-info">
                        <p class="font-bold">${dest.type}</p>
                        <p class="badge">${dest.label}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        `;
    }).join('');
}

// --- LOGICA DE PESTAÑAS (NUEVO) ---
window.switchTab = (mode) => {
    state.transferMode = mode;
    
    if (mode === 'propias') {
        tabPropias.classList.add('active');
        tabTerceros.classList.remove('active');
        destContainer.classList.remove('hidden');
        destInputContainer.classList.add('hidden');
    } else {
        tabTerceros.classList.add('active');
        tabPropias.classList.remove('active');
        destContainer.classList.add('hidden');
        destInputContainer.classList.remove('hidden');
    }
    
    validateTransfer();
};

window.selectOrigin = (id) => {
    state.selectedOrigin = id;
    state.selectedDest = null; 
    validateTransfer();
    renderOrigins();
    renderDestinations();
};

window.selectDestination = (id) => {
    if (id === state.selectedOrigin) return; 
    state.selectedDest = id;
    validateTransfer();
    renderDestinations();
};

function validateTransfer() {
    let isSameAccount = false;
    let hasDestination = false;

    if (state.transferMode === 'propias') {
        isSameAccount = state.selectedOrigin === state.selectedDest;
        hasDestination = state.selectedDest !== null;
    } else {
        isSameAccount = state.selectedOrigin === state.cuentaTercero;
        hasDestination = state.cuentaTercero.length >= 4; // Asumimos mínimo 4 números
    }

    const hasValidAmount = state.amount > 0;

    if (isSameAccount && hasDestination) {
        errorBox.classList.remove('hidden');
        errorMessage.textContent = "No puedes transferir a tu misma cuenta de origen.";
        confirmBtn.disabled = true;
    } else {
        errorBox.classList.add('hidden');
        confirmBtn.disabled = !(hasDestination && hasValidAmount);
    }
}

function setupListeners() {
    amountInput.addEventListener('input', (e) => {
        state.amount = parseFloat(e.target.value) || 0;
        validateTransfer(); 
    });

    if (conceptInput) {
        conceptInput.addEventListener('input', (e) => {
            state.concepto = e.target.value.trim() || 'Transferencia';
        });
    }

    // Escuchar el input de terceros
    if (inputTercero) {
        inputTercero.addEventListener('input', (e) => {
            state.cuentaTercero = e.target.value.trim();
            validateTransfer();
        });
    }

    confirmBtn.addEventListener('click', procesarTransferenciaOficial);
}

function procesarTransferenciaOficial() {
    if (confirmBtn.disabled) return;

    try {
        const clienteActual = state.todosLosClientes.find(c => c.id === state.usuarioSession.id);
        let cuentaDestino = null;

        // BÚSQUEDA DEL DESTINO (Igual que antes)
        if (state.transferMode === 'propias') {
            cuentaDestino = clienteActual.cuentas.find(c => String(c.numeroCuenta) === state.selectedDest);
        } else {
            for (const cliente of state.todosLosClientes) {
                const encontrada = cliente.cuentas.find(c => String(c.numeroCuenta) === state.cuentaTercero);
                if (encontrada) { cuentaDestino = encontrada; break; }
            }
        }

        if (!cuentaDestino) {
            throw new Error("❌ La cuenta destino no existe en HapiBank.");
        }

        // 🏗️ NUEVO: Bifurcación (Branching) según el origen
        if (state.selectedOrigin === 'EXTERNAL') {
            // MODO CONSIGNACIÓN: Inyectamos dinero de la nada
            cuentaDestino.deposit(state.amount, 'DEPOSITO');
        } else {
            // MODO TRANSFERENCIA: Sacamos de una cuenta para meter en otra
            const cuentaOrigen = clienteActual.cuentas.find(c => String(c.numeroCuenta) === state.selectedOrigin);
            if (!cuentaOrigen) throw new Error("Cuenta de origen inválida.");
            
            cuentaOrigen.transfer(state.amount, cuentaDestino);
        }

        // GUARDADO (Igual que antes)
        guardarClientes(state.todosLosClientes);
        localStorage.setItem('usuarioLogueado', JSON.stringify(clienteActual.deserializarParaJSON()));

        confirmBtn.innerHTML = `Completado <span class="material-symbols-outlined">check_circle</span>`;
        confirmBtn.style.backgroundColor = 'var(--success-glow, #a3e635)'; 
        
        setTimeout(() => {
            // 🏗️ NUEVO: Empaquetamos los datos en la URL
            const params = new URLSearchParams({
                amount: state.amount,
                concept: state.concepto || 'Transferencia',
                ref: crypto.randomUUID().slice(0, 8).toUpperCase(), // Genera un #HPI aleatorio
                type: state.selectedOrigin === 'EXTERNAL' ? 'deposit' : 'transfer'
            });
            
            // Redirigimos a la vista de confirmación
            window.location.href = `../confirmacion/confirmacion.html?${params.toString()}`;
        }, 800);

    } catch (error) {
        errorBox.classList.remove('hidden');
        errorMessage.textContent = error.message;
        errorBox.classList.add('shake-animation');
        setTimeout(() => errorBox.classList.remove('shake-animation'), 500);
    }
}

function getVisualName(value) {
    const names = {
        'ahorros': 'Cuenta de Ahorros',
        'corriente': 'Cuenta Corriente',
        'credito': 'Cyber Card' 
    };
    return names[value?.toLowerCase()] || 'Cuenta';
}

document.addEventListener('DOMContentLoaded', init);