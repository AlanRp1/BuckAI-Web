// BUCKAI HOTFIX v1.0
// Este script deve rodar ANTES de script.js para evitar o crash de 'null reference'.

(function() {
    console.log("%c [BuckAI Hotfix] Prevenindo crash do script.js original... ", "color: #ff4444; font-weight: bold;");
    
    // O script original tenta acessar verifySubBtn sem verificar se ele existe.
    // Como ele não existe no HTML, o script crasha.
    // Criamos um elemento dummy no body para que o script.js o encontre e não crashe.
    
    const fixCrash = () => {
        if (!document.getElementById('verifySubBtn')) {
            const dummy = document.createElement('button');
            dummy.id = 'verifySubBtn';
            dummy.style.display = 'none';
            document.body.appendChild(dummy);
            console.log("[BuckAI Hotfix] Elemento 'verifySubBtn' injetado para evitar crash.");
        }
    };

    if (document.body) {
        fixCrash();
    } else {
        document.addEventListener('DOMContentLoaded', fixCrash);
    }
})();
