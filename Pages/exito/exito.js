document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('alchemist_user');

    if (savedData) {
        try {
            const user = JSON.parse(savedData);

            const userEl = document.getElementById('user-display-name');
            const productEl = document.getElementById('user-display-product');
            
            // Inyectamos los datos
            if (userEl) userEl.textContent = user.username;
            if (productEl) productEl.textContent = obtenerNombreVisual(user.productoInicial);

            console.log("✅ Interfaz actualizada con:", user);
        } catch (e) {
            console.error("❌ Error al procesar los datos", e);
        }
    } else {
        console.error("⚠️ No hay datos guardados.");
        // alert("No se encontraron datos de registro.");
    }
});

function obtenerNombreVisual(value) {
    const nombres = {
        'ahorros': 'Cuenta de Ahorros',
        'corriente': 'Cuenta Corriente',
        'credito': 'Tarjeta de Crédito'
    };
    return nombres[value] || 'Producto Digital';
}