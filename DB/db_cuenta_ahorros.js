import { CuentaAhorro } from '../Models/CuentaAhorro.js'

export function guardarCuentasAhorros(listaCuentasAhorros) {
    const dataParaGuardar = listaCuentasAhorros.map(cuentaAhorro => cuentaAhorro.deselializarParaJSON());

    try {
        localStorage.setItem('Cuentas_ahorros', JSON.stringify(dataParaGuardar));
    } catch (error) {
        console.error('Error al guardar en la base de datos: ', error);
    }
}

export function ObtenerCuentaAhorros() {
    const data = localStorage.getItem('cuenta_ahorros');
    if (!data) return inicializarDatosSemilla();
}

function inicializarDatosSemilla() {
    const cuentaAhorros1 = new CuentaAhorros(
      1234,
      
    ) 
}

