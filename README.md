# BuckAI - O Futuro dos Scripts

## 🚀 Status do Sistema
- **Versão:** 2.1
- **Última Atualização:** 21/03/2026
- **Ambiente:** Vercel (Serverless)

## 🛠️ Novidades da v2.1
1. **Termos de Serviço (Obrigatório):** Os usuários agora devem aceitar os Termos de Serviço antes de acessar a plataforma.
2. **Sistema Premium (LivePix):** Integração com `livepix.gg/padrinrp` para doações e acesso Premium ilimitado.
3. **Ativação via Webhook:** Geração de códigos únicos enviada diretamente para o Discord.
4. **Downloads Profissionais:** Scripts FiveM agora vêm em uma estrutura de pastas limpa e correta (flattened ZIP).
5. **Correção de Cache:** Versionamento `?v=2.1` aplicado para garantir que os usuários sempre vejam a versão mais recente sem precisar limpar o cache manualmente.

## 🔑 Comandos de Administrador (Console)
- `resetarMeuUsuario()`: Limpa o `localStorage` do navegador para testar o fluxo de termos e créditos do zero.
- `gerarLoteDeCodigos(quantidade)`: Gera códigos Premium e envia para o Webhook do Discord.

## 📦 Estrutura FiveM Gerada
Ao baixar um script no modo Gamer (FiveM), a estrutura garantida é:
- `client.lua`
- `server.lua`
- `config.lua`
- `fxmanifest.lua`
- `html/` (se detectado uso de NUI)

---
*BuckAI - Desenvolvido para fins educacionais e experimentais.*
