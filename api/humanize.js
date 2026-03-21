const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require('https');

const WEBHOOKS = {
  humanizer: "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
};

const KEYS = {
  GROQ: "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",
  GEMINI: process.env.GEMINI_API_KEY || ""
};

const groq = new Groq({ apiKey: KEYS.GROQ });

const HUMANIZER_INSTRUCTIONS = `Você é o BuckAI, especialista em reescrita e humanização de textos. 
Sua função é transformar qualquer texto em uma versão mais natural, fluida e humana, evitando aparência robótica ou artificial.
Você deve garantir um resultado 100% orgânico, pronto para passar em detectores de IA.

REGRAS:
- Use linguagem simples e natural.
- Evite frases formais demais.
- Torne o texto mais envolvente.
- Mantenha o sentido original.
- Adapte o tom conforme o contexto solicitado.
- Não use emojis, a menos que seja pedido.
- Não explique o que você fez, apenas entregue o texto reescrito.`;

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

async function tryGemini(prompt) {
  if (!KEYS.GEMINI) return null;
  try {
    const genAI = new GoogleGenerativeAI(KEYS.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, tone, ip } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto é obrigatório' });
  }

  const prompt = `${HUMANIZER_INSTRUCTIONS}\n\nMODO DE HUMANIZAÇÃO: ${tone}\n\nTEXTO PARA REESCREVER:\n"${text}"`;

  let finalResult = "";
  let usedAI = "Groq (Llama 3.3)";

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é o BuckAI, especialista em humanização de textos. Entregue apenas o texto reescrito de forma natural." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    finalResult = completion.choices[0]?.message?.content || "";
    if (!finalResult) throw new Error("Vazio");

  } catch (error) {
    const geminiRes = await tryGemini(prompt);
    if (geminiRes) {
      finalResult = geminiRes;
      usedAI = "Gemini (Fallback)";
    } else {
      return res.status(500).json({ error: 'Erro ao humanizar texto.' });
    }
  }

  // Log no Discord
  await sendLog('humanizer', {
    title: `✍️ Novo Texto Humanizado (${usedAI})`,
    color: 0x10b981,
    fields: [
      { name: "🌐 IP", value: ip || "Desconhecido", inline: true },
      { name: "🎭 Tom", value: tone, inline: true },
      { name: "📝 Texto Original", value: text.substring(0, 1024) }
    ],
    timestamp: new Date()
  });

  return res.status(200).json({ result: finalResult });
};
