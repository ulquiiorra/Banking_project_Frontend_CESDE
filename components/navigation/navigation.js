const getUserFromStorage = () => {
    try {
        const data = localStorage.getItem('usuarioLogueado');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const renderNavbar = () => {
    const user = getUserFromStorage();

    const desktopAuth = user
        ? `
            <div class="user-menu-wrapper" id="user-menu-wrapper">
                <button class="user-menu-trigger" id="user-menu-trigger">
                    <span class="material-symbols-outlined user-icon">account_circle</span>
                    <span class="user-name">${user.nombreCompleto}</span>
                    <span class="material-symbols-outlined chevron-icon">expand_more</span>
                </button>
                <div class="user-dropdown" id="user-dropdown">
                    <a href="/Pages/dashboard/dashboard.html" class="dropdown-item">
                        <span class="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </a>
                    <a href="/Pages/editarProfile/editarProfile.html" class="dropdown-item">
                        <span class="material-symbols-outlined">manage_accounts</span>
                        Editar Perfil
                    </a>
                    <a href="/Pages/simulador/simulador.html" class="dropdown-item">
                        <span class="material-symbols-outlined">calculate</span>
                        Simulador
                    </a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item dropdown-logout" id="btn-logout-desktop">
                        <span class="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
          `
        : `
            <a href="/Pages/login/login.html" class="btn-primary-small">Login</a>
            <a href="/Pages/registro/registro.html" class="btn-primary-small">Open Account</a>
          `;

    const mobileMenu = user
        ? `
            <div class="nav-links">
                <a href="/">Inicio</a>
                <a href="/Pages/nuestrosProductos/nuestroProducto.html">Productos</a>
                <a href="/Pages/nosotros/nosotros.html">Nosotros</a>
                <a href="/Pages/contacto/contacto.html">Contactanos</a>
            </div>
            <div class="mobile-user-section">
                <div class="mobile-user-header">
                    <span class="material-symbols-outlined user-icon">account_circle</span>
                    <span class="user-name">${user.nombreCompleto}</span>
                </div>
                <a href="/Pages/dashboard/dashboard.html" class="mobile-user-link">
                    <span class="material-symbols-outlined">dashboard</span> Dashboard
                </a>
                <a href="/Pages/editarProfile/editarProfile.html" class="mobile-user-link">
                    <span class="material-symbols-outlined">manage_accounts</span> Editar Perfil
                </a>
                <a href="/Pages/simulador/simulador.html" class="mobile-user-link">
                    <span class="material-symbols-outlined">calculate</span> Simulador
                </a>
                <button class="mobile-user-link mobile-logout" id="btn-logout-mobile">
                    <span class="material-symbols-outlined">logout</span> Cerrar Sesión
                </button>
            </div>
          `
        : `
            <div class="nav-links">
                <a href="/">Inicio</a>
                <a href="/Pages/nuestrosProductos/nuestroProducto.html">Productos</a>
                <a href="/Pages/nosotros/nosotros.html">Nosotros</a>
                <a href="/Pages/contacto/contacto.html">Contactanos</a>
            </div>
            <div class="nav-actions">
                <a href="/Pages/login/login.html" class="btn-primary-small">Login</a>
                <a href="/Pages/registro/registro.html" class="btn-primary-small">Open Account</a>
            </div>
          `;

    const navHTML = `
      <header class="top-app-bar">
        <nav class="nav-container">

          <div class="logo">
            <img src="/img/logoD.png" alt="logo_bank" id="logo_hapiBank">
          </div>

          <div class="hamburger" id="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>

          <!-- Mobile only: collapses on hamburger -->
          <div class="nav-menu" id="nav-menu">
            ${mobileMenu}
          </div>

          <!-- Desktop only: always visible on the right -->
          <div class="desktop-auth">
            ${desktopAuth}
          </div>

        </nav>
      </header>
    `;

    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navHTML;
    } else {
        console.error("Error: Could not find <div id='nav-placeholder'></div> in your HTML!");
    }
};

const initDropdown = () => {
    const trigger = document.getElementById('user-menu-trigger');
    const dropdown = document.getElementById('user-dropdown');
    const wrapper = document.getElementById('user-menu-wrapper');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('dropdown-open');
        trigger.querySelector('.chevron-icon').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    document.addEventListener('click', (e) => {
        if (wrapper && !wrapper.contains(e.target)) {
            dropdown.classList.remove('dropdown-open');
            trigger.querySelector('.chevron-icon').style.transform = 'rotate(0deg)';
        }
    });
};

const initLogout = () => {
    const handleLogout = () => {
        localStorage.removeItem('usuarioLogueado');
        window.location.href = '/';
    };

    const btnDesktop = document.getElementById('btn-logout-desktop');
    const btnMobile = document.getElementById('btn-logout-mobile');

    if (btnDesktop) btnDesktop.addEventListener('click', handleLogout);
    if (btnMobile) btnMobile.addEventListener('click', handleLogout);
};

const initMobileMenu = () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) {
        console.error("Error: Hamburger or Nav Menu IDs not found!");
        return;
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('toggle-active');
        navMenu.classList.toggle('menu-active');
    });

    document.querySelectorAll('.nav-links a, .nav-actions a, .mobile-user-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('toggle-active');
            navMenu.classList.remove('menu-active');
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initMobileMenu();
    initDropdown();
    initLogout();
});