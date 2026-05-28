/**
 * Hapibank - Logic Controller
 * Manejo de interacciones de UI y efectos de hover
 */

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
});

/**
 * Inicializa efectos táctiles y clicks en botones
 */
function initButtons() {
    const buttons = document.querySelectorAll('button, .nav-links a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });

        btn.addEventListener('click', (e) => {
            if(btn.classList.contains('btn-primary')) {
                const productName = btn.parentElement.querySelector('h2').innerText;
                console.log(`Iniciando solicitud para: ${productName}`);
                // Aquí iría la lógica de redirección o modal
            }
        });
    });
}