/**
 * Success Screen Controller
 */

function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Comprobante Hapibank',
            text: 'Operación exitosa por $1,200.00',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Compartiendo comprobante...');
    }
}

function goHome() {
    console.log("Navegando al inicio...");
    // window.location.href = 'index.html';
}

/**
 * Prototype Utility: Toggles UI between Transfer and Withdrawal views
 */
function toggleMode(mode) {
    const withdrawalSection = document.getElementById('withdrawal-section');
    const buttons = document.querySelectorAll('.demo-switcher button');
    
    if (mode === 'withdrawal') {
        withdrawalSection.style.display = 'block';
        buttons[1].classList.add('active');
        buttons[0].classList.remove('active');
    } else {
        withdrawalSection.style.display = 'none';
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    }
}

// Initialize with default view
document.addEventListener('DOMContentLoaded', () => {
    toggleMode('transfer');
});