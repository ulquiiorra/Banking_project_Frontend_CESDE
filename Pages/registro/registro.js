import { Cliente } from '../../Models/Cliente.js';
// 🏗️ NUEVO: Importamos el motor de base de datos y las fábricas de cuentas
import { obtenerClientes, guardarClientes } from '../../DB/db_clientes.js';
import { CuentaAhorros } from '../../Models/CuentaAhorro.js';
import { CuentaCorriente } from '../../Models/CuentaCorriente.js';
import { TarjetaCredito } from '../../Models/TarjetaCredito.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Captura de datos básicos
            const nombre = document.getElementById('fullName').value;
            const correo = document.getElementById('email').value;
            const documento = document.getElementById('dni').value;
            const celular = document.getElementById('phone').value;
            const usuario = document.getElementById('username').value;
            const contrasena = document.getElementById('password').value;
            
            const checkboxesSeleccionados = document.querySelectorAll('input[name="product"]:checked');
            
            if (checkboxesSeleccionados.length === 0) {
                mostrarError("⚠️ Debes seleccionar al menos un producto financiero para continuar.");
                return;
            }

            // 2. Cargar Base de Datos Global
            const todosLosClientes = obtenerClientes();

            // 3. VALIDACIÓN DE UNICIDAD
            const existe = todosLosClientes.some(user => 
                user.numeroDocumento === documento || user.nombreUsuario === usuario
            );

            if (existe) {
                mostrarError("🚫 Error: El número de documento o el nombre de usuario ya están registrados en nuestra red.");
                return; 
            }

            // 4. 🏗️ FÁBRICA DE CUENTAS: Creamos los objetos reales
            const cuentasNuevas = Array.from(checkboxesSeleccionados).map(cb => {
                const tipo = cb.value;
                // Generamos un número de cuenta aleatorio de 4 a 6 dígitos
                const numeroCuenta = Math.floor(1000 + Math.random() * 90000).toString(); 
                const fechaHoy = new Date().toISOString();

                if (tipo === 'ahorros') {
                    return new CuentaAhorros(numeroCuenta, fechaHoy, "ACTIVA", 0, 0.015);
                } else if (tipo === 'corriente') {
                    return new CuentaCorriente(numeroCuenta, fechaHoy, "ACTIVA", 0);
                } else if (tipo === 'credito') {
                    return new TarjetaCredito(numeroCuenta, fechaHoy, "ACTIVA", 0, 2000.00, 0.022); // Cupo inicial de 2000
                }
            });

            // 5. Creamos el Cliente con sus cuentas reales
            const nuevoId = Date.now(); 
            const nuevoCliente = new Cliente(
                nuevoId, nombre, correo, documento, celular, usuario, contrasena, [] // Inicia con arreglo vacío
            );
            
            // Le inyectamos las cuentas creadas
            nuevoCliente.restaurarCuentas(cuentasNuevas);

            // 6. Guardar en la Base de Datos Global
            todosLosClientes.push(nuevoCliente);
            guardarClientes(todosLosClientes); // Usa el guardado oficial que empaqueta las clases

            // Guardamos la sesión actual
            localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoCliente.deserializarParaJSON()));

            console.log("✨ Alquimia exitosa:", nuevoCliente.nombreUsuario);
            window.location.href = "../exito/exito.html"; 
        });
    }
});

// --- FUNCIÓN PARA MOSTRAR EL ERROR VISUAL ---
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (errorContainer && errorText) {
        errorText.textContent = mensaje;
        errorContainer.style.display = 'flex'; 

        errorContainer.classList.add('shake-animation');
        setTimeout(() => errorContainer.classList.remove('shake-animation'), 500);
    }
}