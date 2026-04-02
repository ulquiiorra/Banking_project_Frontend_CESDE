export class CuentaCorriente extends Cuenta {
    #porcentajeSobregiro;
    #limiteSobregiro;

    constructor(
        numeroCuenta,
        fechaApertura,
        estado,
        porcentajeSobregiro,
        limiteSobregiro,
        movimientos = [],
        saldo = 0
    ) {
        super(numeroCuenta, fechaApertura, estado, movimientos, saldo);
        this.#porcentajeSobregiro = porcentajeSobregiro;
        this.#limiteSobregiro = limiteSobregiro;
    }

    // GETTERS Y SETTERS
    get porcentajeSobregiro() {
        return this.#porcentajeSobregiro;
    }

    set porcentajeSobregiro(valor) {
        if (valor < 0) {
            console.log("El porcentaje no puede ser negativo");
            return;
        }
        this.#porcentajeSobregiro = valor;
    }

    get limiteSobregiro() {
        return this.#limiteSobregiro;
    }

    set limiteSobregiro(valor) {
        if (valor < 0) {
            console.log("El límite no puede ser negativo");
            return;
        }
        this.#limiteSobregiro = valor;
    }

    retirar(monto) {
        const disponible = this.saldo + this.#limiteSobregiro;

        if (monto > disponible) {
            console.log("Excede el límite de sobregiro");
            return;
        }

        this.saldo = this.saldo - monto;
        console.log(`Retiro exitoso. Nuevo saldo: ${this.saldo}`);
    }

    calcularLimiteSobregiro() {
        this.#limiteSobregiro = this.saldo * this.#porcentajeSobregiro;
        return this.#limiteSobregiro;
    }

    transferir(destino, monto) {
        if (!this.validarDestino(destino)) {
            console.log("Cuenta destino no válida");
            return;
        }

        const disponible = this.saldo + this.#limiteSobregiro;

        if (monto > disponible) {
            console.log("Fondos insuficientes con sobregiro");
            return;
        }

        this.saldo -= monto;
        destino.saldo += monto;

        console.log("Transferencia exitosa");
    }

    validarDestino(cuenta) {
        return cuenta instanceof Cuenta;
    }
}