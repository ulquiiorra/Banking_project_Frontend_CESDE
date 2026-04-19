/**
 * Stitch Refactor - Perfil Controller
 * Especialista: Senior Frontend Developer
 */

import { obtenerClientes, guardarClientes } from '../../DB/db_clientes';

let clientes = [];
let clienteActual = null;
let pestañaActiva = 'personales'; // Puede ser 'personales' o 'seguridad'

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    initTabNavigation();
    initFormInteractions();
    initScrollEffects();
});

function cargarDatosUsuario() {
    clientes = obtenerClientes();
    
    // Simulación: obtenemos el id del usuario logueado. Ajusta esto a tu lógica de login.
    const idUsuarioLogueado = localStorage.getItem('usuario_logueado') || 1; 
    clienteActual = clientes.find(c => c.id == idUsuarioLogueado);

    if (clienteActual) {
        document.getElementById('nombreCompleto').value = clienteActual.nombreCompleto;
        document.getElementById('numeroDocumento').value = clienteActual.numeroDocumento;
        document.getElementById('correoElectronico').value = clienteActual.correoElectronico;
        document.getElementById('celular').value = clienteActual.celular;
        
        document.querySelector('.user-name').textContent = clienteActual.nombreCompleto.toUpperCase();
    }
}

function initTabNavigation() {
    const btnPersonal = document.getElementById('btnTabPersonal');
    const btnSecurity = document.getElementById('btnTabSecurity');
    const sectionPersonal = document.getElementById('sectionPersonal');
    const sectionSecurity = document.getElementById('sectionSecurity');
    
    // Al hacer clic en Datos Personales
    btnPersonal.addEventListener('click', () => {
        pestañaActiva = 'personales';
        
        // Estilos de pestañas
        btnSecurity.classList.remove('active');
        btnPersonal.classList.add('active');
        
        // Mostrar/Ocultar secciones
        sectionSecurity.style.display = 'none';
        sectionPersonal.style.display = 'block';

        // Hacer obligatorios/opcionales los campos
        gestionarRequeridos(true);
    });

    // Al hacer clic en Seguridad
    btnSecurity.addEventListener('click', () => {
        pestañaActiva = 'seguridad';
        
        // Estilos de pestañas
        btnPersonal.classList.remove('active');
        btnSecurity.classList.add('active');
        
        // Mostrar/Ocultar secciones
        sectionPersonal.style.display = 'none';
        sectionSecurity.style.display = 'block';

        // Hacer obligatorios/opcionales los campos
        gestionarRequeridos(false);
    });
}

// Función auxiliar para que el formulario no exija llenar contraseñas si solo estás editando el nombre
function gestionarRequeridos(esDatosPersonales) {
    document.getElementById('nombreCompleto').required = esDatosPersonales;
    document.getElementById('correoElectronico').required = esDatosPersonales;
    document.getElementById('celular').required = esDatosPersonales;

    document.getElementById('passActual').required = !esDatosPersonales;
    document.getElementById('passNueva').required = !esDatosPersonales;
    document.getElementById('passConfirmar').required = !esDatosPersonales;
}

function initFormInteractions() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input:not([disabled])');

    // Efecto visual en inputs (mantiene tu diseño)
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!clienteActual) return;

        if (pestañaActiva === 'personales') {
            guardarDatosPersonales();
        } else {
            guardarSeguridad();
        }
    });
}

function guardarDatosPersonales() {
    clienteActual.nombreCompleto = document.getElementById('nombreCompleto').value;
    clienteActual.correoElectronico = document.getElementById('correoElectronico').value;
    clienteActual.celular = document.getElementById('celular').value;

    guardarYAnimarBoton();
    document.querySelector('.user-name').textContent = clienteActual.nombreCompleto.toUpperCase();
}

function guardarSeguridad() {
    const passActualInput = document.getElementById('passActual').value;
    const passNuevaInput = document.getElementById('passNueva').value;
    const passConfirmarInput = document.getElementById('passConfirmar').value;

    // 1. Validar contraseña actual
    if (passActualInput !== clienteActual.contrasena) {
        alert("La contraseña actual es incorrecta.");
        return;
    }

    // 2. Validar que las nuevas coincidan
    if (passNuevaInput !== passConfirmarInput) {
        alert("Las nuevas contraseñas no coinciden.");
        return;
    }

    // 3. Guardar nueva contraseña y limpiar campos
    clienteActual.contrasena = passNuevaInput;
    document.getElementById('passActual').value = '';
    document.getElementById('passNueva').value = '';
    document.getElementById('passConfirmar').value = '';
    
    guardarYAnimarBoton();
}

function guardarYAnimarBoton() {
    guardarClientes(clientes);

    const btn = document.getElementById('btnSave');
    const btnText = document.getElementById('btnSaveText');
    const btnIcon = document.getElementById('btnSaveIcon');

    // Animación inicial
    btnText.textContent = 'ACTUALIZANDO...';
    btnIcon.textContent = 'sync'; // Cambia el icono temporalmente
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        // Estado de éxito
        btnText.textContent = 'CAMBIOS GUARDADOS';
        btnIcon.textContent = 'check_circle';
        btn.style.background = '#476900';
        btn.style.color = '#ffffff';
        
        setTimeout(() => {
            // Volver al estado original
            btnText.textContent = 'GUARDAR CAMBIOS';
            btnIcon.textContent = 'bolt';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }, 2000);
    }, 800);
}

function initScrollEffects() {
    const appBar = document.querySelector('.app-bar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            appBar.style.background = 'rgba(14, 14, 14, 0.95)';
            appBar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            appBar.style.background = 'rgba(14, 14, 14, 0.8)';
            appBar.style.boxShadow = 'none';
        }
    });
}