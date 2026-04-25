import { Cuenta } from './Cuenta.js'; // Ajusta la ruta si es necesario

export class CuentaAhorros extends Cuenta {
    // Definimos el nuevo atributo exclusivo de esta clase
    #tasaInteres;

    constructor(numeroCuenta, fechaApertura, estado, saldo = 0, tasaInteres = 0.015) {
        // 'super' llama al constructor del padre (Cuenta) para inicializar sus datos
        super(numeroCuenta, fechaApertura, estado, saldo);
        this.#tasaInteres = tasaInteres;
    }

    // Getter para la tasa de interés
    get tasaInteres() { return this.#tasaInteres; }

    // --- SOBREESCRITURA DE MÉTODOS (Polimorfismo) ---

    // Sobreescribimos el método del padre para agregar tu regla del 1.5%
    withdraw(amount, transactionType = 'WITHDRAWAL') {
        // 1. Calculamos la comisión del 1.5%
        const fee = amount * this.#tasaInteres;
        const totalToDeduct = amount + fee;

        // 2. Validamos usando el getter del padre (this.saldo)
        if (totalToDeduct > this.saldo) {
            throw new Error("❌ Insufficient funds to cover the withdrawal and the 1.5% fee.");
        }

        console.log(`⚠️ Applying a 1.5% fee: $${fee}`);
        
        // 3. Dejamos que el padre haga el descuento y el registro en el historial
        return super.withdraw(totalToDeduct, transactionType);
    }

    // --- NUEVA FUNCIONALIDAD ---

    deserializarParaJSON() {
        const datosBase = super.deserializarParaJSON();

        return {
            ...datosBase,
            tasaInteres: this.#tasaInteres,
            tipoProducto: 'ahorros'
        }
    }
}