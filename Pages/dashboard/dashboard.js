/**
 * Hapibank Dashboard - Senior Implementation
 * Data connection and UI animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

// Función centralizadora para inicializar el dashboard
function initDashboard() {
    syncUserData();
    initChartAnimation();
    initInteractiveElements();
    initProfileMenu();
}

/**
 * 1. Data Synchronization
 */
function syncUserData() {
    const savedData = {  
        usuarioId:localStorage.getItem('usuarioLogueado'),
        userName:localStorage.getItem("Usuario1"),
       

    
    };
    
    // Guard Clause: Si no hay datos, salimos temprano
    if (!savedData) return;

    try {
        const user = savedData;
        
        updateWelcomeMessages(user);
        updateDynamicProductCard(user.productoInicial || user.product);
        
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
}

function updateWelcomeMessages(user) {
    // Lógica de prioridad: Nombre Completo > Nombre Usuario > Invitado
    const displayName =  user. userName || "Alquimista";
    const firstName = displayName.split(' ')[0]; 

    const nameDisplay = document.getElementById('user-display-name');
    const dropdownName = document.getElementById('dropdown-user-name');

    if (nameDisplay) nameDisplay.textContent = firstName;
    if (dropdownName) dropdownName.textContent = firstName;
}

function updateDynamicProductCard(userProduct) {
    if (!userProduct) return;

    const productBadge = document.getElementById('dynamic-badge');
    const productName = document.getElementById('dynamic-product-name');
    const productIcon = document.getElementById('dynamic-icon');
    const productBalance = document.getElementById('dynamic-balance');

    const visualName = getVisualName(userProduct);

    if (productBadge) productBadge.textContent = visualName;
    if (productName) productName.textContent = `Tu ${visualName}`;
    
    if (productIcon && productBalance) {
        setProductDetails(userProduct.toLowerCase(), productIcon, productBalance);
    }
}

function setProductDetails(normalizedProduct, iconElement, balanceElement) {
    if (normalizedProduct.includes('credito') || normalizedProduct.includes('crédito')) {
        iconElement.textContent = 'credit_card';
        balanceElement.textContent = '$2,500.00';
    } else if (normalizedProduct.includes('corriente')) {
        iconElement.textContent = 'account_balance';
        balanceElement.textContent = '$8,920.44';
    } else {
        // Por defecto: Ahorros
        iconElement.textContent = 'savings';
        balanceElement.textContent = '$12,450.00';
    }
}

// Helper function para nombres de presentación
function getVisualName(value) {
    const names = {
        'ahorros': 'Cuenta de Ahorros',
        'corriente': 'Cuenta Corriente',
        'credito': 'Tarjeta de Crédito'
    };
    return names[value] || value;
}

/**
 * 2. Animations (Vortex Chart)
 */
function initChartAnimation() {
    const ring = document.querySelector('.vortex-ring');
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

/**
 * 4. Profile Menu & Session Management
 */
function initProfileMenu() {
    const profileBtn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Alternar la visibilidad del menú
    if (profileBtn && dropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            dropdown.classList.toggle('show');
        });

        // Cerrar el menú si se hace click fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Lógica de Cierre de Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogueado');
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                window.location.href = '../landingPage/landingPage.html'; 
            }, 500);
        });
    }
}