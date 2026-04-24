// AuthService.js
import { obtenerClientes } from '../DB/db_clientes.js';

export const AuthService = {
    iniciarSesion: (usuarioIngresado, contrasenaIngresada) => {
        const clientes = obtenerClientes(); // Traemos toda la DB
        
        // Buscamos si existe el usuario
        const clienteEncontrado = clientes.find(c => c.nombreUsuario === usuarioIngresado);

        if (!clienteEncontrado) {
            return { exito: false, mensaje: "Usuario no encontrado" };
        }

        try {
            // Usamos el método de tu clase que valida y maneja bloqueos
            const authExitosa = clienteEncontrado.autenticar(usuarioIngresado, contrasenaIngresada);
            
            if (authExitosa) {
                // GUARDAMOS LA SESIÓN: Serializamos el cliente para el localStorage
                localStorage.setItem('usuarioLogueado', JSON.stringify(clienteEncontrado.deserializarParaJSON()));
                
                // Aquí deberías guardar la DB actualizada (por si se resetearon los intentos)
                // guardarClientes(clientes); 
                
                return { exito: true };
            }
        } catch (error) {
            // Atrapa el error de cuenta bloqueada que lanzaste en la clase
            return { exito: false, mensaje: error.message };
        }

        return { exito: false, mensaje: "Credenciales incorrectas" };
    },

    obtenerUsuarioActual: () => {
        const datosSession = localStorage.getItem('usuarioLogueado');
        return datosSession ? JSON.parse(datosSession) : null;
    },

    cerrarSesion: () => {
        localStorage.removeItem('usuarioLogueado');
    }
};