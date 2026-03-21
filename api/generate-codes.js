const https = require('https');

const WEBHOOK_CODES = "https://discord.com/api/webhooks/1484798584158163044/cfk2askZLMhxXHS4j4pF5aXzwDGjYu4-ZFKb5SeMZTIrt9EofETV9uuJqvXLJIfhjlAH";

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret, count = 5 } = req.body;

  if (secret !== "BUCK-ADMIN-SECRET-2026") {
    return res.status(403).json({ error: 'Não autorizado' });
  }

  const codes = [];
  for (let i = 0; i < count; i++) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString(36).substring(4).toUpperCase();
    codes.push(`BUCK-PREMIUM-${randomPart}-${timestampPart}`);
  }

  const payload = JSON.stringify({
    embeds: [{
      title: "🔑 NOVOS CÓDIGOS PREMIUM GERADOS",
      description: "Estes códigos são de uso único. Mande para os clientes que pagarem!",
      color: 0x7c3aed,
      fields: codes.map((code, index) => ({
        name: `Código ${index + 1}`,
        value: `\`${code}\``,
        inline: false
      })),
      timestamp: new Date()
    }]
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const request = https.request(WEBHOOK_CODES, options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        resolve(res.status(200).json({ success: true, message: `${count} códigos enviados ao Discord!` }));
      });
    });

    request.on('error', (error) => {
      console.error('Erro Webhook:', error);
      resolve(res.status(500).json({ error: 'Erro ao enviar para o Discord' }));
    });

    request.write(payload);
    request.end();
  });
};
