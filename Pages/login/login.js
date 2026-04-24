import { obtenerClientes, guardarClientes } from '../../DB/db_clientes.js'; // Ajusta esta ruta

// Función que ya tenías para mostrar el error
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (errorContainer && errorText) {
        errorText.textContent = mensaje;
        errorContainer.style.display = 'flex'; // Lo hacemos visible

        // Feedback táctil visual (sacudida)
        errorContainer.classList.add('shake-animation');
        setTimeout(() => errorContainer.classList.remove('shake-animation'), 500);
    }
}

// 🏗️ NUEVO: Función para limpiar errores en nuevos intentos
function ocultarError() {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

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
        event.preventDefault();

        ocultarError();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            return; 
        }

        // 🏗️ FIX: Guardamos el estado del botón antes de empezar el try
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Verificando...</span>';
        submitBtn.disabled = true;

        const listaClientes = obtenerClientes();
        
        try {
            const clienteEncontrado = listaClientes.find(c => c.correoElectronico === email);

            if (!clienteEncontrado) {
                mostrarError("⚠️ No encontramos ninguna cuenta con ese correo electrónico.");
                return; 
            }
            
            const esValido = clienteEncontrado.autenticar(clienteEncontrado.nombreUsuario, password);

            if (esValido) {
                const datosUsuario = clienteEncontrado.deserializarParaJSON();
                localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario));
                
                window.location.href = '../dashboard/dashboard.html';
            } else {
                mostrarError("⚠️ Contraseña incorrecta. Intenta de nuevo.");
            }
        // 🏗️ FIX: Agregamos (error) aquí
        } catch (error) { 
            console.error('Alerta de seguridad:', error.message);
            alert(error.message);
        } finally {
            guardarClientes(listaClientes);

            // 🏗️ FIX: Ahora sí existe originalBtnContent para restaurar el botón
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    });
});

