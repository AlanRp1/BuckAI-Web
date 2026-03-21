// BUCKAI PRE-LOAD v1.0
// Este script intercepta o sistema ANTES do script.js original rodar.
// OBJETIVO: Garantir que o Reset V3 e as correções de ID funcionem no primeiro carregamento.

(function() {
    console.log("%c [BuckAI Pre-Load] Preparando motor evolutivo... ", "background: #7c3aed; color: white; font-weight: bold;");

    const V3_KEY = 'buckai_user_data_v3';
    
    // 1. Interceptar localStorage IMEDIATAMENTE
    const originalGet = localStorage.getItem;
    const originalSet = localStorage.setItem;

    localStorage.getItem = function(key) {
        if (key === 'buckai_user_data') {
            const data = originalGet.apply(this, [V3_KEY]);
            if (data) return data;
            // Se não tiver dado V3, mas tiver dado antigo, vamos migrar uma última vez
            const oldData = originalGet.apply(this, ['buckai_user_data']);
            if (oldData) {
                console.log("[Pre-Load] Migrando dados para V3...");
                localStorage.setItem(V3_KEY, oldData);
                return oldData;
            }
            return null;
        }
        return originalGet.apply(this, arguments);
    };

    localStorage.setItem = function(key, value) {
        if (key === 'buckai_user_data') {
            return originalSet.apply(this, [V3_KEY, value]);
        }
        return originalSet.apply(this, arguments);
    };

    // 2. Prevenir Crash do verifySubBtn
    const fixCrash = () => {
        if (!document.getElementById('verifySubBtn')) {
            const dummy = document.createElement('button');
            dummy.id = 'verifySubBtn';
            dummy.style.display = 'none';
            document.body.appendChild(dummy);
        }
    };

    if (document.body) fixCrash();
    else document.addEventListener('DOMContentLoaded', fixCrash);

    // 3. Forçar IDs iniciais se o usuário estiver logado
    window.addEventListener('load', () => {
        const dataStr = localStorage.getItem('buckai_user_data');
        if (dataStr) {
            const data = JSON.parse(dataStr);
            if (data.username) {
                const bar = document.getElementById('userInfo');
                if (bar) bar.classList.remove('hidden');
            }
        }
    });
})();
