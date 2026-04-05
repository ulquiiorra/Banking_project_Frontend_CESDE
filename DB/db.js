import { Clientes } from '../Models/Clientes';

// 1. Función para guardar (Serializar)
export function guardarClientes(listaClientes) {
    const dataParaGuardar = listaClientes.map(c => ({
        id: c.id,
        identificacion: c.indentificacion,
        nombresCompletos: c.nombresCompletos,
        correo: c.correo, // <-- NUEVO: Agregado para serialización
        celular: c.celular,
        usuario: c.usuario,
        contrasena: c.contraseña, 
        intentos: c.intentosFallidos,
        bloqueado: c.bloqueado
    }));
    
    try {
        localStorage.setItem('banco_clientes', JSON.stringify(dataParaGuardar));
    } catch (error) {
        console.error("Error al guardar en la base de datos simulada:", error);
    }
}

// 2. Función para cargar (Hidratar)
export function obtenerClientes() {
    const data = localStorage.getItem('banco_clientes');
    if (!data) return inicializarDatosSemilla();

    try {
        const objetosSimples = JSON.parse(data);
        return objetosSimples.map(obj => {
            // Volvemos a crear la instancia de la Clase con el correo
            const cliente = new Clientes(
                obj.id, 
                obj.identificacion, 
                obj.nombresCompletos, 
                obj.correo, // <-- NUEVO: Pasado al constructor (ajusta el orden según tu clase)
                obj.celular, 
                obj.usuario, 
                obj.contrasena
            );

            // FIX ARQUITECTÓNICO: Restaurar el estado de seguridad
            cliente.intentosFallidos = obj.intentos || 0;
            cliente.bloqueado = obj.bloqueado || false;

            return cliente;
        });
    } catch (error) {
        console.error("Datos corruptos en localStorage. Reiniciando BD...", error);
        return inicializarDatosSemilla();
    }
}

// 3. Datos de prueba
function inicializarDatosSemilla() {
    console.log("Generando datos de prueba...");
    // NUEVO: Agregamos el correo a los datos semilla
    const cliente1 = new Clientes(1, "123", "Admin Alchemy", "admin@cajero.com", "3001", "admin", "1234");
    const cliente2 = new Clientes(2, "456", "Pepe Transfer", "pepe@cajero.com", "3002", "pepe", "5678");
    
    const lista = [cliente1, cliente2];
    guardarClientes(lista);
    return lista;
}