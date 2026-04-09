/**
 * Stitch Refactor - Vanilla Logic
 * Architecture: Event-driven State Updates
 */

const accountData = {
    'AHORROS': {
        label: 'Cuenta de Ahorros',
        number: '**** 1234',
        balance: '$12,850.42',
        balanceLabel: 'Saldo Disponible',
        showCreditDetails: false,
        showAdelanto: false,
        btnText: 'Retirar',
        btnIcon: 'atm',
        btnAction: () => console.log('Navegando a SCREEN_2')
    },
    'CORRIENTE': {
        label: 'Cuenta Corriente',
        number: '**** 9876',
        balance: '$5,120.00',
        balanceLabel: 'Saldo Contable',
        showCreditDetails: false,
        showAdelanto: false,
        btnText: 'Retirar',
        btnIcon: 'local_atm',
        btnAction: () => console.log('Navegando a SCREEN_2')
    },
    'TARJETA_CREDITO': {
        label: 'Tarjeta de Crédito',
        number: '**** 5678',
        balance: '$2,400.00',
        balanceLabel: 'Saldo Actual',
        showCreditDetails: true,
        showAdelanto: true,
        btnText: 'Pagar',
        btnIcon: 'payments',
        btnAction: () => console.log('Navegando a SCREEN_34')
    }
};

/**
 * Updates the UI based on the selected account type
 * @param {string} type - Key of the accountData object
 */
function updateAccountState(type) {
    const data = accountData[type];
    if (!data) return;

    // Update Text Content
    document.getElementById('account-type-label').textContent = data.label;
    document.getElementById('account-number').textContent = data.number;
    document.getElementById('account-balance').textContent = data.balance;
    document.getElementById('balance-label').textContent = data.balanceLabel;

    // Update Central Button
    const btn = document.getElementById('central-action-btn');
    const btnText = document.getElementById('central-action-text');
    const btnIcon = document.getElementById('central-action-icon');

    btnText.textContent = data.btnText;
    btnIcon.textContent = data.btnIcon;
    btn.onclick = data.btnAction;

    // Toggle Visibility - Credit Details
    const creditDetails = document.getElementById('credit-details');
    creditDetails.classList.toggle('hidden', !data.showCreditDetails);

    // Toggle Visibility - Adelanto Button
    const adelantoBtn = document.getElementById('adelanto-btn');
    adelantoBtn.classList.toggle('hidden', !data.showAdelanto);
    
    console.log(`Estado cambiado a: ${type}`);
}

/**
 * Global handler for generic actions
 */
function handleAction(action) {
    alert(`Acción ejecutada: ${action}`);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Set default state
    updateAccountState('TARJETA_CREDITO');
    
    // Add simple click feedback to transaction items
    document.querySelectorAll('.transaction-item').forEach(item => {
        item.addEventListener('click', () => {
            item.style.backgroundColor = 'var(--surface-container-highest)';
            setTimeout(() => {
                item.style.backgroundColor = 'var(--surface-container-low)';
            }, 200);
        });
    });
});