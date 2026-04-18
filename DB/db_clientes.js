import { Clientes } from '../Models/Clientes.js';

export function guardarClientes(listaClientes) {
    const dataParaGuardar = listaClientes.map(cliente => cliente.deserializarParaJSON());
    
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
            // 1. Instanciamos respetando el orden y nombres
            const cliente = new Clientes(
                obj.id, 
                obj.nombreCompleto,       
                obj.correoElectronico,    
                obj.numeroDocumento,      
                obj.celular, 
                obj.nombreUsuario,        
                obj.contrasena,
                obj.productoInicial       
            );

            // 2. FIX: Validación de seguridad. 
            // Solo intentamos restaurar si el método realmente existe en tu modelo actual.
            if (typeof cliente.restaurarEstadoSeguridad === 'function') {
                cliente.restaurarEstadoSeguridad(obj.intentosFallidos, obj.bloqueado);
            }

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
    
    // Instanciamos respetando el orden exacto del constructor de Clientes
    const cliente1 = new Clientes(
        1, 
        "Admin Alchemy", 
        "admin@cajero.com", 
        "123456789",   // numeroDocumento
        "3001002000",  // celular
        "admin",       // nombreUsuario
        "1234",        // contrasena
        "ahorros"      // productoInicial (Requerido)
    );

    const cliente2 = new Clientes(
        2, 
        "Pepe Transfer", 
        "pepe@cajero.com", 
        "987654321",   // numeroDocumento
        "3002003000",  // celular
        "pepe",        // nombreUsuario
        "5678",        // contrasena
        "corriente"    // productoInicial (Requerido)
    );
    
    const lista = [cliente1, cliente2];
    guardarClientes(lista);
    return lista;
}