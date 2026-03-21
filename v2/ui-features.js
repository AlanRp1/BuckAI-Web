// NOVO MÓDULO DE EVOLUÇÃO DE UI E VISIBILIDADE
// OBJETIVO: Garantir que o ID, a Engrenagem e o Painel Admin estejam visíveis e funcionando.

export const UIFeaturesV2 = {
    async syncUserData() {
        const data = JSON.parse(localStorage.getItem('buckai_user_data')) || {};
        const userInfoBar = document.getElementById('userInfo');
        const welcomeUser = document.getElementById('welcomeUser');
        const userAvatar = document.getElementById('userAvatar');
        const userCredits = document.getElementById('userCredits');
        const adminPanelBtn = document.getElementById('adminPanelBtn');

        if (!data.username) {
            console.log("[UIFeaturesV2] Usuário não logado. Mantendo UI original.");
            return;
        }

        console.log("[UIFeaturesV2] Sincronizando UI para o usuário:", data.username);

        // Garantir visibilidade da barra de usuário
        if (userInfoBar) {
            userInfoBar.classList.remove('hidden');
            userInfoBar.style.display = 'flex'; // Forçar display
        }

        // Atualizar textos e créditos
        if (welcomeUser) welcomeUser.textContent = `BEM-VINDO, ${data.username.toUpperCase()}`;
        if (userAvatar && data.avatar) userAvatar.src = data.avatar;
        if (userCredits) userCredits.textContent = data.isPremium ? "∞" : (data.credits || 0);

        // Evolução: Adicionar o ID diretamente ao lado do nome na barra principal para fácil visualização
        if (welcomeUser && data.id) {
            if (!document.getElementById('v2-id-badge')) {
                const idBadge = document.createElement('span');
                idBadge.id = 'v2-id-badge';
                idBadge.className = 'id-badge';
                idBadge.style.marginLeft = '10px';
                idBadge.style.fontSize = '0.7rem';
                idBadge.style.padding = '2px 6px';
                idBadge.style.background = 'rgba(124, 58, 237, 0.2)';
                idBadge.style.border = '1px solid var(--accent-neon)';
                idBadge.style.borderRadius = '4px';
                idBadge.textContent = data.id;
                welcomeUser.appendChild(idBadge);
            }
        }

        // Mostrar aba Admin se for Admin (V2 force)
        if (adminPanelBtn && (data.isAdmin || data.username === 'buck__ai')) {
            adminPanelBtn.classList.remove('hidden');
            adminPanelBtn.style.display = 'block';
        }

        // Garantir que a Engrenagem funcione (re-bind caso o clone falhe)
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            // Se o user-id-fix.js já clonou, esse listener será adicionado ao novo
            settingsBtn.addEventListener('click', () => {
                const modal = document.getElementById('settingsModal');
                if (modal) modal.classList.remove('hidden');
                
                // Atualizar ID no modal também
                const modalId = document.getElementById('userIdDisplay');
                if (modalId && data.id) modalId.textContent = data.id;
            });
        }
    }
};

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    // Pequeno delay para garantir que o script.js original já rodou seu updateUI
    setTimeout(() => UIFeaturesV2.syncUserData(), 800);
});
