import { Clientes } from '../Models/Clientes.js';
import { CuentaAhorros } from '../Models/CuentaAhorro.js';
import { CuentaCorriente } from '../Models/CuentaCorriente.js';
import { TarjetaCredito } from '../Models/TarjetaCredito.js';

export function guardarClientes(listaClientes) {
    // Gracias al ajuste en Clientes.js, esto ahora guarda los datos privados correctamente
    const dataParaGuardar = listaClientes.map(cliente => cliente.deserializarParaJSON());
    try {
        localStorage.setItem('banco_clientes', JSON.stringify(dataParaGuardar));
        console.log("💾 Base de datos guardada con éxito.");
    } catch (error) {
        console.error("❌ Error al guardar en la base de datos simulada:", error);
    }
}

export function obtenerClientes() {
    const data = localStorage.getItem('banco_clientes');
    
    // Si es la primera vez que entra, generamos los datos semilla
    if (!data) return inicializarDatosSemilla();

    try {
        const objetosSimples = JSON.parse(data);
        
        return objetosSimples.map(obj => {
            // 1. Instanciamos el cliente base (sin cuentas iniciales para evitar sobreescritura)
            const cliente = new Clientes(
                obj.id, 
                obj.nombreCompleto,       
                obj.correoElectronico,    
                obj.numeroDocumento,      
                obj.celular, 
                obj.nombreUsuario,        
                obj.contrasena,
                [] 
            );

            // 2. 🌊 FASE DE HIDRATACIÓN: Convertimos JSON a Clases Reales
            if (obj.cuentas && Array.isArray(obj.cuentas)) {
                
                const cuentasInstanciadas = obj.cuentas.map(cuentaJSON => {
                    const tipo = (cuentaJSON.tipoProducto || cuentaJSON.tipo || 'ahorros').toLowerCase();
                    let cuentaReal;

                    // FABRICA DE CUENTAS (Factory Pattern)
                    if (tipo === 'ahorros') {
                        cuentaReal = new CuentaAhorros(
                            cuentaJSON.numeroCuenta,
                            cuentaJSON.fechaApertura,
                            cuentaJSON.estado,
                            cuentaJSON.saldo,
                            cuentaJSON.tasaInteres
                        );
                    } 
                    else if (tipo === 'corriente') {
                        cuentaReal = new CuentaCorriente(
                            cuentaJSON.numeroCuenta,
                            cuentaJSON.fechaApertura,
                            cuentaJSON.estado,
                            cuentaJSON.saldo
                        );
                    } 
                    else if (tipo === 'credito' || tipo === 'tarjeta_credito') {
                        cuentaReal = new TarjetaCredito(
                            cuentaJSON.numeroCuenta,
                            cuentaJSON.fechaApertura,
                            cuentaJSON.estado,
                            cuentaJSON.saldo,
                            cuentaJSON.cupoAprobado,
                            cuentaJSON.tasaInteresMensual
                        );
                    } 
                    else {
                        cuentaReal = cuentaJSON; // Fallback de seguridad
                    }

                    // 3. Restauramos el historial de movimientos de cada cuenta
                    if (cuentaReal && typeof cuentaReal.restaurarMovimientos === 'function') {
                        cuentaReal.restaurarMovimientos(cuentaJSON.movimientos || []);
                    }

                    return cuentaReal;
                });

                // Le inyectamos las cuentas ya vivas al cliente
                cliente.restaurarCuentas(cuentasInstanciadas);
            }

            // 4. Restauramos el estado de seguridad (bloqueos y contraseñas)
            if (typeof cliente.restaurarEstadoSeguridad === 'function') {
                cliente.restaurarEstadoSeguridad(obj.intentosFallidos, obj.bloqueado);
            }

            return cliente;
        });
    } catch (error) {
        console.error("⚠️ Datos corruptos en localStorage. Reiniciando BD...", error);
        return inicializarDatosSemilla();
    }
}

function inicializarDatosSemilla() {
    console.log("🌱 Generando datos de prueba (Semilla)...");
    
    // Creamos el cliente administrador
    const cliente1 = new Clientes(
        1, 
        "Admin Alchemy", 
        "admin@cajero.com", 
        "123456789", 
        "3001002000", 
        "admin", 
        "1234", 
        [] 
    );

    const fechaHoy = new Date().toISOString();

    // 🏗️ Inyectamos directamente instancias de las clases con los valores reales
    const portafolioInicial = [
        new CuentaAhorros("5292", fechaHoy, "ACTIVA", 12450.00, 0.015),
        new CuentaCorriente("9876", fechaHoy, "ACTIVA", 5120.00),
        // Recordatorio: En tarjeta de crédito, el saldo negativo es la deuda actual
        new TarjetaCredito("1009", fechaHoy, "ACTIVA", -2400.00, 5000.00, 0.022) 
    ];

    // Restauramos las cuentas al cliente
    cliente1.restaurarCuentas(portafolioInicial);

    const lista = [cliente1];
    guardarClientes(lista);
    return lista;
}