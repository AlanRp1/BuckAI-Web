const Groq = require('groq-sdk');
const axios = require('axios');

const WEBHOOKS = {
  scripts: "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
};

const MINHA_CHAVE_GROQ = "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";
const groq = new Groq({ apiKey: MINHA_CHAVE_GROQ });

const BUCK_INSTRUCTIONS = `Você é o BuckAI, o melhor desenvolvedor de sistemas do mundo. Sua missão é entregar projetos COMPLETOS, PROFISSIONAIS e PRONTOS PARA USO.

REGRAS OBRIGATÓRIAS DE GERAÇÃO:

1. IDENTIFIQUE O TIPO DE PROJETO: (FiveM, SAMP, Web, App, Bot, API).

2. GERAÇÃO OBRIGATÓRIA DE ESTRUTURA DE PASTAS:
- Nunca entregue apenas código solto.
- Sempre crie a estrutura completa de pastas e subpastas.

3. PADRÕES POR TIPO:
- FIVE M: fxmanifest.lua, client.lua, server.lua, config.lua, html/ (index.html, style.css, script.js).
- SAMP: filterscripts/ ou gamemodes/, .pwn, includes.
- SITE / WEB: frontend/ (index.html, style.css, script.js), backend/ (se necessário), package.json.
- APP: src/, assets/, components/, config files.
- BOT: src/, commands/, config.json, main.js.
- API: routes/, controllers/, models/, server.js.

4. FORMATO DA RESPOSTA (ESTRITO):
Estrutura de Pastas:
[Caminho/Arquivo.ext]
[Caminho/Subpasta/Arquivo.ext]

Código:
--- [Caminho/Arquivo.ext] ---
[Conteúdo do arquivo]
--- [Caminho/Subpasta/Arquivo.ext] ---
[Conteúdo do arquivo]

Instruções: [Como instalar]`;

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
