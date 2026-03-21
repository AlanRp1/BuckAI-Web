// NOVO MÓDULO DE HUMANIZAÇÃO INDEPENDENTE
// OBJETIVO: Corrigir e evoluir o sistema de humanização sem tocar no script.js

export const HumanizerV2 = {
    async humanize(text, tone) {
        console.log(`[HumanizerV2] Humanizando: "${text.substring(0, 30)}..." em tom ${tone}`);
        
        try {
            const res = await fetch('/api/humanize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, tone, ip: "User-V2" })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Erro desconhecido no servidor" }));
                throw new Error(errorData.error || `Erro HTTP: ${res.status}`);
            }

            const data = await res.json();
            return data.result;
        } catch (error) {
            console.error("[HumanizerV2] Erro:", error);
            throw error;
        }
    },

    typeWriter(text, element, speed = 2) {
        let i = 0;
        element.textContent = '';
        element.style.fontFamily = "'Fira Code', monospace";
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                if (i % 5 === 0) element.parentElement.scrollTop = element.parentElement.scrollHeight;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
};

// Injetar comportamento no botão original via Event Bubbling/Capturing sem modificar script.js
document.addEventListener('DOMContentLoaded', () => {
    const originalBtn = document.getElementById('humanizeBtn');
    if (originalBtn) {
        // Clonar o botão para remover os event listeners originais problemáticos
        const newBtn = originalBtn.cloneNode(true);
        originalBtn.parentNode.replaceChild(newBtn, originalBtn);

        newBtn.addEventListener('click', async () => {
            const text = document.getElementById('humanizeText').value.trim();
            const toneRadios = document.getElementsByName('humanizeTone');
            const tone = Array.from(toneRadios).find(r => r.checked)?.value || 'Casual';

            if (!text) return alert('Cole um texto.');

            const loader = document.getElementById('loader');
            const outputCode = document.getElementById('outputCode');
            const resultArea = document.getElementById('resultArea');

            if (loader) loader.classList.remove('hidden');
            if (resultArea) resultArea.classList.add('hidden');

            try {
                const result = await HumanizerV2.humanize(text, tone);
                if (resultArea) resultArea.classList.remove('hidden');
                
                if (outputCode) {
                    HumanizerV2.typeWriter(result, outputCode);
                    resultArea.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (e) {
                alert("Falha na Humanização V2: " + e.message);
            } finally {
                if (loader) loader.classList.add('hidden');
            }
        });
    }
});
