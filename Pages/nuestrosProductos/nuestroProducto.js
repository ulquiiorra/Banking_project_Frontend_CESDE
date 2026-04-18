/**
 * Hapibank - Logic Controller
 * Manejo de interacciones de UI y efectos de hover
 */

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    initScrollEffects();
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

/**
 * Efecto de scroll para el Navbar
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(9, 9, 11, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(9, 9, 11, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });
}