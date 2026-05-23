// Get the base path dynamically so it works on both local file system and servers
let rootPath = '';
const scripts = document.getElementsByTagName('script');
for (let script of scripts) {
  if (script.src.includes('navbar.js')) {
    rootPath = script.src.split('components/navbar.js')[0];
    break;
  }
}
if (!rootPath) rootPath = '/';

class GlobalNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="top-app-bar">
        <nav class="nav-container">
          <div class="nav-left">
            <div class="logo">
              <a href="${rootPath}index.html">
                <img src="${rootPath}img/logoD.png" alt="logo_bank" id="logo_hapiBank" style="max-height: 40px;">
              </a>
            </div>
            <div class="nav-links">
              <a href="${rootPath}index.html" class="active">Inicio</a>
              <a href="${rootPath}Pages/nuestrosProductos/nuestroProducto.html">Productos</a>
              <a href="${rootPath}Pages/nosotros/nosotros.html">Nosotros</a>
              <a href="${rootPath}Pages/contacto/contacto.html">Contactanos</a>
            </div>
          </div>
          <div class="nav-actions">
            <a href="${rootPath}Pages/login/login.html" class="btn-primary-small" style="text-decoration: none; display: inline-block">Login</a>
            <a href="${rootPath}Pages/registro/registro.html" class="btn-primary-small" style="text-decoration: none; display: inline-block">Open Account</a>
          </div>
        </nav>
      </header>
    `;
  }
}

customElements.define('global-navbar', GlobalNavbar);
