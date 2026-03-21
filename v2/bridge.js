// --- BUCKAI BRIDGE v1.0 ---
// Este arquivo é o único ponto de integração permitido.
// Ele carrega novos módulos sem modificar o script.js original.

(function() {
    console.log("%c [BuckAI Bridge] Inicializando nova camada de evolução... ", "background: #7c3aed; color: white; font-weight: bold;");

    const loadModule = (src) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'module';
        document.head.appendChild(script);
    };

    // Lista de novos módulos evoluídos
    const modules = [
        'v2/hotfix.js', // Hotfix deve carregar primeiro para prevenir crash
        'v2/humanizer-v2.js',
        'v2/support-v2.js',
        'v2/admin-v2.js',
        'v2/user-id-fix.js',
        'v2/ui-features.js',
        'v2/user-system-v3.js', // Reset de contas V3
        'v2/stats-fix.js',      // Correção de Clientes ON e Aleatoriedade
        'v2/pro-ux.js'          // Interface Premium e UX Profissional
    ];

    // Carregar Estilos Evoluídos
    const loadStyle = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };
    loadStyle('v2/style-v2.css');

    modules.forEach(m => loadModule(m));
})();
