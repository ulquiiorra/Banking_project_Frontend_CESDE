/**
 * Digital Alchemist Bank - Registration Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const themeToggle = document.getElementById('theme-toggle');

    // 1. Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulación de feedback visual
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmutando datos...';

        // Recopilación de datos (ejemplo)
        const formData = new FormData(form);
        const selectedProduct = formData.get('product');

        setTimeout(() => {
            console.log(`Registro completado para el producto: ${selectedProduct}`);
            alert('¡Alquimia exitosa! Tu cuenta ha sido creada.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // 2. Dynamic Input Highlights
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.parentElement.classList.add('is-active');
        });
        input.addEventListener('blur', () => {
            input.parentElement.parentElement.classList.remove('is-active');
        });
    });

    // 3. Theme Toggle Mock (Simple implementation)
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const icon = themeToggle.querySelector('.material-symbols-outlined');
        
        if (document.documentElement.classList.contains('dark')) {
            icon.textContent = 'dark_mode';
        } else {
            icon.textContent = 'light_mode';
        }
    });
});