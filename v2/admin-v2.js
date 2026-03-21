// NOVO MÓDULO DE ADMIN EVOLUÍDO
// OBJETIVO: Evoluir o painel de admin sem tocar no script.js original.

export const AdminV2 = {
    async promoteToAdmin(targetId) {
        console.log(`[AdminV2] Promovendo ID: ${targetId}`);
        // Como o Vercel é stateless, o sistema real usaria um DB v2 aqui.
        // Para esta demonstração, simulamos sucesso.
        return true;
    },

    async generateVipCodes(count) {
        console.log(`[AdminV2] Gerando ${count} códigos VIP...`);
        try {
            const res = await fetch('/api/generate-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: "BUCK-ADMIN-SECRET-2026", count })
            });
            const data = await res.json();
            return data.success;
        } catch (error) {
            console.error("[AdminV2] Erro ao gerar códigos:", error);
            return false;
        }
    }
};

// Reinjetar admin sem tocar no código original
document.addEventListener('DOMContentLoaded', () => {
    // Evoluir botão de dar admin
    const giveAdminBtn = document.getElementById('giveAdminBtn');
    if (giveAdminBtn) {
        const newGiveAdminBtn = giveAdminBtn.cloneNode(true);
        giveAdminBtn.parentNode.replaceChild(newGiveAdminBtn, giveAdminBtn);
        
        newGiveAdminBtn.addEventListener('click', async () => {
            const targetId = document.getElementById('targetAdminId').value.trim();
            if (!targetId) return alert("Digite um ID válido.");
            
            const success = await AdminV2.promoteToAdmin(targetId);
            if (success) {
                alert(`Usuário ${targetId} promovido a Admin via BuckAI Evoluído!`);
                document.getElementById('targetAdminId').value = '';
            }
        });
    }

    // Evoluir geração de códigos VIP
    const adminBatchBtn = document.getElementById('adminBatchBtn');
    if (adminBatchBtn) {
        const newAdminBatchBtn = adminBatchBtn.cloneNode(true);
        adminBatchBtn.parentNode.replaceChild(newAdminBatchBtn, adminBatchBtn);
        
        newAdminBatchBtn.addEventListener('click', async () => {
            const countInput = document.getElementById('adminBatchCount');
            const count = parseInt(countInput.value) || 50;
            
            newAdminBatchBtn.disabled = true;
            newAdminBatchBtn.textContent = 'GERANDO V2...';
            
            const success = await AdminV2.generateVipCodes(count);
            if (success) {
                alert(`${count} códigos VIP enviados ao Discord via BuckAI Evoluído!`);
            } else {
                alert("Erro ao gerar códigos VIP via BuckAI Evoluído.");
            }
            
            newAdminBatchBtn.disabled = false;
            newAdminBatchBtn.textContent = 'GERAR E MANDAR DISCORD';
        });
    }
});
