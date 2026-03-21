// NOVO MÓDULO DE SUPORTE E ADMIN INDEPENDENTE
// OBJETIVO: Evoluir suporte e admin sem tocar no script.js original.

export const SupportV2 = {
    async sendMessage(text, userId) {
        console.log(`[SupportV2] Mensagem: "${text.substring(0, 30)}..." para o usuário ${userId}`);
        
        const chatKey = `buckai_chat_v2_${userId}`;
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        
        const newMsg = { role: 'user', text, time: Date.now(), v2: true };
        messages.push(newMsg);
        localStorage.setItem(chatKey, JSON.stringify(messages));
        
        const tickets = JSON.parse(localStorage.getItem('buckai_tickets_v2')) || [];
        const existingIndex = tickets.findIndex(t => t.id === userId);
        if (existingIndex > -1) {
            tickets[existingIndex].lastMsg = text;
            tickets[existingIndex].time = Date.now();
        } else {
            tickets.push({ id: userId, lastMsg: text, time: Date.now() });
        }
        localStorage.setItem('buckai_tickets_v2', JSON.stringify(tickets));

        return true;
    },

    renderChat(container, userId) {
        if (!container) return;
        const chatKey = `buckai_chat_v2_${userId}`;
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        
        container.innerHTML = messages.map(m => `
            <div class="msg-${m.role} v2-style">
                <span class="msg-text">${m.text}</span>
                <span class="msg-time-small">${new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('supportInput');
    const sendSupportBtn = document.getElementById('sendSupportBtn');

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        const userData = JSON.parse(localStorage.getItem('buckai_user_data')) || { id: 'ANON' };
        await SupportV2.sendMessage(text, userData.id);
        
        input.value = '';
        SupportV2.renderChat(document.getElementById('supportMessages'), userData.id);
        
        setTimeout(() => {
            const chatKey = `buckai_chat_v2_${userData.id}`;
            const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
            messages.push({ role: 'admin', text: "O BuckAI Evoluído recebeu sua mensagem. Suporte em breve.", time: Date.now(), v2: true });
            localStorage.setItem(chatKey, JSON.stringify(messages));
            SupportV2.renderChat(document.getElementById('supportMessages'), userData.id);
        }, 1000);
    };

    if (sendSupportBtn) {
        const newBtn = sendSupportBtn.cloneNode(true);
        sendSupportBtn.parentNode.replaceChild(newBtn, sendSupportBtn);
        newBtn.addEventListener('click', handleSend);
    }

    if (input) {
        // Interceptar tecla Enter para evitar que o listener original do script.js seja chamado
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation(); // Evita o listener global do script.js
                handleSend();
            }
        }, true); // UseCapture para garantir que pegamos antes
    }

    const supportModeBtn = document.getElementById('supportModeBtn');
    if (supportModeBtn) {
        supportModeBtn.addEventListener('click', () => {
            const userData = JSON.parse(localStorage.getItem('buckai_user_data')) || { id: 'ANON' };
            setTimeout(() => SupportV2.renderChat(document.getElementById('supportMessages'), userData.id), 100);
        });
    }
});
