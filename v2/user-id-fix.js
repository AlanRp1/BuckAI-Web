// NOVO MÓDULO DE CORREÇÃO DE USER ID E SETTINGS
// OBJETIVO: Resolver bugs no ID e nas configurações sem tocar no script.js original.

export const UserSystemV2 = {
    async updateUserIdDisplay() {
        const userData = JSON.parse(localStorage.getItem('buckai_user_data')) || {};
        const userIdDisplay = document.getElementById('userIdDisplay');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (userIdDisplay && userData.id) {
            userIdDisplay.textContent = userData.id;
            console.log(`[UserSystemV2] ID Atualizado: ${userData.id}`);
        }

        if (userNameDisplay && userData.username) {
            userNameDisplay.textContent = userData.username.toUpperCase();
        }
    }
};

// Reinjetar configurações e ID sem tocar no código original
document.addEventListener('DOMContentLoaded', () => {
    // Evoluir botão de configurações (engrenagem)
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        const newSettingsBtn = settingsBtn.cloneNode(true);
        settingsBtn.parentNode.replaceChild(newSettingsBtn, settingsBtn);
        
        newSettingsBtn.addEventListener('click', () => {
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                settingsModal.classList.remove('hidden');
                UserSystemV2.updateUserIdDisplay();
            }
        });
    }

    // Inicializar o ID ao carregar a página
    setTimeout(() => UserSystemV2.updateUserIdDisplay(), 500);
});
