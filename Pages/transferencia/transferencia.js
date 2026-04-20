/**
 * Transfer Logic Controller
 * Manages source/destination selection and validation.
 */

const state = {
    originAccounts: [
        { id: 'ACC_01', type: 'Cuenta Corriente', balance: 12450.00, label: '**** 9876' },
        { id: 'ACC_02', type: 'Cuenta Ahorros', balance: 5300.20, label: '**** 8842' },
        { id: 'ACC_03', type: 'Cyber Card', balance: 2400.00, label: '**** 1009' }
    ],
    destinations: [
        { id: 'ACC_02', type: 'Cuenta Ahorros', label: '**** 8842', icon: 'savings' },
        { id: 'ACC_03', type: 'Cyber Card', label: '**** 1009', icon: 'credit_card' }
    ],
    selectedOrigin: 'ACC_01',
    selectedDest: null,
    amount: 0
};

// --- DOM Elements ---
const originContainer = document.getElementById('origin-accounts');
const destContainer = document.getElementById('destination-list');
const errorBox = document.getElementById('error-container');
const confirmBtn = document.getElementById('confirm-btn');

/**
 * Initialize the View
 */
function init() {
    renderOrigins();
    renderDestinations();
    setupListeners();
}

function renderOrigins() {
    originContainer.innerHTML = state.originAccounts.map(acc => `
        <button class="card-origin ${state.selectedOrigin === acc.id ? 'active' : ''}" 
                onclick="selectOrigin('${acc.id}')">
            <div class="vortex-orb"></div>
            <p class="type">${acc.type}</p>
            <p class="balance">$${acc.balance.toLocaleString()}</p>
        </button>
    `).join('');
}

function renderDestinations() {
    destContainer.innerHTML = state.destinations.map(dest => {
        const isSame = dest.id === state.selectedOrigin;
        const isActive = dest.id === state.selectedDest;
        
        return `
            <div class="dest-item ${isActive ? 'active' : ''} ${isSame ? 'error' : ''}" 
                 onclick="selectDestination('${dest.id}')">
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

/**
 * Logic: Select Origin Account
 */
window.selectOrigin = (id) => {
    state.selectedOrigin = id;
    state.selectedDest = null; // Reset destination on origin change
    validateTransfer();
    renderOrigins();
    renderDestinations();
};

/**
 * Logic: Select Destination Account
 */
window.selectDestination = (id) => {
    state.selectedDest = id;
    validateTransfer();
    renderDestinations();
};

/**
 * Validation Core
 */
function validateTransfer() {
    const isSameAccount = state.selectedOrigin === state.selectedDest;
    const hasDestination = state.selectedDest !== null;

    if (isSameAccount) {
        errorBox.classList.remove('hidden');
        confirmBtn.disabled = true;
    } else {
        errorBox.classList.add('hidden');
        confirmBtn.disabled = !hasDestination;
    }
}

function setupListeners() {
    document.getElementById('transfer-amount').addEventListener('input', (e) => {
        state.amount = parseFloat(e.target.value) || 0;
    });

    confirmBtn.addEventListener('click', () => {
        if (!confirmBtn.disabled) {
            alert(`Transferencia de $${state.amount} procesada con éxito.`);
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', init);