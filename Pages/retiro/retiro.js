/**
 * Cash Extraction Controller
 * Handles numeric keypad logic and amount formatting
 */

const state = {
    currentAmount: "0",
    maxAmount: 10000,
    minAmount: 10
};

const displayElement = document.getElementById('amount-value');
const generateBtn = document.getElementById('generate-btn');

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
    generateBtn.disabled = numericValue < state.minAmount;
    
    // Animate display on change
    displayElement.parentElement.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
    ], { duration: 150 });
}

/**
 * Appends a digit to the current amount (treating as cents logic)
 */
window.appendDigit = (digit) => {
    // Prevent excessive lengths
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
 * Mode Switcher Logic
 */
document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log("Modo cambiado a:", btn.dataset.mode);
    });
});

// Initial Render
document.addEventListener('DOMContentLoaded', updateUI);