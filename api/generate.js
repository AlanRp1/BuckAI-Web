const Groq = require('groq-sdk');
const https = require('https');

const WEBHOOKS = {
  scripts: "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
};

const MINHA_CHAVE_GROQ = "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";
const groq = new Groq({ apiKey: MINHA_CHAVE_GROQ });

const BUCK_INSTRUCTIONS = `Você é o BuckAI, o desenvolvedor #1 de scripts FiveM.
Sua missão é entregar o código SEMPRE no formato de blocos para que o sistema crie as pastas.

REGRA DE OURO: Use EXATAMENTE este marcador para cada arquivo:
--- [nome_do_arquivo] ---
[conteúdo]

IMPORTANTE: Não inclua o nome da pasta do script no caminho. Use apenas o nome do arquivo.
Exemplo Correto: --- client.lua ---
Exemplo Errado: --- meu_script/client.lua ---

OBRIGATÓRIO PARA FIVEM:
--- fxmanifest.lua ---
--- client.lua ---
--- server.lua ---
--- config.lua ---

SE TIVER NUI (INTERFACE):
--- html/index.html ---
--- html/style.css ---
--- html/script.js ---

Nunca responda com texto livre no meio do código. Use apenas os blocos de arquivos.`;

async function sendLog(type, embed) {
  const url = WEBHOOKS[type];
  if (!url) return;
  
  const payload = JSON.stringify({ embeds: [embed] });
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', (e) => {
      console.error(`Erro ao enviar log ${type}:`, e.message);
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

  const { description, platform, base64Image, userAgent, ip } = req.body;

  let prompt = `${BUCK_INSTRUCTIONS}\n\nGere um script completo e funcional baseado na seguinte descrição: "${description}". \nPlataforma: ${platform}.`;

  if (base64Image) {
    prompt += `\nIMPORTANTE: Analise a imagem em anexo para identificar o erro e garantir que o script gerado não tenha esse problema.`;
  }

  if (platform === 'FiveM') {
    prompt += `\nRetorne obrigatoriamente: client.lua, server.lua e config.lua.`;
  } else if (platform === 'SA-MP') {
    prompt += `\nRetorne um arquivo .pwn completo e pronto para compilar.`;
  }

  try {
    const messages = [
      { role: "system", content: "Você é o BuckAI, o melhor desenvolvedor de scripts para FiveM (Lua) e SA-MP (Pawn). Gere apenas código limpo, otimizado e funcional. Se houver uma imagem, analise o erro nela e corrija o código baseado nisso." },
    ];

    if (base64Image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      });
    } else {
      messages.push({ role: "user", content: prompt });
    }

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: base64Image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 4096,
    });

    const result = completion.choices[0]?.message?.content || "";

    // Log no Discord
    await sendLog('scripts', {
      title: "📜 Novo Script Gerado (Web)",
      color: 0x7c3aed,
      fields: [
        { name: "🌐 IP", value: ip || "Desconhecido", inline: true },
        { name: "🎮 Plataforma", value: platform, inline: true },
        { name: "📝 Descrição", value: description?.substring(0, 1024) || "Imagem enviada" }
      ],
      timestamp: new Date()
    });

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Erro Groq API:', error);
    return res.status(500).json({ error: 'Erro na IA Groq: ' + error.message });
  }
};
