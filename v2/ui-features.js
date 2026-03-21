// NOVO MÓDULO DE EVOLUÇÃO DE UI E VISIBILIDADE v3.0
// OBJETIVO: Forçar a exibição do ID, Engrenagem e Admin contra o override do script original.

export const UIFeaturesV3 = {
    sync() {
        const dataStr = localStorage.getItem('buckai_user_data');
        if (!dataStr) return;

        const data = JSON.parse(dataStr);
        if (!data.username) return;

        // Elementos Críticos
        const userInfoBar = document.getElementById('userInfo');
        const welcomeUser = document.getElementById('welcomeUser');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        const settingsBtn = document.getElementById('settingsBtn');

        // 1. Forçar a barra a aparecer (Anti-Override)
        if (userInfoBar && userInfoBar.classList.contains('hidden')) {
            console.log("[UIFeaturesV3] Forçando visibilidade da barra de usuário...");
            userInfoBar.classList.remove('hidden');
            userInfoBar.style.display = 'flex';
        }

        // 2. Garantir o ID no topo
        if (welcomeUser) {
            if (!welcomeUser.textContent.includes(data.username.toUpperCase())) {
                welcomeUser.textContent = `BEM-VINDO, ${data.username.toUpperCase()}`;
            }
            if (!document.getElementById('v2-id-badge') && data.id) {
                const idBadge = document.createElement('span');
                idBadge.id = 'v2-id-badge';
                idBadge.className = 'id-badge';
                idBadge.style.marginLeft = '10px';
                idBadge.textContent = data.id;
                welcomeUser.appendChild(idBadge);
            }
        }

        // 3. Forçar Painel Admin
        if (adminPanelBtn && (data.isAdmin || data.username === 'buck__ai')) {
            adminPanelBtn.classList.remove('hidden');
            adminPanelBtn.style.display = 'block';
        }

        // 4. Garantir funcionalidade da Engrenagem
        if (settingsBtn) {
            settingsBtn.style.display = 'block';
            settingsBtn.style.opacity = '1';
            settingsBtn.style.pointerEvents = 'auto';
        }
    }
};

// Rodar em loop agressivo para evitar que o script original oculte as coisas
document.addEventListener('DOMContentLoaded', () => {
    console.log("[UIFeaturesV3] Iniciando loop de visibilidade...");
    
    // Sincronização inicial rápida
    UIFeaturesV3.sync();

    // Loop de proteção (roda a cada 500ms para manter os elementos visíveis)
    setInterval(() => UIFeaturesV3.sync(), 500);
});
