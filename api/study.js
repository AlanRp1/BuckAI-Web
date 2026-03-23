const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require('https');

const WEBHOOKS = {
  scripts: "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
};

const KEYS = {
  GROQ: process.env.GROQ_API_KEY || "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",
  GEMINI: process.env.GEMINI_API_KEY || ""
};

const groq = new Groq({ apiKey: KEYS.GROQ });

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

async function tryGemini(prompt, base64Image) {
  if (!KEYS.GEMINI) return null;
  try {
    const genAI = new GoogleGenerativeAI(KEYS.GEMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    let result;
    if (base64Image) {
      result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
      ]);
    } else {
      result = await model.generateContent(prompt);
    }
    return result.response.text();
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task, base64Image, ip } = req.body;

  const prompt = `Você é o BuckAI Professor, um especialista em educação e matérias escolares. 
  Você deve trazer respostas 100% corretas, detalhadas e sem erros.
  Analise o pedido abaixo e, se houver uma imagem, resolva os exercícios nela.
  Forneça respostas detalhadas, cálculos passo a passo e explicações claras.
  
  Pedido do Estudante: "${task}"`;

  let finalResult = "";
  let usedAI = "Groq (Llama 3.3)";

  try {
    const messages = [
      { role: "system", content: "Você é o BuckAI Professor, especialista em educação. Resolva os problemas detalhadamente." },
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

    finalResult = completion.choices[0]?.message?.content || "";
    if (!finalResult || finalResult.length < 50) throw new Error("Insuficiente");

  } catch (error) {
    const geminiRes = await tryGemini(prompt, base64Image);
    if (geminiRes) {
      finalResult = geminiRes;
      usedAI = "Gemini (Fallback)";
    } else {
      return res.status(500).json({ error: 'Erro na pesquisa.' });
    }
  }

  // Log no Discord
  await sendLog('scripts', {
    title: `📚 Nova Pesquisa Estudantil (${usedAI})`,
    color: 0x3b82f6,
    fields: [
      { name: "🌐 IP", value: ip || "Desconhecido", inline: true },
      { name: "📖 Dúvida", value: task?.substring(0, 1024) || "Imagem enviada" }
    ],
    timestamp: new Date()
  });

  return res.status(200).json({ result: finalResult });
};
