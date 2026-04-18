import { Clientes } from '../../Models/Clientes.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');

    

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Captura de datos
            const nombre = document.getElementById('fullName').value;
            const correo = document.getElementById('email').value;
            const documento = document.getElementById('dni').value;
            const celular = document.getElementById('phone').value;
            const usuario = document.getElementById('username').value;
            const contrasena = document.getElementById('password').value;
            
            const checkboxesSeleccionados = document.querySelectorAll('input[name="product"]:checked');
            const productosSeleccionados = Array.from(checkboxesSeleccionados).map(cb => cb.value);
            
            if (productosSeleccionados.length === 0) {
                mostrarError("⚠️ Debes seleccionar al menos un producto financiero para continuar.");
                return;
            }


            // 2. VALIDACIÓN DE UNICIDAD (El filtro de seguridad)
            if (!esUsuarioUnico(documento, usuario)) {
                // Usamos un alert por ahora, pero podrías usar un modal de tu diseño
                mostrarError("🚫 Error: El número de documento o el nombre de usuario ya están registrados en nuestra red.");
                return; // Detenemos la ejecución aquí
            }

            // 3. Si pasa la validación, creamos el objeto
            const nuevoId = Date.now(); 
            const nuevoCliente = new Clientes(
                nuevoId, nombre, correo, documento, celular, usuario, contrasena, productosSeleccionados
            );

            // 4. Guardar datos
            const datosParaGuardar = nuevoCliente.deserializarParaJSON();
            localStorage.setItem('usuarioLogueado', JSON.stringify(datosParaGuardar));
            actualizarListaGlobalUsuarios(datosParaGuardar);

            console.log("✨ Alquimia exitosa:", nuevoCliente.nombreUsuario);
            window.location.href = "../exito/exito.html"; 
        });
    }
});

/**
 * Revisa en el localStorage si el DNI o el Usuario ya existen
 */
function esUsuarioUnico(dni, username) {
    // Obtenemos la lista global de clientes
    const usuariosRegistrados = JSON.parse(localStorage.getItem('banco_clientes')) || [];

    // Buscamos si alguno coincide con los datos ingresados
    const existe = usuariosRegistrados.some(user => 
        user.numeroDocumento === dni || user.nombreUsuario === username
    );

    return !existe; // Si existe, devuelve false (no es único)
}

function actualizarListaGlobalUsuarios(nuevoUsuario) {
    let usuarios = JSON.parse(localStorage.getItem('banco_clientes')) || [];
    usuarios.push(nuevoUsuario);
    localStorage.setItem('banco_clientes', JSON.stringify(usuarios));
}

// --- FUNCIÓN PARA MOSTRAR EL ERROR VISUAL ---
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (errorContainer && errorText) {
        errorText.textContent = mensaje;
        errorContainer.style.display = 'flex'; // Lo hacemos visible

        // Opcional: Feedback táctil visual (sacudida)
        errorContainer.classList.add('shake-animation');
        setTimeout(() => errorContainer.classList.remove('shake-animation'), 500);
    }
}