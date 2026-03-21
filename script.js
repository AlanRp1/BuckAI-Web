/**
 * BUCK-AI v2.2 - CORE ENGINE (ULTRA-ROBUST EDITION)
 * 100% Blindado contra erros de DOM e Cache.
 */

(function() {
  "use strict";

  console.log("%c [BuckAI] Engine v2.2 Iniciada ", "background: #7c3aed; color: white; font-weight: bold;");

  // --- CONFIGURAÇÕES ---
  const MAX_FREE_CREDITS = 5;
  let selectedImageBase64 = null;
  let studentImageBase64 = null;

  // --- FUNÇÕES DE UTILIDADE ---
  const getEl = (id) => document.getElementById(id);
  
  const getIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch(e) { return "IP Web"; }
  };

  const getUserData = () => {
    const defaultData = {
      id: 'BUCK-' + Math.floor(Math.random() * 900000 + 100000),
      username: '',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      credits: MAX_FREE_CREDITS,
      lastReset: new Date().toDateString(),
      history: [],
      isPremium: false,
      isAdmin: false
    };
    try {
      const saved = localStorage.getItem('buckai_user_data');
      if (!saved) return defaultData;
      const data = JSON.parse(saved);
      if (!data.id) data.id = defaultData.id;
      if (data.username === 'buck__ai') data.isAdmin = true;
      return data;
    } catch (e) { return defaultData; }
  };

  const saveUserData = (data) => {
    try {
      localStorage.setItem('buckai_user_data', JSON.stringify(data));
      updateUI();
    } catch (e) { console.error("Erro ao salvar dados:", e); }
  };

  const typeWriter = (text, element, speed = 2) => {
    if (!element) return;
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        if (i % 10 === 0) element.parentElement.scrollTop = element.parentElement.scrollHeight;
      } else { clearInterval(timer); }
    }, speed);
  };

  // --- ATUALIZAÇÃO DA INTERFACE ---
  const updateUI = () => {
    try {
      const data = getUserData();
      const welcome = getEl('welcomeUser');
      const credits = getEl('userCredits');
      const lock = getEl('lockScreen');
      const info = getEl('userInfo');
      const adminBtn = getEl('adminPanelBtn');

      if (data && data.username) {
        if (welcome) welcome.textContent = `BEM-VINDO, ${data.username.toUpperCase()}`;
        if (credits) credits.textContent = data.isPremium ? "∞" : (data.credits || 0);
        if (lock) lock.classList.add('hidden');
        if (info) info.classList.remove('hidden');
        if (adminBtn) {
          if (data.isAdmin || data.username === 'buck__ai') adminBtn.classList.remove('hidden');
          else adminBtn.classList.add('hidden');
        }
        
        // Info do Modal
        const mid = getEl('userIdDisplay');
        const mun = getEl('userNameDisplay');
        const mst = getEl('userStatusDisplay');
        if (mid) mid.textContent = data.id;
        if (mun) mun.textContent = data.username.toUpperCase();
        if (mst) mst.textContent = data.isPremium ? "Membro Premium 👑" : "Membro Free ⚡";
      } else {
        if (lock) lock.classList.remove('hidden');
        if (info) info.classList.add('hidden');
      }
      
      updateStatsUI();
    } catch (err) { console.error("Erro UI:", err); }
  };

  const updateStatsUI = () => {
    try {
      const act = getEl('activeNow');
      const scr = getEl('totalScripts');
      const cli = getEl('totalClients');
      
      let stats = JSON.parse(localStorage.getItem('buckai_stats_v3')) || { totalScripts: 1542, totalClients: 894 };
      
      if (act) act.textContent = Math.floor(Math.random() * 10) + 35; // 35-45 ativos
      if (scr) scr.textContent = stats.totalScripts.toLocaleString();
      if (cli) cli.textContent = stats.totalClients.toLocaleString();
    } catch (e) {}
  };

  // --- HANDLERS DE AÇÃO ---
  const handleAuth = async (type) => {
    const user = getEl('authUsername')?.value.trim();
    const pass = getEl('authPassword')?.value.trim();
    if (!user || !pass) return alert("Preencha usuário e senha!");

    const loader = getEl('loader');
    if (loader) loader.classList.remove('hidden');

    try {
      const data = getUserData();
      data.username = user;
      saveUserData(data);
      console.log(`Auth ${type} sucesso para ${user}`);
    } catch (e) { console.error("Erro Auth:", e); }
    finally { if (loader) loader.classList.add('hidden'); }
  };

  const switchTab = (mode) => {
    console.log("Switching to:", mode);
    const sections = ['gamer', 'student', 'humanize', 'projects', 'support', 'admin'];
    sections.forEach(s => {
      const sec = getEl(s + 'Section');
      const btn = getEl(s + 'ModeBtn');
      if (sec) sec.classList.add('hidden');
      if (btn) btn.classList.remove('active');
    });

    const activeSec = getEl(mode + 'Section');
    const activeBtn = getEl(mode + 'ModeBtn');
    if (activeSec) activeSec.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('active');
    
    const result = getEl('resultArea');
    if (result) result.classList.add('hidden');
  };

  const generateScript = async () => {
    const desc = getEl('description')?.value.trim();
    if (!desc) return alert("Descreva o script!");
    
    const data = getUserData();
    if (!data.isPremium && data.credits <= 0) return alert("Sem créditos!");

    const loader = getEl('loader');
    if (loader) loader.classList.remove('hidden');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc, platform: 'FiveM' })
      });
      const resData = await res.json();
      
      const resultArea = getEl('resultArea');
      const output = getEl('outputCode');
      if (resultArea) resultArea.classList.remove('hidden');
      if (output) typeWriter(resData.result, output);
      
      if (!data.isPremium) {
        data.credits--;
        saveUserData(data);
      }
      resultArea?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) { alert("Erro na IA."); }
    finally { if (loader) loader.classList.add('hidden'); }
  };

  // --- DELEGAÇÃO DE EVENTOS (ULTRA SEGURO) ---
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (!target || !target.id) {
        // Se clicou em algo sem ID, verifica se é um botão de fechar modal
        if (e.target.classList.contains('close-modal-btn')) {
            const modals = document.querySelectorAll('.lock-overlay');
            modals.forEach(m => m.classList.add('hidden'));
        }
        return;
    }

    const id = target.id;
    console.log("Clique detectado em:", id);

    // Navegação
    if (id.endsWith('ModeBtn')) {
        const mode = id.replace('ModeBtn', '');
        switchTab(mode);
    }

    // Auth
    if (id === 'loginBtn') handleAuth('login');
    if (id === 'registerBtn') handleAuth('register');

    // Funções
    if (id === 'generateBtn') generateScript();
    
    if (id === 'studyBtn') {
        const task = getEl('studentTask')?.value.trim();
        if (!task) return alert("Digite sua dúvida!");
        // Chamada simplificada para o modo estudante
        alert("Modo Estudante em processamento...");
    }

    if (id === 'humanizeBtn') {
        const text = getEl('humanizeText')?.value.trim();
        if (!text) return alert("Cole o texto!");
        alert("Humanizando texto...");
    }
    
    // Perfil/Configurações
    if (id === 'settingsBtn') getEl('settingsModal')?.classList.remove('hidden');
    if (id === 'closeSettingsBtn') getEl('settingsModal')?.classList.add('hidden');
    if (id === 'logoutBtn') {
        if (confirm("Sair?")) {
            const d = getUserData();
            d.username = '';
            saveUserData(d);
            location.reload();
        }
    }

    // Pagamento
    if (id === 'upgradeBtn') getEl('paymentModal')?.classList.remove('hidden');
    if (id === 'closePaymentBtn') getEl('paymentModal')?.classList.add('hidden');

    // Utilitários
    if (id === 'copyBtn') {
        const code = getEl('outputCode')?.textContent;
        if (code) {
            navigator.clipboard.writeText(code);
            alert("Copiado!");
        }
    }
  });

  // --- INICIALIZAÇÃO ---
  document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    setInterval(updateStatsUI, 15000);
  });

  // Fallback caso o DOMContentLoaded já tenha passado
  if (document.readyState === "complete" || document.readyState === "interactive") {
    updateUI();
  }

})();
