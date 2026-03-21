// CONTROLADOR PRINCIPAL BUCKAI API v2.0
// OBJETIVO: Gerenciar novas rotas e integração sem tocar na api/ original

const routerV2 = require('./router');
const loggerV2 = require('./logger');

module.exports = async (req, res) => {
    const { type, payload, ip } = req.body;
    
    if (!type) {
        return res.status(400).json({ error: "Tipo de requisição v2 não especificado." });
    }

    console.log(`[APIV2] Recebido: ${type} do IP: ${ip}`);

    try {
        let result = "";
        
        switch (type) {
            case "ask_v2":
                result = await routerV2.ask(payload.prompt, payload.modelType || "general");
                break;
            
            case "log_v2":
                await loggerV2.log(payload.logType, payload.embed);
                result = "Log v2 enviado com sucesso.";
                break;
                
            default:
                return res.status(404).json({ error: "Funcionalidade v2 não encontrada." });
        }

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error(`[APIV2] Erro Crítico:`, error);
        return res.status(500).json({ error: "Falha na Camada de Evolução v2." });
    }
};
