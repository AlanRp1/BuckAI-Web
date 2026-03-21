const axios = require('axios');

const WEBHOOK_CODES = "https://discord.api/webhooks/1484798584158163044/cfk2askZLMhxXHS4j4pF5aXzwDGjYu4-ZFKb5SeMZTIrt9EofETV9uuJqvXLJIfhjlAH";

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret, count = 5 } = req.body;

  // Segurança simples para evitar que qualquer um gere códigos via API
  if (secret !== "BUCK-ADMIN-SECRET-2026") {
    return res.status(403).json({ error: 'Não autorizado' });
  }

  const codes = [];
  for (let i = 0; i < count; i++) {
    // Gerar um código aleatório robusto
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = Date.now().toString(36).substring(4).toUpperCase();
    codes.push(`BUCK-PREMIUM-${randomPart}-${timestampPart}`);
  }

  try {
    // Enviar para o Webhook do Discord
    await axios.post(WEBHOOK_CODES, {
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

    return res.status(200).json({ success: true, message: `${count} códigos enviados ao Discord!` });
  } catch (error) {
    console.error('Erro ao enviar códigos para o Discord:', error);
    return res.status(500).json({ error: 'Erro ao enviar códigos para o Discord' });
  }
};
