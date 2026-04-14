/**
 * Hapibank Dashboard - Senior Implementation
 * Conexión de datos y animaciones UI
 */

document.addEventListener('DOMContentLoaded', () => {
    syncUserData();
    initChartAnimation();
    initInteractiveElements();
});

/**
 * 1. Sincronización de Datos (El Puente)
 * Recupera el nombre y el producto del localStorage
 */
/**
 * 1. Sincronización de Datos (El Puente)
 * Recupera el nombre y el producto del localStorage
 */
function syncUserData() {
    const savedData = localStorage.getItem('alchemist_user');
    
    if (savedData) {
        try {
            const user = JSON.parse(savedData);
            
            // Sincronizar nombre de bienvenida
            const nameDisplay = document.getElementById('user-display-name');
            
            if (nameDisplay) {
                // Lógica de prioridad: Nombre Completo > Nombre Usuario > Invitado
                // Usamos 'nombreCompleto' porque así lo definimos en la clase Clientes
                let displayName = user.nombreCompleto || user.nombreUsuario || "Alquimista";
                
                // Extraemos solo el primer nombre si es el nombre completo
                nameDisplay.textContent = displayName.split(' ')[0]; 
            }

            // Sincronizar tarjeta dinámica de producto
            // Usamos 'productoInicial' que es la propiedad de nuestra clase
            const userProduct = user.productoInicial || user.product; 

            if (userProduct) {
                const productBadge = document.getElementById('dynamic-badge');
                const productName = document.getElementById('dynamic-product-name');
                const productIcon = document.getElementById('dynamic-icon');
                const productBalance = document.getElementById('dynamic-balance');

                // Verificamos que los elementos existan antes de asignar
                if (productBadge) productBadge.textContent = obtenerNombreVisual(userProduct);
                if (productName) productName.textContent = `Tu ${obtenerNombreVisual(userProduct)}`;
                
                // Lógica de iconos y balances ficticios según producto
                if (productIcon && productBalance) {
                    const normalizedProduct = userProduct.toLowerCase();
                    
                    if (normalizedProduct.includes('credito') || normalizedProduct.includes('crédito')) {
                        productIcon.textContent = 'credit_card';
                        productBalance.textContent = '$2,500.00';
                    } else if (normalizedProduct.includes('corriente')) {
                        productIcon.textContent = 'account_balance';
                        productBalance.textContent = '$8,920.44';
                    } else {
                        // Por defecto: Ahorros
                        productIcon.textContent = 'savings';
                        productBalance.textContent = '$12,450.00';
                    }
                }
            }
        } catch (e) {
            console.error("Error al sincronizar datos del usuario:", e);
        }
    }
}

// Función auxiliar para que los nombres se vean bonitos
function obtenerNombreVisual(value) {
    const nombres = {
        'ahorros': 'Cuenta de Ahorros',
        'corriente': 'Cuenta Corriente',
        'credito': 'Tarjeta de Crédito'
    };
    return nombres[value] || value; // Si no está en el mapa, usa el valor original
}

/**
 * 2. Animación del Vortex Chart
 */
function initChartAnimation() {
    const ring = document.querySelector('.vortex-ring');
    if (!ring) return;

    // Animamos el valor de 0 a 302 grados (84%)
    let currentDeg = 0;
    const targetDeg = 302;
    
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
 * 3. Feedback Táctil y Efectos UI
 */
function initInteractiveElements() {
    // Hover dinámico en tarjetas
    const cards = document.querySelectorAll('.vibrant-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'rgba(179, 254, 0, 0.4)';
            card.style.transform = 'translateY(-4px)';
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'rgba(179, 254, 0, 0.1)';
            card.style.transform = 'translateY(0)';
        });
    });

    // Mobile Nav Active State
    const navItems = document.querySelectorAll('.m-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}