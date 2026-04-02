export class Cuenta {
    #numeroCuenta;
    #saldo;
    #fechaApertura;
    #estado;
    #movimientos;

    constructor (numeroCuenta,fechaApertura,estado,moviemientos,saldo = 0){
        this.#numeroCuenta = numeroCuenta;
        this.#saldo = saldo;
        this.#fechaApertura = fechaApertura;
        this.#estado = estado;
        this.#movimientos = [];
    }

    get numeroCuenta (){
        return this.#numeroCuenta;
    }

    get saldo (){
        return this.#saldo;
    }

    get fechaApertura(){
        return this.#fechaApertura
    }

    get estado(){
        return this.#estado
    }

    get moviemientos(){
        return this.#movimientos
    }

    set numeroCuenta(nuevoNumero){
        this.#numeroCuenta =nuevoNumero;
    }

    set saldo (nuevoSaldo){
        if (nuevoSaldo < 0){
            console.log(" el saldo no puedo ser negativo");
            return;
        }
        this.#saldo = nuevoSaldo;
    }

    set fechaApertura(nuevaFecha){
        this.#fechaApertura = nuevaFecha;
    }

    set estado(nuevoEstado){
        this.#estado = nuevoEstado;
    }

    set moviemientos(nuevosMovimientos){
        if (!Array.isArray(nuevosMovimientos)){
            console.log(" los movimientos deben ser un arreglo");
            return;
        }
        this.#movimientos = nuevosMovimientos;
    }
}
