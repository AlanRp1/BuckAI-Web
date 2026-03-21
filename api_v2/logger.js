// SISTEMA DE LOGS EVOLUÍDO BUCKAI v2.0
// OBJETIVO: Centralizar logs no Discord sem tocar nos arquivos originais da pasta api/

const https = require('https');

const WEBHOOKS = {
    auth: "https://discord.com/api/webhooks/1484176339207454911/VBl5RHQhvsDEBI-51tplBAnzXjouHcw0osr_-P1aaJL1LTtGQJMiA3uOjp8AK2a-cRqO",
    gen: "https://discord.com/api/webhooks/1484174998275883010/ubKZZFbWhNXQsf2yg6EY2zW3cBLzprJRe9Ba2gArF4EGVYR6sjfg4U-rnuAiXDbIqRwS",
    admin: "https://discord.com/api/webhooks/1484798584158163044/cfk2askZLMhxXHS4j4pF5aXzwDGjYu4-ZFKb5SeMZTIrt9EofETV9uuJqvXLJIfhjlAH"
};

module.exports = {
    async log(type, embed) {
        const url = WEBHOOKS[type] || WEBHOOKS.gen;
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
                res.on('end', () => resolve(true));
            });
            req.on('error', (e) => {
                console.error(`[LoggerV2] Erro:`, e.message);
                resolve(false);
            });
            req.write(payload);
            req.end();
        });
    }
};
