import { Cuenta } from './Cuenta.js';

export class TarjetaCredito extends Cuenta {
    #tasaInteresMensual;
    #cupoAprobado;

    constructor(numeroCuenta, fechaApertura, estado, saldo = 0, cupoAprobado = 5000, tasaInteresMensual = 0.022) {
        // En una tarjeta, el saldo suele representar la DEUDA actual (por eso inicia en 0)
        super(numeroCuenta, fechaApertura, estado, saldo);
        this.#cupoAprobado = cupoAprobado;
        this.#tasaInteresMensual = tasaInteresMensual; // Ejemplo: 0.022 = 2.2%
    }

    get cupoAprobado() { return this.#cupoAprobado; }
    get cupoDisponible() { return this.#cupoAprobado - this.saldo; }

    // Implementación matemática de la cuota
    calcularCuotaMensual(capital, cuotas) {
        if (cuotas <= 0) throw new Error("El número de cuotas debe ser mayor a cero.");
        
        // Si la compra es a 1 cuota, usualmente no se cobra interés
        if (cuotas === 1) return capital;

        const tasa = this.#tasaInteresMensual;
        
        // Fórmula: (Capital * tasa) / (1 - (1 + tasa)^-n)
        const dividendo = capital * tasa;
        const divisor = 1 - Math.pow(1 + tasa, -cuotas);
        
        return dividendo / divisor;
    }

    // Método exclusivo para compras con tarjeta
    comprar(monto, cuotas, concepto = "Compra con Tarjeta") {
        const montoLimpio = parseFloat(monto);
        
        if (montoLimpio > this.cupoDisponible) {
            throw new Error(`❌ Cupo insuficiente. Disponible: $${this.cupoDisponible}`);
        }

        const cuota = this.calcularCuotaMensual(montoLimpio, cuotas);
        
        // En tarjetas, aumentar el saldo significa aumentar la deuda
        // Usamos un depósito inverso o llamamos directamente a los métodos del padre (con bypass)
        super.withdraw(montoLimpio, 'COMPRA_CREDITO', true);
        
        console.log(`✅ Compra aprobada: $${montoLimpio} a ${cuotas} cuotas de $${cuota.toFixed(2)}/mes`);
        return true;
    }

    deserializarParaJSON() {
        const datosBase = super.deserializarParaJSON();
        return {
            ...datosBase,
            tipoProducto: 'credito',
            cupoAprobado: this.#cupoAprobado,
            tasaInteresMensual: this.#tasaInteresMensual
        };
    }
}