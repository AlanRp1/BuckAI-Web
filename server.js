require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

// Banco de dados simples em JSON
const dbPath = path.join(__dirname, 'stats.json');
let stats = {
  totalScripts: 0,
  totalClients: 0,
  activeNow: 0
};

if (fs.existsSync(dbPath)) {
  stats = JSON.parse(fs.readFileSync(dbPath));
}

function saveStats() {
  fs.writeFileSync(dbPath, JSON.stringify(stats, null, 2));
}

// Configurar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const authApi = require('./api/auth');
const generateCodesApi = require('./api/generate-codes');
const generateApi = require('./api/generate');
const humanizeApi = require('./api/humanize');
const studyApi = require('./api/study');
const apiV2 = require('./api_v2/index');

// Simular Vercel Serverless no Express Local
const vercelToExpress = (handler) => async (req, res) => {
  // Mock res.status().json() para o handler da Vercel
  const originalStatus = res.status;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  // Vercel handlers esperam (req, res)
  return handler(req, res);
};

app.post('/api/auth', vercelToExpress(authApi));
app.post('/api/generate-codes', vercelToExpress(generateCodesApi));
app.post('/api/generate', vercelToExpress(generateApi));
app.post('/api/humanize', vercelToExpress(humanizeApi));
app.post('/api/study', vercelToExpress(studyApi));
app.post('/api/v2', vercelToExpress(apiV2));

// Gerenciar conexões Socket.io para estatísticas em tempo real
io.on('connection', (socket) => {
  stats.activeNow++;
  stats.totalClients++;
  saveStats();
  io.emit('updateStats', stats);

  socket.on('disconnect', () => {
    stats.activeNow = Math.max(0, stats.activeNow - 1);
    io.emit('updateStats', stats);
  });
});

app.post('/generate', async (req, res) => {
  const { description, platform } = req.body;

  if (!description || !platform) {
    return res.status(400).json({ error: 'Descrição e plataforma são obrigatórias.' });
  }

  let prompt = `Você é um especialista em desenvolvimento de scripts para FiveM (Lua) e SA-MP (Pawn). 
  Gere um script completo e funcional baseado na seguinte descrição: "${description}". 
  Plataforma: ${platform}.`;

  if (platform === 'FiveM') {
    prompt += `
    O retorno deve conter obrigatoriamente:
    1. client.lua
    2. server.lua
    3. config.lua
    Explique brevemente o que o script faz no final.`;
  } else if (platform === 'SA-MP') {
    prompt += `
    O retorno deve ser um arquivo .pwn completo e pronto para compilar.
    Explique brevemente o que o script faz no final.`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    // Atualizar estatísticas de scripts gerados
    stats.totalScripts++;
    saveStats();
    io.emit('updateStats', stats);

    res.json({ result: content });
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    res.status(500).json({ error: 'Erro ao gerar o script.' });
  }
});

app.post('/fix', async (req, res) => {
  const { code, platform, errorMsg } = req.body;

  if (!code || !platform) {
    return res.status(400).json({ error: 'Código e plataforma são obrigatórios para correção.' });
  }

  const prompt = `Você é um especialista em desenvolvimento de scripts para FiveM (Lua) e SA-MP (Pawn). 
  O código abaixo apresentou problemas ou o usuário deseja uma correção/melhoria.
  Plataforma: ${platform}.
  Erro/Pedido: ${errorMsg || 'Corrigir erros de lógica e sintaxe'}.
  
  Código Original:
  ${code}
  
  Por favor, retorne o código completo corrigido e uma breve explicação do que foi ajustado.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    res.json({ result: content });
  } catch (error) {
    console.error('Erro na API do Gemini (Fix):', error);
    res.status(500).json({ error: 'Erro ao corrigir o script.' });
  }
});

server.listen(port, () => {
  console.log(`BuckAI rodando em http://localhost:${port}`);
});
