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

        transfer(amount, targetAccount) {
        // Regla 1: No permitir transferencias al mismo producto
        // Comparamos el número de esta cuenta con el de la cuenta destino
        const montoLimpio = parseFloat(amount);

        if (this.numeroCuenta === targetAccount.numeroCuenta) {
            throw new Error("❌ You cannot transfer money to the same account.");
        }

        const saldoBase = Math.max(0, this.saldo); 
        const limiteSobregiro = saldoBase * 0.20;
        const capacidadTotal = saldoBase + limiteSobregiro;

        // 2. Validamos la regla de negocio
        if (montoLimpio > capacidadTotal) {
            throw new Error(`❌ Excede el límite. Tu saldo es $${saldoBase} y tu sobregiro máximo es $${limiteSobregiro}.`);
        }

        console.log(`🔄 Starting transfer of $${amount} to account ${targetAccount.numeroCuenta}...`);

        // Regla 2: Retiramos de esta cuenta
        // Al llamar a this.withdraw(), automáticamente se le aplicará el 1.5% de interés 
        // y se registrará con el tipo personalizado 'TRANSFER_OUT'
        this.withdraw(amount, 'TRANSFER_OUT');

        // Regla 3: Consignamos en la cuenta destino
        // targetAccount es una instancia de Cuenta (o sus hijas), así que podemos llamar a deposit
        targetAccount.deposit(amount, 'TRANSFER_IN');

        console.log("✅ Transfer completed successfully.");
        return true;
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