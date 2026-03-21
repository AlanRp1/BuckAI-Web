document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do DOM com Null-Check (Proteção Total) ---
  const getEl = (id) => document.getElementById(id);

  const activeNowEl = getEl('activeNow');
  const totalScriptsEl = getEl('totalScripts');
  const totalClientsEl = getEl('totalClients');
  const generateBtn = getEl('generateBtn');
  const descriptionInput = getEl('description');
  const platformRadios = document.getElementsByName('platform');
  const resultArea = getEl('resultArea');
  const outputCode = getEl('outputCode');
  const copyBtn = getEl('copyBtn');
  const fixBtn = getEl('fixBtn');
  const downloadBtn = getEl('downloadBtn');
  const imageInput = getEl('imageInput');
  const uploadImageBtn = getEl('uploadImageBtn');
  const imageStatus = getEl('imageStatus');
  const loader = getEl('loader');
  const lockScreen = getEl('lockScreen');
  const loginBtn = getEl('loginBtn');
  const registerBtn = getEl('registerBtn');
  const authUsernameInput = getEl('authUsername');
  const authPasswordInput = getEl('authPassword');
  const welcomeUserEl = getEl('welcomeUser');
  const userInfoBar = getEl('userInfo');
  const userCreditsEl = getEl('userCredits');
  const upgradeBtn = getEl('upgradeBtn');
  const gamerModeBtn = getEl('gamerModeBtn');
  const studentModeBtn = getEl('studentModeBtn');
  const humanizeModeBtn = getEl('humanizeModeBtn');
  const projectsModeBtn = getEl('projectsModeBtn');
  const supportModeBtn = getEl('supportModeBtn');
  const adminPanelBtn = getEl('adminPanelBtn');
  const gamerSection = getEl('gamerSection');
  const studentSection = getEl('studentSection');
  const humanizeSection = getEl('humanizeSection');
  const projectsSection = getEl('projectsSection');
  const supportSection = getEl('supportSection');
  const adminSection = getEl('adminSection');
  const studyBtn = getEl('studyBtn');
  const studentTaskInput = getEl('studentTask');
  const studentImageInput = getEl('studentImageInput');
  const uploadStudentImageBtn = getEl('uploadStudentImageBtn');
  const studentImageStatus = getEl('studentImageStatus');
  const humanizeBtn = getEl('humanizeBtn');
  const humanizeTextInput = getEl('humanizeText');
  const humanizeToneRadios = document.getElementsByName('humanizeTone');
  const historyList = getEl('historyList');
  const clearHistoryBtn = getEl('clearHistoryBtn');
  const activationArea = getEl('activationArea');
  const activationCodeInput = getEl('activationCode');
  const activateBtn = getEl('activateBtn');
  const paymentModal = getEl('paymentModal');
  const closePaymentBtn = getEl('closePaymentBtn');
  const modalActivationCodeInput = getEl('modalActivationCode');
  const modalActivateBtn = getEl('modalActivateBtn');
  const userAvatar = getEl('userAvatar');
  const settingsBtn = getEl('settingsBtn');
  const settingsModal = getEl('settingsModal');
  const closeSettingsBtn = getEl('closeSettingsBtn');
  const avatarInput = getEl('avatarInput');
  const changeAvatarBtn = getEl('changeAvatarBtn');
  const profilePreview = getEl('profilePreview');
  const saveProfileBtn = getEl('saveProfileBtn');
  const logoutBtn = getEl('logoutBtn');
  const userIdDisplay = getEl('userIdDisplay');
  const userNameDisplay = getEl('userNameDisplay');
  const userStatusDisplay = getEl('userStatusDisplay');

  const adminBatchBtn = getEl('adminBatchBtn');
  const adminBatchCount = getEl('adminBatchCount');
  const recentCodesList = getEl('recentCodesList');
  const codesContainer = getEl('codesContainer');
  const targetAdminId = getEl('targetAdminId');
  const giveAdminBtn = getEl('giveAdminBtn');
  const adminLogsList = getEl('adminLogsList');
  const adminTicketsList = getEl('adminTicketsList');
  const adminChatModal = getEl('adminChatModal');
  const closeAdminChatBtn = getEl('closeAdminChatBtn');
  const adminChatMessages = getEl('adminChatMessages');
  const adminReplyInput = getEl('adminReplyInput');
  const sendAdminReplyBtn = getEl('sendAdminReplyBtn');
  const adminChatTitle = getEl('adminChatTitle');
  const supportMessages = getEl('supportMessages');
  const supportInput = getEl('supportInput');
  const sendSupportBtn = getEl('sendSupportBtn');

  // --- Configurações ---
  const MAX_FREE_CREDITS = 5;
  let selectedImageBase64 = null;
  let studentImageBase64 = null;

  // --- Funções de Utilidade ---
  const getIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch(e) { return "IP Web"; }
  };

  const typeWriter = (text, element, speed = 2) => {
    if (!element) return;
    let i = 0;
    element.textContent = '';
    element.style.fontFamily = "'Fira Code', monospace";
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        if (i % 5 === 0) element.parentElement.scrollTop = element.parentElement.scrollHeight;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  // Simulação de estatísticas estáveis (Correção do "Desprogramado")
  const updateStatsUI = () => {
    try {
      let webStats = JSON.parse(localStorage.getItem('buckai_stats_v3')) || {
        totalScripts: 1542,
        totalClients: 894
      };
      
      const baseActive = 42;
      const fluctuation = Math.floor(Math.random() * 5) - 2;
      const currentActive = Math.max(35, baseActive + fluctuation);

      if (activeNowEl) activeNowEl.textContent = currentActive;
      if (totalScriptsEl) totalScriptsEl.textContent = webStats.totalScripts.toLocaleString();
      if (totalClientsEl) totalClientsEl.textContent = webStats.totalClients.toLocaleString();
    } catch (e) {}
  };

  const incrementGlobalScripts = () => {
    try {
      let webStats = JSON.parse(localStorage.getItem('buckai_stats_v3')) || { totalScripts: 1542, totalClients: 894 };
      webStats.totalScripts++;
      localStorage.setItem('buckai_stats_v3', JSON.stringify(webStats));
      updateStatsUI();
    } catch (e) {}
  };

  // --- Lógica de Usuário e Créditos ---
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
      if (!data.avatar) data.avatar = defaultData.avatar;
      if (data.isAdmin === undefined) data.isAdmin = defaultData.isAdmin;

      if (data.username === 'buck__ai' || data.id === 'BUCK-ADMIN-MASTER') {
        data.isAdmin = true;
      }
      
      const today = new Date().toDateString();
      if (data.lastReset !== today && !data.isPremium) {
        data.credits = MAX_FREE_CREDITS;
        data.lastReset = today;
        saveUserData(data);
      }
      return data;
    } catch (e) { return defaultData; }
  };

  const saveUserData = (data) => {
    localStorage.setItem('buckai_user_data', JSON.stringify(data));
    updateUI();
  };

  const updateUI = () => {
    try {
      const data = getUserData();
      if (data && data.username) {
        if (welcomeUserEl) welcomeUserEl.textContent = `BEM-VINDO, ${data.username.toUpperCase()}`;
        if (userCreditsEl) userCreditsEl.textContent = data.isPremium ? "∞" : (data.credits || 0);
        if (userAvatar) userAvatar.src = data.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
        
        if (userIdDisplay) userIdDisplay.textContent = data.id || '#000000';
        if (userNameDisplay) userNameDisplay.textContent = data.username.toUpperCase();
        if (userStatusDisplay) {
          userStatusDisplay.textContent = data.isPremium ? "Membro Premium 👑" : "Membro Free ⚡";
        }
        if (profilePreview) profilePreview.src = data.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';

        if (upgradeBtn) {
          if (data.isPremium) {
            upgradeBtn.innerHTML = '<i class="fas fa-crown"></i> PLANO PREMIUM';
            upgradeBtn.classList.add('active');
            if (activationArea) activationArea.classList.add('hidden');
          } else {
            upgradeBtn.innerHTML = '<i class="fas fa-crown"></i> SEJA PREMIUM';
            upgradeBtn.classList.remove('active');
            if (activationArea) activationArea.classList.remove('hidden');
          }
        }

        if (userInfoBar) userInfoBar.classList.remove('hidden');
        if (lockScreen) lockScreen.classList.add('hidden');

        if (adminPanelBtn) {
          if (data.isAdmin) adminPanelBtn.classList.remove('hidden');
          else adminPanelBtn.classList.add('hidden');
        }
      } else {
        if (lockScreen) lockScreen.classList.remove('hidden');
        if (userInfoBar) userInfoBar.classList.add('hidden');
      }
      
      renderHistory();
      updateStatsUI();
    } catch (err) {
      updateStatsUI();
    }
  };

  const useCredit = () => {
    const data = getUserData();
    if (data.isPremium) return true;
    if (data.credits > 0) {
      data.credits--;
      saveUserData(data);
      return true;
    }
    alert("Você atingiu o limite diário de créditos gratuitos! Torne-se Premium para uso ilimitado.");
    return false;
  };

  // --- Event Listeners (Proteção contra Null) ---

  // Auth
  if (loginBtn) loginBtn.onclick = () => handleAuth('login');
  if (registerBtn) registerBtn.onclick = () => handleAuth('register');

  // Modos de Navegação
  const switchMode = (activeBtn, activeSection) => {
    [gamerModeBtn, studentModeBtn, humanizeModeBtn, projectsModeBtn, supportModeBtn, adminPanelBtn].forEach(btn => btn?.classList.remove('active'));
    [gamerSection, studentSection, humanizeSection, projectsSection, supportSection, adminSection].forEach(sec => sec?.classList.add('hidden'));
    activeBtn?.classList.add('active');
    activeSection?.classList.remove('hidden');
    if (resultArea) resultArea.classList.add('hidden');
  };

  if (gamerModeBtn) gamerModeBtn.onclick = () => switchMode(gamerModeBtn, gamerSection);
  if (studentModeBtn) studentModeBtn.onclick = () => switchMode(studentModeBtn, studentSection);
  if (humanizeModeBtn) humanizeModeBtn.onclick = () => switchMode(humanizeModeBtn, humanizeSection);
  if (projectsModeBtn) projectsModeBtn.onclick = () => { switchMode(projectsModeBtn, projectsSection); renderHistory(); };
  if (supportModeBtn) supportModeBtn.onclick = () => { switchMode(supportModeBtn, supportSection); renderSupportChat(); };
  if (adminPanelBtn) adminPanelBtn.onclick = () => { switchMode(adminPanelBtn, adminSection); renderAdminPanel(); };

  // Funcionalidades de IA
  if (generateBtn) {
    generateBtn.onclick = async () => {
      const description = descriptionInput?.value.trim();
      const platform = Array.from(platformRadios).find(r => r.checked)?.value || 'FiveM';
      if (!description && !selectedImageBase64) return alert('Descreva o script ou anexe um erro.');
      if (!useCredit()) return;
      if (loader) loader.classList.remove('hidden');
      try {
        const ip = await getIP();
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, platform, base64Image: selectedImageBase64, ip })
        });
        const data = await res.json();
        if (resultArea) resultArea.classList.remove('hidden');
        if (outputCode) typeWriter(data.result, outputCode);
        addToHistory("Script " + platform, description || "Análise de Erro", data.result);
        incrementGlobalScripts();
        resultArea.scrollIntoView({ behavior: 'smooth' });
      } catch (e) { alert("Erro ao gerar script."); }
      finally { if (loader) loader.classList.add('hidden'); }
    };
  }

  if (studyBtn) {
    studyBtn.onclick = async () => {
      const task = studentTaskInput?.value.trim();
      if (!task && !studentImageBase64) return alert('Digite sua dúvida ou anexe uma foto.');
      if (!useCredit()) return;
      if (loader) loader.classList.remove('hidden');
      try {
        const ip = await getIP();
        const res = await fetch('/api/study', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, base64Image: studentImageBase64, ip })
        });
        const data = await res.json();
        if (resultArea) resultArea.classList.remove('hidden');
        if (outputCode) typeWriter(data.result, outputCode);
        addToHistory("Estudo", task || "Exercício", data.result);
        resultArea.scrollIntoView({ behavior: 'smooth' });
      } catch (e) { alert("Erro ao obter resposta."); }
      finally { if (loader) loader.classList.add('hidden'); }
    };
  }

  if (humanizeBtn) {
    humanizeBtn.onclick = async () => {
      const text = humanizeTextInput?.value.trim();
      const tone = Array.from(humanizeToneRadios).find(r => r.checked)?.value || 'Casual';
      if (!text) return alert('Cole o texto para humanizar.');
      if (!useCredit()) return;
      if (loader) loader.classList.remove('hidden');
      try {
        const ip = await getIP();
        const res = await fetch('/api/humanize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, tone, ip })
        });
        const data = await res.json();
        if (resultArea) resultArea.classList.remove('hidden');
        if (outputCode) typeWriter(data.result, outputCode);
        addToHistory("Humanização", text.substring(0, 30) + "...", data.result);
        resultArea.scrollIntoView({ behavior: 'smooth' });
      } catch (e) { alert("Erro ao humanizar."); }
      finally { if (loader) loader.classList.add('hidden'); }
    };
  }

  // Engrenagem e Perfil
  if (settingsBtn) settingsBtn.onclick = () => settingsModal?.classList.remove('hidden');
  if (closeSettingsBtn) closeSettingsBtn.onclick = () => settingsModal?.classList.add('hidden');
  if (logoutBtn) logoutBtn.onclick = () => { if (confirm("Sair?")) { const d = getUserData(); d.username = ''; saveUserData(d); location.reload(); } };
  
  if (changeAvatarBtn) changeAvatarBtn.onclick = () => avatarInput?.click();
  if (avatarInput) {
    avatarInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.size < 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (ev) => { if (profilePreview) profilePreview.src = ev.target.result; };
        reader.readAsDataURL(file);
      } else { alert("Imagem muito grande! Máximo 1MB."); }
    };
  }
  if (saveProfileBtn) {
    saveProfileBtn.onclick = () => {
      const d = getUserData();
      if (profilePreview) d.avatar = profilePreview.src;
      saveUserData(d);
      alert("Perfil salvo!");
      settingsModal?.classList.add('hidden');
    };
  }

  // Premium e Pagamento
  if (upgradeBtn) upgradeBtn.onclick = () => paymentModal?.classList.remove('hidden');
  if (closePaymentBtn) closePaymentBtn.onclick = () => paymentModal?.classList.add('hidden');
  if (modalActivateBtn) {
    modalActivateBtn.onclick = () => {
      const code = modalActivationCodeInput?.value.trim();
      if (code) activatePremium(code);
    };
  }

  const activatePremium = (code) => {
    const data = getUserData();
    const used = JSON.parse(localStorage.getItem('buckai_used_codes')) || [];
    if (used.includes(code)) return alert("Código já usado!");
    if (/^BUCK-(VIP|PREMIUM)-[A-Z0-9]{6}-[A-Z0-9]+$/.test(code) || code === "BUCK-MASTER-ADMIN") {
      data.isPremium = true;
      saveUserData(data);
      used.push(code);
      localStorage.setItem('buckai_used_codes', JSON.stringify(used));
      alert("PREMIUM ATIVADO! 🚀");
      paymentModal?.classList.add('hidden');
    } else { alert("Código inválido."); }
  };

  // Suporte
  const renderSupportChat = () => {
    if (!supportMessages) return;
    const d = getUserData();
    const msgs = JSON.parse(localStorage.getItem(`chat_${d.id}`)) || [];
    supportMessages.innerHTML = msgs.map(m => `<div class="msg-${m.role}"><span class="msg-text">${m.text}</span></div>`).join('');
    supportMessages.scrollTop = supportMessages.scrollHeight;
  };

  if (sendSupportBtn) {
    sendSupportBtn.onclick = () => {
      const text = supportInput?.value.trim();
      if (!text) return;
      const d = getUserData();
      const msgs = JSON.parse(localStorage.getItem(`chat_${d.id}`)) || [];
      msgs.push({ role: 'user', text, time: Date.now() });
      localStorage.setItem(`chat_${d.id}`, JSON.stringify(msgs));
      
      // Ticket para Admin
      const tickets = JSON.parse(localStorage.getItem('buckai_tickets')) || [];
      if (!tickets.find(t => t.id === d.id)) tickets.push({ id: d.id, user: d.username, lastMsg: text });
      localStorage.setItem('buckai_tickets', JSON.stringify(tickets));

      if (supportInput) supportInput.value = '';
      renderSupportChat();
      setTimeout(() => {
        msgs.push({ role: 'admin', text: "Recebemos sua mensagem! Responderemos em breve.", time: Date.now() });
        localStorage.setItem(`chat_${d.id}`, JSON.stringify(msgs));
        renderSupportChat();
      }, 1000);
    };
  }

  // Admin
  const renderAdminPanel = () => {
    if (adminLogsList) adminLogsList.innerHTML = `<div class="log-entry">Painel Admin Ativo.</div>`;
    const tickets = JSON.parse(localStorage.getItem('buckai_tickets')) || [];
    if (adminTicketsList) {
      adminTicketsList.innerHTML = tickets.map(t => `<div class="ticket-item"><strong>${t.user}</strong>: ${t.lastMsg}</div>`).join('');
    }
  };

  if (adminBatchBtn) {
    adminBatchBtn.onclick = async () => {
      const count = adminBatchCount?.value || 50;
      adminBatchBtn.disabled = true;
      try {
        const res = await fetch('/api/generate-codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: "BUCK-ADMIN-SECRET-2026", count })
        });
        const data = await res.json();
        if (data.success) alert("Códigos VIP enviados ao Discord!");
      } catch (e) {} finally { adminBatchBtn.disabled = false; }
    };
  }

  // Utilitários
  if (copyBtn) copyBtn.onclick = () => { if (outputCode) { navigator.clipboard.writeText(outputCode.textContent); alert("Copiado!"); } };
  if (downloadBtn) downloadBtn.onclick = () => alert("ZIP: Use o botão baixar no projeto.");

  // Inicialização
  updateUI();
  setInterval(updateStatsUI, 15000);

  // Imagens
  if (uploadImageBtn) uploadImageBtn.onclick = () => imageInput?.click();
  if (imageInput) imageInput.onchange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = (ev) => { selectedImageBase64 = ev.target.result.split(',')[1]; if (imageStatus) imageStatus.textContent = '✅ OK'; };
      r.readAsDataURL(f);
    }
  };

  if (uploadStudentImageBtn) uploadStudentImageBtn.onclick = () => studentImageInput?.click();
  if (studentImageInput) studentImageInput.onchange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = (ev) => { studentImageBase64 = ev.target.result.split(',')[1]; if (studentImageStatus) studentImageStatus.textContent = '✅ OK'; };
      r.readAsDataURL(f);
    }
  };
});
