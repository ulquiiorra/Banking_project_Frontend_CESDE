 export class Clientes {
     #id;
     #indentificacion;
     #nombresCompletos;
     #celular;
     #usuario;
     #contraseña;
     #intentosFallidos;
     #bloqueado;
     #cuentas;

     constructor(id, indentificacion, nombresCompletos, celular, usuario, contraseña, intentosFallidos, bloqueado,cuentas) {
          this.#id = id;
          this.#indentificacion = indentificacion;
          this.#nombresCompletos = nombresCompletos;
          this.#celular = celular;
          this.#usuario = usuario;
          this.#contraseña = contraseña;
          this.#intentosFallidos = 0;
          this.#bloqueado = false;
          this.#cuentas= [];


        
     }

     get id() {
                return this.#id;
        }


        get indentificacion(){
            return this.#indentificacion;
        }



        get nombresCompletos(){
            return this.#nombresCompletos;
        }


        get celular(){
            return this.#celular;
        }

        get usuario(){
            return this.#usuario;
        }

        get contraseña(){
            return this.#contraseña;
        }

        get intentosFallidos(){
            return this.#intentosFallidos
        }

        get bloqueado(){
            return this.#bloqueado;
        }

        get cuentas(){
            return [...this.#cuentas];
        }


        set id (id){
            this.#id=id;;
        }


        set indentificacion(indentificacion){
            this.#indentificacion=indentificacion;
        }

        set nombresCompletos(nombresCompletos ){
            this.#nombresCompletos=nombresCompletos;
        }

        set cellular(celular){
            this.#celular=celular;
        }

        set usuario(usuario){
            this.#usuario=usuario;
        }

        set cambiarContraseña (contraseña){
            this.#contraseña=contraseña;
        }

        set intestosFallidos(intestosFallidos){
            this.#intentosFallidos=intestosFallidos;
        }

        set bloqueado(bloqueado){
            this.#bloqueado=bloqueado;
        }

        autenticar(usuarioIngresado, contraseñaIngresado){
            if (this.#bloqueado ){
                throw new Error("la cuenta esta bloqueado")
            }

            if (this.#usuario !== usuarioIngresado){
                return false ;
            }

            if (this.#contraseña === contraseñaIngresado){
                this.#intentosFallidos();
                return true ;
            }else{
                this.incrementarIntentos();
                return false ;
            }

           
        }


         cerrarSecion(){
                return true;
            }


            cambiarContraseña(contraseñaActual,nuevaContraseña){
                if(this.#contraseña !== contraseñaActual){
                    throw new Error ("la contraseña actual es incorrecta");
                }

                if (contraseñaActual=== nuevosContraseña){
                    throw new Error ("la nueva contraseña no puede ser igual a la contraseña actual");
                }

                this.#contraseña = nuevaContraseña;
                return true;
            }

            incrementarIntentos(){
                this.#intentosFallidos++;
                if (this.#intentosFallidos >= 3){
                    this.#bloqueado = true;
                    throw new Error ("la cuenta ha sido bloqueado por demaciados inyestos fallidos")
                }
            }

            resetearIntentos(){
                this.#intentosFallidos = 0;
            }

            editarPerfil(nuevoNombre, nuevoCelular, nuevaIdentificacion,nuevoUsuario){
                if (nuevoNombre) this.#nombresCompletos = nuevoNombre;
                if (nuevoCelular) this.#celular = nuevoCelular;
                if (nuevaIdentificacion) this.#indentificacion = nuevaIdentificacion;
                if (nuevoUsuario) this.#usuario = nuevoUsuario;
                return true;
            }



            agregarCuenta(nuevaCuenta){
                this.#cuentas.push(nuevaCuenta);

            }





       






    }
