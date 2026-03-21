// MÓDULO DE UX PROFISSIONAL v2.0
// OBJETIVO: Adicionar feedback visual, animações e efeitos premium sem tocar no script.js

export const ProUX = {
    init() {
        console.log("%c [ProUX] BuckAI Evoluída v2.0 - Interface Premium Ativada ", "background: #7c3aed; color: white; font-weight: bold; padding: 10px; border-radius: 8px;");
        this.addHoverEffects();
        this.addNotificationSystem();
        this.optimizeModals();
        this.improveInputs();
    },

    addHoverEffects() {
        const buttons = document.querySelectorAll('button:not(.nav-btn)');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const audio = new Audio('https://www.soundjay.com/buttons/button-20.mp3');
                audio.volume = 0.05;
                audio.play().catch(() => {}); // Ignora erro se áudio não puder tocar
            });
        });
    },

    addNotificationSystem() {
        // Criar container de notificações se não existir
        if (!document.getElementById('pro-notif-container')) {
            const container = document.createElement('div');
            container.id = 'pro-notif-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; pointer-events: none;';
            document.body.appendChild(container);
        }

        window.showProNotif = (message, type = 'success') => {
            const notif = document.createElement('div');
            notif.style.cssText = `
                background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                margin-bottom: 10px;
                font-family: "Poppins", sans-serif;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(8px);
                transform: translateX(120%);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;
            notif.textContent = message;
            document.getElementById('pro-notif-container').appendChild(notif);

            setTimeout(() => notif.style.transform = 'translateX(0)', 10);
            setTimeout(() => {
                notif.style.transform = 'translateX(120%)';
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        };
    },

    optimizeModals() {
        // Suavizar abertura de modais
        const overlays = document.querySelectorAll('.lock-overlay');
        overlays.forEach(overlay => {
            overlay.style.transition = 'opacity 0.3s ease, backdrop-filter 0.3s ease';
            overlay.style.backdropFilter = 'blur(0px)';
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (!overlay.classList.contains('hidden')) {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                overlay.style.opacity = '1';
                                overlay.style.backdropFilter = 'blur(10px)';
                            }, 10);
                        } else {
                            overlay.style.backdropFilter = 'blur(0px)';
                        }
                    }
                });
            });
            observer.observe(overlay, { attributes: true });
        });
    },

    improveInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transition = 'transform 0.2s ease';
                input.parentElement.style.transform = 'scale(1.01)';
            });
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => ProUX.init(), 1000);
});
