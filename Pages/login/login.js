document.addEventListener('DOMContentLoaded', () => {
    // 1. Selección de elementos del DOM
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passToggleBtn = document.getElementById('pass-toggle');
    const passToggleIcon = passToggleBtn.querySelector('span');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    // 2. Lógica para mostrar/ocultar contraseña
    passToggleBtn.addEventListener('click', () => {
        // Alternar el tipo de input
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Alternar el ícono de Material Symbols
        passToggleIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });

    // 3. Manejo del envío del formulario
    loginForm.addEventListener('submit', async (event) => {
        // Evitar que el navegador recargue la página
        event.preventDefault();

        // Obtener y limpiar los valores de los inputs
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación básica (el HTML ya tiene 'required' y type='email', pero podemos agregar más)
        if (!email || !password) {
            return; // El navegador ya maneja esto por los atributos 'required', pero es un doble check seguro
        }

        // 4. Simulación de envío a una API (Estado de carga)
        try {
            // Guardar el contenido original del botón y cambiar a estado de carga
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Verificando credenciales...</span>';
            submitBtn.disabled = true; // Prevenir múltiples envíos
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Simular una petición de red con un retraso de 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Aquí iría tu lógica real usando fetch() o axios para conectarte a tu backend
            console.log('Intento de inicio de sesión:', { correo: email, passwordLength: password.length });
            
            // Opcional: Redirigir al usuario al dashboard
            // window.location.href = '/dashboard.html';
            window.location.href = '../dashboard/dashboard.html';
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar el botón a su estado original
            submitBtn.innerHTML = '<span>Iniciar Sesión</span>';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    });
});