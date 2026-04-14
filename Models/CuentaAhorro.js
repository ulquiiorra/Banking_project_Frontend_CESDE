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

    transfer(amount, targetAccount) {
        // Regla 1: No permitir transferencias al mismo producto
        // Comparamos el número de esta cuenta con el de la cuenta destino
        if (this.numeroCuenta === targetAccount.numeroCuenta) {
            throw new Error("❌ You cannot transfer money to the same account.");
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
            tasaInteres: this.#tasaInteres,
            tipoProducto: 'ahorros'
        }
    }
}