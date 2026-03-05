let saldo = parseFloat(prompt("Por favor ingresa el saldo"));

function consultarSaldo () {
    if(saldo > 0){
        return saldo;
    }

    else if (saldo === 0){
        alert ("Actualmente no tienes saldo disponible");
    } else {
        alert (" Tu saldo no puede ser negativo")
    }

}

console.log(consultarSaldo());