// Movimiento.js

export class Movimiento {
    #id;
    #tipo; // Ej: 'DEPOSITO', 'RETIRO', 'TRANSFER_IN', 'TRANSFER_OUT'
    #monto;
    #fecha;
    #concepto; // Breve descripción de la transacción

    constructor(tipo, monto, concepto = "Transacción bancaria", fecha = null, id = null) {
        // Generamos un ID único si no viene uno (caso de nuevo movimiento)
        this.#id = id || crypto.randomUUID();
        this.#tipo = tipo;
        this.#monto = monto;
        this.#concepto = concepto;
        // Si no nos pasan fecha (nuevo movimiento), tomamos la fecha y hora actual
        this.#fecha = fecha || new Date().toISOString(); 
    }

    // --- GETTERS (Para leer los datos de forma segura en el Dashboard) ---
    get id() { return this.#id; }
    get tipo() { return this.#tipo; }
    get monto() { return this.#monto; }
    get fecha() { return this.#fecha; }
    get concepto() { return this.#concepto; }

    // --- MÉTODOS AUXILIARES ---

    // Formateador de fecha para la interfaz de usuario (UI)
    obtenerFechaFormateada() {
        const fechaObj = new Date(this.#fecha);
        return fechaObj.toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    deserializarParaJSON() {
        return {
            id: this.#id,
            tipo: this.#tipo,
            monto: this.#monto,
            fecha: this.#fecha,
            concepto: this.#concepto
        };
    }
}