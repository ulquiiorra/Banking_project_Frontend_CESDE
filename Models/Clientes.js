// Clientes.js

export class Clientes {
    // Definimos los campos privados que coinciden con el formulario
    #id; // Generado internamente
    #nombreCompleto;
    #correoElectronico;
    #numeroDocumento;
    #celular;
    #nombreUsuario; // Antes 'usuario'
    #contrasena; // Usamos 'ñ' o 'ni' para que no choque con palabras clave

    // Campos de estado internos (no están en el formulario)
    #intentosFallidos;
    #bloqueado;
    #productoInicial; // Nuevo: guarda el producto seleccionado en el registro
    #cuentas; // Lista de objetos 'Cuenta' asociados

    constructor(
        id, 
        nombreCompleto, 
        correoElectronico, 
        numeroDocumento, 
        celular, 
        nombreUsuario, 
        contrasena,
        productoInicial // 'corriente', 'ahorros' o 'credito'
    ) {
        this.#id = id;
        this.#nombreCompleto = nombreCompleto;
        this.#correoElectronico = correoElectronico;
        this.#numeroDocumento = numeroDocumento;
        this.#celular = celular;
        this.#nombreUsuario = nombreUsuario;
        this.#contrasena = contrasena; // IMPORTANTE: En producción esto iría encriptado

        // Inicialización del estado interno
        this.#intentosFallidos = 0;
        this.#bloqueado = false;
        this.#productoInicial = productoInicial;
        this.#cuentas = []; 
    }

    // --- GETTERS (Mantenemos la privacidad pero permitimos lectura) ---
    get id() { return this.#id; }
    get nombreCompleto() { return this.#nombreCompleto; }
    get correoElectronico() { return this.#correoElectronico; }
    get numeroDocumento() { return this.#numeroDocumento; }
    get celular() { return this.#celular; }
    get nombreUsuario() { return this.#nombreUsuario; }
    // No creamos getter para contraseña por seguridad
    get intentosFallidos() { return this.#intentosFallidos; }
    get bloqueado() { return this.#bloqueado; }
    get productoInicial() { return this.#productoInicial; }
    get cuentas() { return [...this.#cuentas]; } // Devolvemos una copia


    // --- MÉTODOS DE LÓGICA DE NEGOCIO (Actualizados) ---

    autenticar(usuarioIngresado, contraseñaIngresada) {
        if (this.#bloqueado) {
            throw new Error("❌ La cuenta está bloqueada por seguridad.");
        }

        if (this.#nombreUsuario === usuarioIngresado && this.#contrasena === contraseñaIngresada) {
            this.resetearIntentos();
            console.log(`✅ Bienvenido de nuevo, ${this.#nombreCompleto}`);
            return true;
        } else {
            this.#incrementarIntentos();
            console.warn("⚠️ Usuario o contraseña incorrectos.");
            return false;
        }
    }

    // Arreglamos el error de sintaxis anterior (no es set)
    #incrementarIntentos() {
        this.#intentosFallidos++;
        console.log(`Intentos fallidos: ${this.#intentosFallidos}/3`);
        if (this.#intentosFallidos >= 3) {
            this.#bloqueado = true;
            throw new Error("🚨 La cuenta ha sido bloqueada debido a demasiados intentos fallidos.");
        }
    }

    resetearIntentos() {
        this.#intentosFallidos = 0;
    }

    cambiarContrasena(contrasenaActual, nuevaContrasena) {
        if (this.#contrasena !== contrasenaActual) {
            throw new Error("❌ La contraseña actual es incorrecta.");
        }
        if (contrasenaActual === nuevaContrasena) {
            throw new Error("❌ La nueva contraseña no puede ser igual a la anterior.");
        }
        
        // Aquí podrías agregar validaciones de fuerza de contraseña
        this.#contrasena = nuevaContrasena;
        console.log("✅ Contraseña actualizada exitosamente.");
        return true;
    }

    // Actualizado con los nuevos nombres de campo
    editarPerfil({ nuevoNombre, nuevoCorreo, nuevoDocumento, nuevoCelular, nuevoUsuario }) {
        if (nuevoNombre) this.#nombreCompleto = nuevoNombre;
        if (nuevoCorreo) this.#correoElectronico = nuevoCorreo;
        if (nuevoDocumento) this.#numeroDocumento = nuevoDocumento;
        if (nuevoCelular) this.#celular = nuevoCelular;
        if (nuevoUsuario) this.#nombreUsuario = nuevoUsuario;
        
        console.log("✅ Perfil actualizado.");
        return true;
    }

    agregarCuenta(nuevaCuenta) {
        this.#cuentas.push(nuevaCuenta);
        console.log(`💳 Nueva cuenta ${nuevaCuenta.tipo} agregada.`);
    }

    // --- EL TRUCO PARA LOCALSTORAGE ---
    // Método para guardar los datos privados en un formato JSON amigo
    deserializarParaJSON() {
        return {
            id: this.#id,
            nombreCompleto: this.#nombreCompleto,
            correoElectronico: this.#correoElectronico,
            numeroDocumento: this.#numeroDocumento,
            celular: this.#celular,
            nombreUsuario: this.#nombreUsuario,
            contrasena: this.#contrasena, // Guardamos los datos para 'rehidratar'
            intentosFallidos: this.#intentosFallidos,
            bloqueado: this.#bloqueado,
            productoInicial: this.#productoInicial
            // Las cuentas requerirían su propia lógica de deserialización
        };
    }
}