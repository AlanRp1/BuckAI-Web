// SISTEMA DE MÚLTIPLAS IAs BUCKAI v2.0
// OBJETIVO: Roteamento inteligente para IAs externas sem tocar no núcleo original

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require('groq-sdk');

const KEYS = {
    GROQ: "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",
    GEMINI: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
};

const groq = new Groq({ apiKey: KEYS.GROQ });
const genAI = new GoogleGenerativeAI(KEYS.GEMINI);

module.exports = {
    async ask(prompt, modelType = "general") {
        console.log(`[RouterV2] Processando pergunta tipo: ${modelType}`);
        
        try {
            // Se for humanização ou texto casual, prioriza Groq (Llama 3.3)
            if (modelType === "humanize" || modelType === "casual") {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "Você é a BuckAI Evoluída. Sua resposta deve ser natural e 100% humana." },
                        { role: "user", content: prompt }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.8,
                });
                return completion.choices[0]?.message?.content;
            }

            // Fallback ou perguntas gerais, usa Gemini (Flash/Pro)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (error) {
            console.error("[RouterV2] Erro na resposta da IA:", error);
            return "Sinto muito, a BuckAI Evoluída está passando por uma manutenção rápida. Tente novamente em alguns segundos.";
        }
    }
};
