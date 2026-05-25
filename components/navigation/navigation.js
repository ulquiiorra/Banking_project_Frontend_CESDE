const renderNavbar = () => {
    // 1. Define the HTML string
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

          <div class="nav-menu" id="nav-menu">
            <div class="nav-links">
              <a href="/" class="active">Inicio</a>
              <a href="/Pages/nuestrosProductos/nuestroProducto.html">Productos</a>
              <a href="/Pages/nosotros/nosotros.html">Nosotros</a>
              <a href="/Pages/contacto/contacto.html">Contactanos</a>
            </div>
            <div class="nav-actions">
              <a href="/Pages/login/login.html" class="btn-primary-small">Login</a>
              <a href="/Pages/registro/registro.html" class="btn-primary-small">Open Account</a>
            </div>
          </div>
        </nav>
      </header>
    `;

    // 2. Inject it into the page
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navHTML;
    } else {
        console.error("Error: Could not find <div id='nav-placeholder'></div> in your HTML!");
    }
};

const initMobileMenu = () => {
    // 3. Find the injected elements
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // 4. Verify they exist before adding clicks
    if (!hamburger || !navMenu) {
        console.error("Error: Hamburger or Nav Menu IDs not found!");
        return;
    }

    // 5. Add the click event
    hamburger.addEventListener('click', () => {
        console.log("Hamburger clicked!"); // Check your browser console to see if this fires
        hamburger.classList.toggle('toggle-active');
        navMenu.classList.toggle('menu-active');
    });

    // 6. Close menu when a link is clicked
    document.querySelectorAll('.nav-links a, .nav-actions a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('toggle-active');
            navMenu.classList.remove('menu-active');
        });
    });
};

// 7. Run everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initMobileMenu();
});