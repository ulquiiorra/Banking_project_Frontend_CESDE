/**
 * Stitch Refactor - Hapibank Contact
 * Responsabilidades: Manejo de UI y validación de formulario.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    // Manejo de envío del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Efecto visual de carga en el botón
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.style.opacity = '0.7';
            btn.innerHTML = '<span>Procesando...</span>';
            
            // Simulación de envío
            setTimeout(() => {
                alert('Mensaje enviado al flujo digital de Hapibank.');
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                contactForm.reset();
            }, 1500);
        });
    }

    // Animación de entrada para las info-cards
    const infoCards = document.querySelectorAll('.info-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(card);
    });
});