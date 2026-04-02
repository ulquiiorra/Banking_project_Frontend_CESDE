export class CuentaAhorros extends Cuenta {
    #tasaInteres;

    constructor(numeroCuenta, fechaApertura, estado, tasaInteres, movimientos = [], saldo = 0) {
        super(numeroCuenta, fechaApertura, estado, movimientos, saldo);
        this.#tasaInteres = tasaInteres;
    }

    get tasaInteres() {
        return this.#tasaInteres;
    }

    set tasaInteres(nuevaTasa) {
        if (nuevaTasa < 0) {
            console.log("La tasa de interés no puede ser negativa");
            return;
        }
        this.#tasaInteres = nuevaTasa;
    }


    retirar(monto) {
        if (monto > this.saldo) {
            console.log("Fondos insuficientes");
            return;
        }

        this.saldo = this.saldo - monto;
        console.log(`Retiro exitoso. Nuevo saldo: ${this.saldo}`);
    }

    calcularIntereses() {
        return this.saldo * this.#tasaInteres;
    }

    aplicarIntereses() {
        const interes = this.calcularIntereses();
        this.saldo = this.saldo + interes;
        console.log(`Intereses aplicados: ${interes}. Nuevo saldo: ${this.saldo}`);
    }

    transferir(destino, monto) {
        if (!this.validarDestino(destino)) {
            console.log("Cuenta destino no válida");
            return;
        }

        if (monto > this.saldo) {
            console.log("Fondos insuficientes");
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