/**
 * Credit Simulator Controller - OOP Integrated
 * State-based calculations for installment payments using real Amortization
 */
import { AuthService } from "../../Services/AuthService.js";
import { obtenerClientes } from "../../DB/db_clientes.js";

const simulator = {
    amount: 0,
    installments: 12,
    interestRate: 0.022, // Tasa por defecto (2.2%) por si entra sin iniciar sesión
    tarjetaReal: null,

    init() {
        this.cargarDatosUsuario();
        this.cacheDOM();
        this.bindEvents();
        this.updateUI(0, 0, this.getTasaPorCuotas(this.installments));
    },

    cargarDatosUsuario() {
        const session = AuthService.obtenerUsuarioActual();
        if (!session) return;

        const clientes = obtenerClientes();
        const clienteActual = clientes.find(c => c.id === session.id);

        if (clienteActual) {
            // Buscamos la tarjeta de crédito del usuario
            this.tarjetaReal = clienteActual.cuentas.find(c => {
                let tipoStr = c.tipo || c.tipoProducto;
                if (!tipoStr && typeof c.deserializarParaJSON === 'function') {
                    tipoStr = c.deserializarParaJSON().tipoProducto;
                }
                return String(tipoStr || '').toLowerCase().includes('credito');
            });

            // Si tiene tarjeta, extraemos su tasa de interés real
            if (this.tarjetaReal) {
                let datosPublicos = this.tarjetaReal;
                if (typeof this.tarjetaReal.deserializarParaJSON === 'function') {
                    datosPublicos = this.tarjetaReal.deserializarParaJSON();
                }
                this.interestRate = parseFloat(datosPublicos.tasaInteresMensual) || 0.022;
            }
        }
    },

    cacheDOM() {
        this.conceptInput = document.getElementById('concept-input');
        this.amountInput = document.getElementById('amount-input');
        this.rangeInput = document.getElementById('installment-range');
        this.countDisplay = document.getElementById('installment-count');
        this.totalFinanceDisplay = document.getElementById('total-finance');
        this.monthlyDisplay = document.getElementById('monthly-payment');
        this.chips = document.querySelectorAll('.chip');
        this.confirmBtn = document.querySelector('.btn-confirm');
        
        // Buscamos el elemento donde se muestra la tasa de interés (el primer row-value)
        this.rateDisplay = document.querySelector('.summary-rows .summary-row:first-child .row-value');
    },

    bindEvents() {
        // Amount Input
        this.amountInput.addEventListener('input', (e) => {
            this.amount = parseFloat(e.target.value) || 0;
            this.calculate();
        });

        // Range Slider
        this.rangeInput.addEventListener('input', (e) => {
            this.installments = parseInt(e.target.value);
            this.syncChips();
            this.calculate();
        });

        // Quick Chips
        this.chips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.installments = parseInt(chip.dataset.val);
                this.rangeInput.value = this.installments;
                this.syncChips();
                this.calculate();
            });
        });

        // Botón de Confirmar (Solo simulación visual)
        this.confirmBtn.addEventListener('click', () => {
            if (this.amount <= 0) {
                alert("⚠️ Ingresa un monto válido para simular la compra.");
                return;
            }

            const comercio = this.conceptInput.value || "Compra Comercial";
            
            this.confirmBtn.innerHTML = `<span class="material-symbols-outlined">hourglass_top</span> Procesando...`;
            this.confirmBtn.disabled = true;

            setTimeout(() => {
                alert(`✅ Simulación Exitosa:\n\nComercio: ${comercio}\nMonto: $${this.amount}\nCuotas: ${this.installments}\n\nNota: Al ser un simulador, tu saldo real no ha sido afectado.`);
                
                // Restaurar botón y limpiar
                this.confirmBtn.innerHTML = `Confirmar Compra <span class="material-symbols-outlined">arrow_forward</span>`;
                this.confirmBtn.disabled = false;
                this.amountInput.value = '';
                this.conceptInput.value = '';
                this.amount = 0;
                this.calculate();
            }, 1000);
        });
    },

    syncChips() {
        this.chips.forEach(chip => {
            const val = parseInt(chip.dataset.val);
            chip.classList.toggle('active', val === this.installments);
        });
    },

    getTasaPorCuotas(n) {
        if (n <= 2) return 0;
        if (n <= 6) return 0.019;
        return 0.023;
    },

    calculate() {
        const capital = this.amount;
        const n = this.installments;
        const tasa = this.getTasaPorCuotas(n);
        
        let cuotaMensual = 0;
        let totalPagar = 0;

        if (capital > 0) {
            if (tasa === 0) {
                // ≤ 2 cuotas: sin interés
                cuotaMensual = capital / n;
                totalPagar = capital;
            } else {
                // Ecuación de Amortización
                const dividendo = capital * tasa;
                const divisor = 1 - Math.pow(1 + tasa, -n);
                
                cuotaMensual = dividendo / divisor;
                totalPagar = cuotaMensual * n;
            }
        }

        this.updateUI(totalPagar, cuotaMensual, tasa);
    },

    updateUI(total = 0, monthly = 0, tasa = 0) {
        // Actualizar contador de cuotas
        this.countDisplay.textContent = this.installments;
        
        // Actualizar Tasa de Interés en pantalla según regla de negocio
        if (this.rateDisplay) {
            this.rateDisplay.textContent = `${(tasa * 100).toFixed(1)}%`;
        }
        
        // Formatear Dinero
        this.totalFinanceDisplay.textContent = `$${total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        this.monthlyDisplay.textContent = `$${monthly.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
};

// Start the simulator
document.addEventListener('DOMContentLoaded', () => simulator.init());