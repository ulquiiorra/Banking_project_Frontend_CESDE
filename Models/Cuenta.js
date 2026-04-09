export class Cuenta {
    #numeroCuenta;
    #saldo;
    #fechaApertura;
    #estado;
    #movimientos;

    constructor(numeroCuenta, fechaApertura, estado, saldo = 0) {
        // 1. Simulación estricta de Clase Abstracta
        if (new.target === Cuenta) {
            throw new Error("❌ No se puede instanciar la clase abstracta 'Cuenta' directamente.");
        }

        this.#numeroCuenta = numeroCuenta;
        this.#saldo = saldo;
        this.#fechaApertura = fechaApertura;
        this.#estado = estado;
        this.#movimientos = []; // Corregido: Inicializamos vacío por defecto
    }

    // --- GETTERS (Lectura Segura) ---
    get numeroCuenta() { return this.#numeroCuenta; }
    get saldo() { return this.#saldo; }
    get fechaApertura() { return this.#fechaApertura; }
    get estado() { return this.#estado; }
    
    // Corregido el typo "moviemientos" a "movimientos". 
    // Devolvemos una copia [...] para evitar que modifiquen el array original desde afuera.
    get movimientos() { return [...this.#movimientos]; } 

    // --- MÉTODOS DE NEGOCIO EN INGLÉS (Lógica de Dinero) ---

    deposit(amount, transactionType = 'DEPOSIT') {
        if (amount <= 0) {
            throw new Error("El monto a depositar debe ser mayor a cero.");
        }
        this.#saldo += amount;
        this.#recordTransaction(transactionType, amount);
        console.log(`✅ Depósito exitoso. Nuevo saldo: $${this.#saldo}`);
        return true;
    }

    withdraw(amount, transactionType = 'WITHDRAWAL') {
        if (amount <= 0) {
            throw new Error("El monto a retirar debe ser mayor a cero.");
        }
        if (amount > this.#saldo) {
            throw new Error("Fondos insuficientes para realizar este retiro.");
        }
        this.#saldo -= amount;
        this.#recordTransaction(transactionType, amount);
        console.log(`✅ Retiro exitoso. Nuevo saldo: $${this.#saldo}`);
        return true;
    }

    // Método auxiliar privado para registrar el historial automáticamente
    #recordTransaction(type, amount) {
        const transaccion = {
            id: crypto.randomUUID(), // Genera un ID único para la transacción
            type: type,
            amount: amount,
            date: new Date().toISOString()
        };
        this.#movimientos.push(transaccion);
    }

    //metodo para deserializar y poder convertir en JSON
    deserializarParaJSON() {
        return {
            numeroCuenta: this.#numeroCuenta,
            saldo: this.#saldo,
            fechaApertura: this.#fechaApertura,
            estado: this.#estado,
            movimientos: this.#movimientos
        };
    }
}