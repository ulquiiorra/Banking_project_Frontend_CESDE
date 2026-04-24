import { Movimiento } from './Movimiento.js';

export class Cuenta {
    #numeroCuenta;
    #saldo;
    #fechaApertura;
    #estado;
    #movimientos;

    constructor(numeroCuenta, fechaApertura, estado, saldo = 0) {
        if (new.target === Cuenta) {
            throw new Error("❌ No se puede instanciar la clase abstracta 'Cuenta' directamente.");
        }

        this.#numeroCuenta = numeroCuenta;
        
        // 🏗️ FIX: Forzamos matemáticamente a que sea un número válido al nacer
        this.#saldo = parseFloat(saldo) || 0; 
        
        this.#fechaApertura = fechaApertura;
        this.#estado = estado;
        this.#movimientos = [];
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
        // 🏗️ FIX: Limpiamos la cantidad entrante
        const montoLimpio = parseFloat(amount);

        if (isNaN(montoLimpio) || montoLimpio <= 0) {
            throw new Error("El monto a depositar debe ser un número mayor a cero.");
        }
        
        this.#saldo += montoLimpio;
        this.#recordTransaction(transactionType, montoLimpio); // Usamos el monto limpio
        
        console.log(`✅ Depósito exitoso. Nuevo saldo: $${this.#saldo}`);
        return true;
    }

    // En Cuenta.js
    withdraw(amount, transactionType = 'WITHDRAWAL', bypassSaldoCheck = false) {
        const montoLimpio = parseFloat(amount);
        if (isNaN(montoLimpio) || montoLimpio <= 0) {
            throw new Error("El monto a retirar debe ser mayor a cero.");
        }

        // Si NO estamos saltando el chequeo (bypass) y no hay fondos, bloqueamos
        if (!bypassSaldoCheck && montoLimpio > this.#saldo) {
            throw new Error("Fondos insuficientes para realizar este retiro.");
        }

        this.#saldo -= montoLimpio; // Aquí el saldo podrá quedar en negativo
        this.#recordTransaction(transactionType, montoLimpio);
        
        console.log(`✅ Retiro exitoso. Nuevo saldo: $${this.#saldo}`);
        return true;
    }

    // Método auxiliar privado para registrar el historial automáticamente
    #recordTransaction(type, amount, concept = "Movimiento en cuenta") {
        const nuevoMovimiento = new Movimiento(type, amount, concept);

        /* const transaccion = {
            id: crypto.randomUUID(), // Genera un ID único para la transacción
            type: type,
            amount: amount,
            date: new Date().toISOString()
        }; */
        this.#movimientos.push(nuevoMovimiento);
    }

    restaurarMovimientos(historialGuardado){
        if (historialGuardado && Array.isArray(historialGuardado)) {
            this.#movimientos = historialGuardado.map(mov => 
                new Movimiento(mov.tipo, mov.monto, mov.concepto, mov.fecha, mov.id)
            );
        }
    }

    //metodo para deserializar y poder convertir en JSON
    deserializarParaJSON() {
        return {
            numeroCuenta: this.#numeroCuenta,
            fechaApertura: this.#fechaApertura,
            estado: this.#estado,
            saldo: this.#saldo,
            // 🏗️ FIX: Revisamos si los movimientos son clases reales para extraer sus datos privados
            movimientos: this.#movimientos.map(mov => 
                typeof mov.deserializarParaJSON === 'function' 
                    ? mov.deserializarParaJSON() 
                    : mov 
            )
        };
    }
}