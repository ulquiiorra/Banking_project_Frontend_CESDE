import { CuentaAhorros } from '../Models/CuentaAhorro.js'; // Asegúrate del nombre exacto del archivo

export function guardarCuentasAhorros(listaCuentasAhorros) {
    // Corregido: deserializar (con r)
    const dataParaGuardar = listaCuentasAhorros.map(cuenta => cuenta.deserializarParaJSON());

    try {
        // Estandarizamos la clave en minúsculas para evitar errores
        localStorage.setItem('cuentas_ahorros', JSON.stringify(dataParaGuardar));
    } catch (error) {
        console.error('Error al guardar en la base de datos: ', error);
    }
}

export function obtenerCuentaAhorros() {
    const data = localStorage.getItem('cuentas_ahorros'); // Misma clave que arriba
    if (!data) return inicializarDatosSemilla();

    try {
        const objetosSimples = JSON.parse(data);
        return objetosSimples.map(obj => {
            // Reconstruimos la instancia usando el constructor
            const cuenta = new CuentaAhorros(
                obj.numeroCuenta, 
                obj.fechaApertura, 
                obj.estado, 
                obj.saldo, 
                obj.tasaInteres
            );
            
            // Opcional: Aquí tendríamos que restaurar los movimientos si los hay
            // cuenta.restaurarMovimientos(obj.movimientos); 

            return cuenta;
        });
    } catch (error) {
        console.error("Error leyendo cuentas:", error);
        return inicializarDatosSemilla();
    }
}

function inicializarDatosSemilla() {
    // Creamos un par de cuentas de prueba (una con saldo 0, otra con dinero)
    const cuenta1 = new CuentaAhorros("123456789", new Date().toISOString(), "ACTIVA", 100000);
    const cuenta2 = new CuentaAhorros("987654321", new Date().toISOString(), "ACTIVA", 1500000); 

    const lista = [cuenta1, cuenta2];
    guardarCuentasAhorros(lista);
    return lista;
}