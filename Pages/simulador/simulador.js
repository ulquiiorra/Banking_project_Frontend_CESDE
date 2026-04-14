/**
 * Credit Simulator Controller
 * State-based calculations for installment payments
 */

const simulator = {
    amount: 0,
    installments: 12,
    interestRate: 0, // 0% as per UI request

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateUI();
    },

    cacheDOM() {
        this.amountInput = document.getElementById('amount-input');
        this.rangeInput = document.getElementById('installment-range');
        this.countDisplay = document.getElementById('installment-count');
        this.totalFinanceDisplay = document.getElementById('total-finance');
        this.monthlyDisplay = document.getElementById('monthly-payment');
        this.chips = document.querySelectorAll('.chip');
    },

    bindEvents() {
        // Amount Input
        this.amountInput.addEventListener('input', (e) => {
            this.amount = parseFloat(e.target.value) || 0;
            this.calculate();
        });

        // Range Slider
        this.rangeInput.addEventListener('input', (e) => {
            this.installments = parseInt(e.target.value);
            this.syncChips();
            this.calculate();
        });

        // Quick Chips
        this.chips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.installments = parseInt(chip.dataset.val);
                this.rangeInput.value = this.installments;
                this.syncChips();
                this.calculate();
            });
        });
    },

    syncChips() {
        this.chips.forEach(chip => {
            const val = parseInt(chip.dataset.val);
            chip.classList.toggle('active', val === this.installments);
        });
    },

    calculate() {
        // Simple division for 0% interest
        const total = this.amount;
        const monthly = this.installments > 0 ? total / this.installments : 0;

        this.updateUI(total, monthly);
    },

    updateUI(total = 0, monthly = 0) {
        this.countDisplay.textContent = this.installments;
        
        this.totalFinanceDisplay.textContent = `$${total.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        this.monthlyDisplay.textContent = `$${monthly.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
};

// Start the simulator
document.addEventListener('DOMContentLoaded', () => simulator.init());