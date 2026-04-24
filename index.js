/**
 * Hapibank - Interaction Logic
 * Clean Vanilla JavaScript ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initVortexAnimation();
    initMobileMenu();
});

/**
 * Maneja los efectos visuales al hacer scroll
 */
const initScrollEffects = () => {
    const header = document.querySelector('.top-app-bar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.backgroundColor = 'rgba(14, 14, 14, 0.95)';
        } else {
            header.style.padding = '1rem 0';
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.7)';
        }
    });
};

/**
 * Animación del Hapi-Vortex (Dashboard Savings)
 */
const initVortexAnimation = () => {
    const vortexRing = document.querySelector('.vortex-ring');
    if (!vortexRing) return;

    // Simulación de carga de datos
    let progress = 0;
    const target = 82;
    
    const interval = setInterval(() => {
        if (progress >= target) {
            clearInterval(interval);
        } else {
            progress++;
            // En una implementación real, aquí actualizaríamos el gradiente cónico del borde
        }
    }, 20);
};

/**
 * Funcionalidad de botones y navegación
 */
const initMobileMenu = () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Event listener para el botón principal
    const mainCta = document.querySelector('.btn-primary-xl');
    if (mainCta) {
        mainCta.addEventListener('click', () => {
            console.log('Redirecting to onboarding...');
            alert('¡Bienvenido al futuro! Redirigiendo a apertura de cuenta...');
        });
    }
};