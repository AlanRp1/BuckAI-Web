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

  // Discord limit is 25 fields per embed. Let's use 20 to be safe.
  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < codes.length; i += chunkSize) {
    chunks.push(codes.slice(i, i + chunkSize));
  }

  const sendChunk = async (codesChunk, chunkIndex, totalChunks) => {
    const payload = JSON.stringify({
      embeds: [{
        title: `🔑 NOVOS CÓDIGOS PREMIUM GERADOS (${chunkIndex + 1}/${totalChunks})`,
        description: `Lote de ${codesChunk.length} códigos de uso único.`,
        color: 0x7c3aed,
        fields: codesChunk.map((code, index) => ({
          name: `Código ${i * chunkSize + index + 1}`,
          value: `\`${code}\``,
          inline: true
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

    return new Promise((resolve, reject) => {
      const request = https.request(WEBHOOK_CODES, options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => resolve());
      });
      request.on('error', (error) => reject(error));
      request.write(payload);
      request.end();
    });
  };

  try {
    for (let i = 0; i < chunks.length; i++) {
      // Small delay to avoid Discord rate limits
      if (i > 0) await new Promise(r => setTimeout(r, 500));
      
      const codesChunk = chunks[i];
      const payload = JSON.stringify({
        embeds: [{
          title: `🔑 NOVOS CÓDIGOS PREMIUM GERADOS (${i + 1}/${chunks.length})`,
          description: `Estes códigos são de uso único. Mande para os clientes que pagarem!`,
          color: 0x7c3aed,
          fields: codesChunk.map((code, index) => ({
            name: `Código ${(i * chunkSize) + index + 1}`,
            value: `\`${code}\``,
            inline: false
          })),
          footer: { text: `BuckAI v2.1 - Lote Gerado` },
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

      await new Promise((resolve, reject) => {
        const request = https.request(WEBHOOK_CODES, options, (response) => {
          response.on('data', () => {});
          response.on('end', () => resolve());
        });
        request.on('error', (error) => reject(error));
        request.write(payload);
        request.end();
      });
    }

    return res.status(200).json({ success: true, message: `${count} códigos enviados ao Discord em ${chunks.length} mensagens!` });
  } catch (error) {
    console.error('Erro Webhook:', error);
    return res.status(500).json({ error: 'Erro ao enviar para o Discord: ' + error.message });
  }
};
