// NOVO MÓDULO DE RESET DE CONTAS E SISTEMA DE USUÁRIO V3
// OBJETIVO: Resetar todas as contas e evoluir o sistema sem tocar no script.js original.

export const UserSystemV3 = {
    NEW_KEY: 'buckai_user_data_v3', // Nova chave para forçar reset de todos os dados antigos
    
    getUserData() {
        const defaultData = {
            id: 'BUCK-' + Math.floor(Math.random() * 900000 + 100000),
            username: '',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            credits: 5,
            lastReset: new Date().toDateString(),
            history: [],
            isPremium: false,
            isAdmin: false,
            v3: true
        };
        const saved = localStorage.getItem(this.NEW_KEY);
        if (!saved) return defaultData;
        
        const data = JSON.parse(saved);
        return data;
    },

    saveUserData(data) {
        localStorage.setItem(this.NEW_KEY, JSON.stringify(data));
        // Disparar um evento de atualização para que outros módulos saibam
        window.dispatchEvent(new CustomEvent('userUpdateV3', { detail: data }));
    }
};

// Reinjetar lógica de usuário sem tocar no código original
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c [UserSystemV3] Reset de contas V3 ativado. ", "background: #ef4444; color: white; font-weight: bold;");
    
    // Sobrescrever a função getUserData global (se o script.js a expuser)
    // Caso contrário, vamos interceptar o localStorage para forçar o uso da nova chave
    const originalGetItem = localStorage.getItem;
    const originalSetItem = localStorage.setItem;

    localStorage.getItem = function(key) {
        if (key === 'buckai_user_data') return originalGetItem.apply(this, [UserSystemV3.NEW_KEY]);
        return originalGetItem.apply(this, arguments);
    };

    localStorage.setItem = function(key, value) {
        if (key === 'buckai_user_data') return originalSetItem.apply(this, [UserSystemV3.NEW_KEY, value]);
        return originalSetItem.apply(this, arguments);
    };

    // Forçar logout de contas antigas v1/v2 ao carregar a v3 pela primeira vez
    const data = UserSystemV3.getUserData();
    if (!data.v3) {
        localStorage.removeItem('buckai_user_data'); // Limpa a chave antiga para garantir
        location.reload(); // Recarrega para iniciar com a nova chave limpa
    }
});
