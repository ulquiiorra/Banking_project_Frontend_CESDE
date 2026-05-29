const renderFooter = () => {
    const footerHTML = `
        <footer class="main-footer">
            <div class="container footer-content">
                <div class="footer-brand">
                    <p>© 2024 Hapibank. Digital Alchemy.</p>
                </div>
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                    <a href="#">Security</a>
                </div>
            </div>
        </footer>
    `;

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = footerHTML;
    } else {
        console.error("Error: Could not find <div id='footer-placeholder'></div>");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderFooter();
});