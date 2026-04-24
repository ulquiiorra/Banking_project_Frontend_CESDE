/**
 * Hapibank - Alquimia Digital
 * Arquitectura Limpia - Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initIcons();
});

/**
 * Maneja los efectos de scroll y parallax suave
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Efecto de transparencia en el nav
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 0 30px rgba(179, 255, 0, 0.15)';
            navbar.style.borderColor = 'rgba(179, 255, 0, 0.2)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderColor = 'var(--outline-variant)';
        }
    });
}

/**
 * Configuración dinámica de Material Icons si es necesario
 */
function initIcons() {
    const icons = document.querySelectorAll('.material-symbols-outlined');
    
    icons.forEach(icon => {
        // Asegurar que el rendering sea nítido
        icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
    });
}

/**
 * Lógica de contadores animados para la sección de Stats (Opcional)
 */
const stats = document.querySelectorAll('.stat-value');
const observerOptions = { threshold: 0.5 };

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Aquí se podría implementar una animación de conteo
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

stats.forEach(stat => {
    stat.style.opacity = "0";
    stat.style.transform = "translateY(20px)";
    stat.style.transition = "all 0.6s ease-out";
    statsObserver.observe(stat);
});