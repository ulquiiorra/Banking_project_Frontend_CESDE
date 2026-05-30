/**
 * Stitch Refactor - Perfil Controller
 * Especialista: Senior Frontend Developer
 */

import { obtenerClientes, guardarClientes } from '../../DB/db_clientes.js';
import { AuthService } from '../../Services/AuthService.js';

let clientes = [];
let clienteActual = null;
let pestañaActiva = 'personales';

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    initTabNavigation();
    initFormInteractions();
});

function cargarDatosUsuario() {
    const usuarioSesion = AuthService.obtenerUsuarioActual();
    if (!usuarioSesion) return;

    clientes = obtenerClientes();
    clienteActual = clientes.find(c => c.id == usuarioSesion.id);

    if (clienteActual) {
        document.getElementById('nombreCompleto').value    = clienteActual.nombreCompleto;
        document.getElementById('numeroDocumento').value   = clienteActual.numeroDocumento;
        document.getElementById('correoElectronico').value = clienteActual.correoElectronico;
        document.getElementById('celular').value           = clienteActual.celular;

        document.querySelector('.user-name').textContent = clienteActual.nombreCompleto.toUpperCase();
    }
}

function initTabNavigation() {
    const btnPersonal   = document.getElementById('btnTabPersonal');
    const btnSecurity   = document.getElementById('btnTabSecurity');
    const sectionPersonal = document.getElementById('sectionPersonal');
    const sectionSecurity = document.getElementById('sectionSecurity');

    btnPersonal.addEventListener('click', () => {
        pestañaActiva = 'personales';
        btnSecurity.classList.remove('active');
        btnPersonal.classList.add('active');
        sectionSecurity.style.display = 'none';
        sectionPersonal.style.display = '';
        gestionarRequeridos(true);
    });

    btnSecurity.addEventListener('click', () => {
        pestañaActiva = 'seguridad';
        btnPersonal.classList.remove('active');
        btnSecurity.classList.add('active');
        sectionPersonal.style.display = 'none';
        sectionSecurity.style.display = '';
        gestionarRequeridos(false);
    });
}

function gestionarRequeridos(esDatosPersonales) {
    document.getElementById('nombreCompleto').required     = esDatosPersonales;
    document.getElementById('correoElectronico').required  = esDatosPersonales;
    document.getElementById('celular').required            = esDatosPersonales;
    document.getElementById('passActual').required         = !esDatosPersonales;
    document.getElementById('passNueva').required          = !esDatosPersonales;
    document.getElementById('passConfirmar').required      = !esDatosPersonales;
}

function initFormInteractions() {
    const form   = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input:not([disabled])');

    inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur',  () => input.parentElement.classList.remove('focused'));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!clienteActual) return;
        pestañaActiva === 'personales' ? guardarDatosPersonales() : guardarSeguridad();
    });
}

function guardarDatosPersonales() {
    // Uses the editarPerfil() method from Cliente class
    clienteActual.editarPerfil({
        nuevoNombre:    document.getElementById('nombreCompleto').value,
        nuevoCorreo:    document.getElementById('correoElectronico').value,
        nuevoCelular:   document.getElementById('celular').value,
    });

    guardarClientes(clientes);
    localStorage.setItem('usuarioLogueado', JSON.stringify(clienteActual.deserializarParaJSON()));

    document.querySelector('.user-name').textContent = clienteActual.nombreCompleto.toUpperCase();
    guardarYAnimarBoton();
}

function guardarSeguridad() {
    const passActual    = document.getElementById('passActual').value;
    const passNueva     = document.getElementById('passNueva').value;
    const passConfirmar = document.getElementById('passConfirmar').value;

    if (passNueva !== passConfirmar) {
        alert("Las nuevas contraseñas no coinciden.");
        return;
    }

    try {
        // Uses the cambiarContrasena() method from Cliente class
        clienteActual.cambiarContrasena(passActual, passNueva);
    } catch (error) {
        alert(error.message);
        return;
    }

    guardarClientes(clientes);
    localStorage.setItem('usuarioLogueado', JSON.stringify(clienteActual.deserializarParaJSON()));

    document.getElementById('passActual').value    = '';
    document.getElementById('passNueva').value     = '';
    document.getElementById('passConfirmar').value = '';

    guardarYAnimarBoton();
}

function guardarYAnimarBoton() {
    const btn     = document.getElementById('btnSave');
    const btnText = document.getElementById('btnSaveText');
    const btnIcon = document.getElementById('btnSaveIcon');

    btnText.textContent   = 'ACTUALIZANDO...';
    btnIcon.textContent   = 'sync';
    btn.style.opacity     = '0.7';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btnText.textContent   = 'CAMBIOS GUARDADOS';
        btnIcon.textContent   = 'check_circle';
        btn.style.background  = '#476900';
        btn.style.color       = '#ffffff';

        setTimeout(() => {
            btnText.textContent     = 'GUARDAR CAMBIOS';
            btnIcon.textContent     = 'bolt';
            btn.style.background    = '';
            btn.style.color         = '';
            btn.style.opacity       = '1';
            btn.style.pointerEvents = 'auto';
        }, 2000);
    }, 800);
}