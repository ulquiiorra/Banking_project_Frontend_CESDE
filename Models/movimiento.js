  export class  Movimiento{
    #id;
    #fechaHora;
    #tipo;
    #valor;
    #saldoPosterior;
    #descripcion;

    constructor(id, fechaHora, tipo, valor, saldoPosterior, descripcion){
        this.#id = id;
        this.#fechaHora = fechaHora instanceof Date ? fechaHora : new Date(fechaHora);
        this.#tipo = tipo;
        this.#valor = valor;
        this.#saldoPosterior = saldoPosterior;
        this.#descripcion = descripcion;
    }

    getId(){
        return this.#id;
    }

    getFechaHora(){
        return this.#fechaHora;
    }

    getTipo(){
        return this.#tipo;
    }

    getValor(){
        return this.#valor;
    }

    getSaldoPosterior(){
        return this.#saldoPosterior
    }

    getDescripcion(){
        return this.#descripcion
    }

    toString(){
          return `Movimiento [${this.#id}] - ${this.#tipo} de ${this.#valor} 
    Fecha: ${this.#fechaHora.toLocaleString()} 
    Saldo posterior: ${this.#saldoPosterior} 
    Descripción: ${this.#descripcion}`;
    }


}