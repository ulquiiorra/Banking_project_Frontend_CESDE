/**
 * Hapibank Dashboard - Senior Implementation
 * Data connection and UI animations
 */
import { AuthService } from "../../Services/AuthService.js";

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

// Función centralizadora para inicializar el dashboard
function initDashboard() {
  const usuarioLogueado = AuthService.obtenerUsuarioActual();

  if (!usuarioLogueado) {
    console.warn("Acceso denegado. Redirigiendo al inicio... ");
    window.location.href = "../../index.html";
    return;
  }

  syncUserData(usuarioLogueado);
  initChartAnimation();
  initInteractiveElements();
  initProfileMenu();
}

/**
 * 1. Data Synchronization
 */
function syncUserData(user) {
  // Guard Clause: Si no viene un usuario, salimos
  if (!user) return;

  try {
    // 1. Actualizamos los mensajes (Fíjate que ahora usamos user.nombreCompleto)
    updateWelcomeMessages(user);

    // 2. Buscamos el tipo de cuenta en su portafolio (Ej: 'ahorros', 'corriente')

    renderizarTarjetasCuentas(user.cuentas);
  } catch (error) {
    console.error("Error al sincronizar los datos del usuario:", error);
  }
}
function updateWelcomeMessages(user) {
  // 1. Imprimimos en consola para confirmar qué estamos recibiendo
  console.log("Datos del usuario recibidos en el dashboard:", user);

  // 2. Extraemos el nombre usando las propiedades de tu clase Clientes
  const displayName = user.nombreCompleto || user.nombreUsuario || "Alquimista";
  const firstName = displayName.split(" ")[0];

  // 3. Capturamos los elementos del DOM
  const nameDisplay = document.getElementById("user-display-name");
  const dropdownName = document.getElementById("dropdown-user-name"); // Aquí apuntamos a tu <span>

  // 4. Inyectamos el nombre
  if (nameDisplay) nameDisplay.textContent = firstName;
  if (dropdownName) dropdownName.textContent = firstName;
}

/**
 * Renderiza dinámicamente las tarjetas del usuario basándose en su portafolio real
 * @param {Array} cuentas - Arreglo de cuentas del usuario logueado
 */
function renderizarTarjetasCuentas(cuentas) {
  const gridContainer = document.getElementById("accounts-grid-container");
  if (!gridContainer || !cuentas) return;

  gridContainer.innerHTML = ""; // Limpiamos el contenedor
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  cuentas.forEach((cuenta) => {
    // 1. Extracción segura (Soporta JSON crudo o Instancia POO)
    let cuentaPublica = cuenta;
    if (typeof cuenta.deserializarParaJSON === "function") {
      cuentaPublica = cuenta.deserializarParaJSON();
    }

    const tipoSeguro = String(
      cuentaPublica.tipo || cuentaPublica.tipoProducto || "ahorros",
    ).toLowerCase();
    const saldoSeguro = parseFloat(cuentaPublica.saldo) || 0;
    const numeroStr = String(
      cuentaPublica.numeroCuenta || cuentaPublica.numero || "0000",
    ).slice(-4);

    // 2. Generación de HTML según el tipo
    if (tipoSeguro.includes("corriente")) {
      gridContainer.innerHTML += `
                <div class="vibrant-card primary">
                  <div class="vortex-orb"></div>
                  <div class="card-header">
                    <div class="card-icon-wrapper"><span class="material-symbols-outlined">account_balance_wallet</span></div>
                    <span class="badge">Corriente</span>
                  </div>
                  <div class="card-content">
                    <h2 class="label-sm">Cuenta Corriente ****${numeroStr}</h2>
                    <p class="balance-display">${formatter.format(saldoSeguro)}</p>
                  </div>
                  <a href="../detalleProducto/detalleProducto.html?state=CORRIENTE" class="btn-card-action">Gestionar</a>
                </div>
            `;
    } else if (tipoSeguro.includes("ahorros")) {
      gridContainer.innerHTML += `
                <div class="vibrant-card secondary">
                  <div class="vortex-orb bottom-left"></div>
                  <div class="card-header">
                    <div class="card-icon-wrapper"><span class="material-symbols-outlined">savings</span></div>
                    <span class="badge">Ahorros</span>
                  </div>
                  <div class="card-content">
                    <h2 class="label-sm">Cuenta de Ahorros ****${numeroStr}</h2>
                    <p class="balance-display secondary-gradient">${formatter.format(saldoSeguro)}</p>
                  </div>
                  <a href="../detalleProducto/detalleProducto.html?state=AHORROS" class="btn-card-action">Gestionar</a>
                </div>
            `;
    } else if (tipoSeguro.includes("credito")) {
      // Matemáticas específicas para la tarjeta
      const cupoAprobado = parseFloat(cuentaPublica.cupoAprobado) || 5000;
      const deudaTotal = saldoSeguro < 0 ? Math.abs(saldoSeguro) : 0;
      const disponible = cupoAprobado - deudaTotal;
      const porcentajeUso = Math.min((deudaTotal / cupoAprobado) * 100, 100);

      gridContainer.innerHTML += `
                <div class="vibrant-card dark-card">
                  <div class="card-header">
                    <div class="card-icon-wrapper outline"><span class="material-symbols-outlined">credit_card</span></div>
                    <span class="badge">Cyber Card</span>
                  </div>
                  <div class="card-content">
                    <h2 class="label-sm">Tarjeta de Crédito ****${numeroStr}</h2>
                    <div class="credit-details">
                      <div class="detail-row">
                        <span>Disponible</span>
                        <span class="val-sec">${formatter.format(disponible)}</span>
                      </div>
                      <div class="progress-bar">
                        <div class="fill" style="width: ${porcentajeUso}%"></div>
                      </div>
                      <div class="detail-row">
                        <span>Límite</span>
                        <span>${formatter.format(cupoAprobado)}</span>
                      </div>
                    </div>
                  </div>
                  <a href="../detalleProducto/detalleProducto.html?state=TARJETA_CREDITO" class="btn-card-action">Gestionar</a>
                </div>
            `;
    }
  });
}

