export class TarjetaCredito extends Cuenta {
    #cupo;
    #deuda;
    #numeroCuotas;

    constructor(
        numeroCuenta,
        fechaApertura,
        estado,
        cupo,
        deuda = 0,
        numeroCuotas = 1,
        movimientos = [],
        saldo = 0
    ) {
        super(numeroCuenta, fechaApertura, estado, movimientos, saldo);
        this.#cupo = cupo;
        this.#deuda = deuda;
        this.#numeroCuotas = numeroCuotas;
    }

    // GETTERS Y SETTERS
    get cupo() {
        return this.#cupo;
    }

    set cupo(valor) {
        if (valor < 0) {
            console.log("El cupo no puede ser negativo");
            return;
        }
        this.#cupo = valor;
    }

    get deuda() {
        return this.#deuda;
    }

    set deuda(valor) {
        if (valor < 0) {
            console.log("La deuda no puede ser negativa");
            return;
        }
        this.#deuda = valor;
    }

    get numeroCuotas() {
        return this.#numeroCuotas;
    }

    set numeroCuotas(valor) {
        if (valor < 1) {
            console.log("Debe haber al menos 1 cuota");
            return;
        }
        this.#numeroCuotas = valor;
    }

    // MÉTODOS

    retirar(monto) {
        if (monto > (this.#cupo - this.#deuda)) {
            console.log("Cupo insuficiente");
            return;
        }

        this.#deuda += monto;
        console.log(`Avance realizado. Deuda actual: ${this.#deuda}`);
    }

    comprar(monto, cuotas = 1) {
        if (monto > (this.#cupo - this.#deuda)) {
            console.log("Cupo insuficiente");
            return;
        }

        this.#deuda += monto;
        this.#numeroCuotas = cuotas;

        console.log(`Compra realizada a ${cuotas} cuotas. Deuda: ${this.#deuda}`);
    }

    pagar(monto) {
        if (monto > this.#deuda) {
            console.log("El pago excede la deuda");
            return;
        }

        this.#deuda -= monto;
        console.log(`Pago realizado. Deuda restante: ${this.#deuda}`);
    }
calcularTasa() {
    if (this.#numeroCuotas <= 2) {
        return 0; 
    }

    if (this.#numeroCuotas >= 3 && this.#numeroCuotas <= 6) {
        return 0.019;
    }

    if (this.#numeroCuotas >= 7) {
        return 0.023;
    }
}
   



    calcularCuotaMensual() {
        const tasa = this.calcularTasa();
        const cuota = (this.#deuda * (1 + tasa)) / this.#numeroCuotas;
        return cuota;
    }

    transferir(destino, monto) {
        if (!this.validarDestino(destino)) {
            console.log("Cuenta destino no válida");
            return;
        }

        if (monto > (this.#cupo - this.#deuda)) {
            console.log("Cupo insuficiente");
            return;
        }

        this.#deuda += monto;
        destino.saldo += monto;

        console.log("Transferencia desde tarjeta exitosa");
    }

    validarDestino(cuenta) {
        return cuenta instanceof Cuenta;
    }
}