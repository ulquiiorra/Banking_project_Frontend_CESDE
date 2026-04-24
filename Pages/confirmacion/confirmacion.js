/**
 * Success Screen Controller - Dynamic Data
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Extraer parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    
    // Si alguien entra directo sin parámetros, ponemos valores por defecto
    const amount = parseFloat(params.get('amount')) || 0;
    const concept = params.get('concept') || 'Operación bancaria';
    const ref = params.get('ref') || 'HPI-0000-XXXX';
    const type = params.get('type') || 'transfer';

    // 2. Formatear los datos
    const amountFormatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(amount);

    const dateFormatted = new Date().toLocaleDateString('es-CO', {
        day: 'numeric', month: 'short', year: 'numeric', 
        hour: '2-digit', minute:'2-digit'
    });

    // 3. Inyectar en el DOM
    const amountDisplay = document.querySelector('.main-value');
    const conceptDisplay = document.querySelector('.value-text');
    const metaValues = document.querySelectorAll('.meta-value'); // [0] es Fecha, [1] es Ref

    if (amountDisplay) amountDisplay.textContent = amountFormatted;
    if (conceptDisplay) conceptDisplay.textContent = concept;
    
    if (metaValues.length >= 2) {
        metaValues[0].textContent = dateFormatted;
        metaValues[1].textContent = `#${ref}`;
    }

    // 4. Cambiar textos según si fue transferencia o fondeo
    if (type === 'deposit') {
        document.querySelector('.success-subtitle').textContent = 'Fondeo Exitoso';
        document.querySelector('.detail-info .label-tiny').textContent = 'Origen';
    }

    // Iniciar con la vista correcta
    toggleMode(type === 'withdrawal' ? 'withdrawal' : 'transfer');
});

// ... (Mantén tus funciones handleShare, goHome y toggleMode intactas aquí abajo)

function handleShare() {
    // Aquí puedes usar document.querySelector('.main-value').textContent para el texto del share
    if (navigator.share) {
        navigator.share({
            title: 'Comprobante Hapibank',
            text: `Operación exitosa en Hapibank`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Compartiendo comprobante...');
    }
}

function goHome() {
    // 🏗️ FIX: Redirigimos de vuelta al dashboard de forma dinámica
    window.location.href = '../dashboard/dashboard.html';
}

function toggleMode(mode) {
    const withdrawalSection = document.getElementById('withdrawal-section');
    const buttons = document.querySelectorAll('.demo-switcher button');
    
    if(!withdrawalSection || buttons.length < 2) return;

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