// 🏗️ CAMBIO: Recibe el saldoFormateado como cuarto parámetro
function setProductDetails(
  normalizedProduct,
  iconElement,
  balanceElement,
  saldoFormateado,
) {
  // Inyectamos el saldo dinámico sin importar el tipo de cuenta
  balanceElement.textContent = saldoFormateado;

  // Mantenemos la lógica de los iconos intacta
  if (
    normalizedProduct.includes("credito") ||
    normalizedProduct.includes("crédito")
  ) {
    iconElement.textContent = "credit_card";
  } else if (normalizedProduct.includes("corriente")) {
    iconElement.textContent = "account_balance";
  } else {
    iconElement.textContent = "savings";
  }
}

// Helper function para nombres de presentación
function getVisualName(value) {
  const names = {
    ahorros: "Cuenta de Ahorros",
    corriente: "Cuenta Corriente",
    credito: "Tarjeta de Crédito",
  };
  return names[value] || value;
}

/**
 * 2. Animations (Vortex Chart)
 */
function initChartAnimation() {
  const ring = document.querySelector(".vortex-ring");
  if (!ring) return;

  let currentDeg = 0;
  const targetDeg = 302; // 84%

  const animate = () => {
    if (currentDeg < targetDeg) {
      currentDeg += 2;
      ring.style.background = `conic-gradient(var(--primary) ${currentDeg}deg, var(--surface-highest) 0deg)`;
      requestAnimationFrame(animate);
    }
  };

  animate();
}

/**
 * 3. Tactile Feedback & UI Effects
 */
function initInteractiveElements() {
  // Hover dinámico en tarjetas
  const cards = document.querySelectorAll(".vibrant-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.borderColor = "rgba(179, 254, 0, 0.4)";
      card.style.transform = "translateY(-4px)";
      card.style.transition =
        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.borderColor = "rgba(179, 254, 0, 0.1)";
      card.style.transform = "translateY(0)";
    });
  });

  // Mobile Nav Active State
  const navItems = document.querySelectorAll(".m-nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

/**
 * 4. Profile Menu & Session Management
 */
function initProfileMenu() {
  const profileBtn = document.getElementById("profile-btn");
  const dropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  // Alternar la visibilidad del menú
  if (profileBtn && dropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    // Cerrar el menú si se hace click fuera
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }

  // Lógica de Cierre de Sesión
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");

      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 500);
    });
  }
}
