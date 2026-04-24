import { Cuenta } from './Cuenta.js';

export class CuentaCorriente extends Cuenta {
    constructor(numeroCuenta, fechaApertura, estado, saldo = 0) {
        super(numeroCuenta, fechaApertura, estado, saldo);
    }

    // Sobreescribimos el retiro para aplicar la regla del 20%
    withdraw(amount, transactionType = 'WITHDRAWAL') {
        const montoLimpio = parseFloat(amount);
        
        // 1. Calculamos el límite (20% adicional sobre el saldo actual)
        // Usamos Math.max para que, si el saldo ya es negativo o cero, no permita sobregiro infinito
        const saldoBase = Math.max(0, this.saldo); 
        const limiteSobregiro = saldoBase * 0.20;
        const capacidadTotal = saldoBase + limiteSobregiro;

        // 2. Validamos la regla de negocio
        if (montoLimpio > capacidadTotal) {
            throw new Error(`❌ Excede el límite. Tu saldo es $${saldoBase} y tu sobregiro máximo es $${limiteSobregiro}.`);
        }

        console.log(`⚠️ Usando cuenta corriente. Límite verificado.`);
        
        // 3. Ejecutamos el retiro en el padre, encendiendo el permiso de saldo negativo (true)
        return super.withdraw(montoLimpio, transactionType, true);
    }

    deserializarParaJSON() {
        const datosBase = super.deserializarParaJSON();
        return {
            ...datosBase,
            tipoProducto: 'corriente'
            // No agregamos tasaInteres porque no genera intereses
        };
    }
}