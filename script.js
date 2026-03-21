document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do DOM com Null-Check ---
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
  const verifySubBtn = getEl('verifySubBtn');

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

  // Simulação de estatísticas estáveis
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

  // Listeners com Null-Check
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      const data = getUserData();
      if (data.isPremium) {
        alert("Você já é um membro Premium! Aproveite seus benefícios ilimitados.");
        return;
      }
      if (paymentModal) paymentModal.classList.remove('hidden');
    });
  }

  if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', () => {
      if (paymentModal) paymentModal.classList.add('hidden');
    });
  }

  const activatePremium = (code) => {
    const data = getUserData();
    const usedCodes = JSON.parse(localStorage.getItem('buckai_used_codes')) || [];
    if (usedCodes.includes(code)) {
      alert("Este código já foi utilizado!");
      return;
    }
    const isValidFormat = /^BUCK-(VIP|PREMIUM)-[A-Z0-9]{6}-[A-Z0-9]+$/.test(code);
    const isAdminCode = (code === "BUCK-MASTER-ADMIN");
    if (isValidFormat || isAdminCode) {
      data.isPremium = true;
      saveUserData(data);
      usedCodes.push(code);
      localStorage.setItem('buckai_used_codes', JSON.stringify(usedCodes));
      alert("SISTEMA ATUALIZADO! Agora você é BuckAI Premium! 🚀");
      if (paymentModal) paymentModal.classList.add('hidden');
    } else {
      alert("Código de ativação inválido ou formato incorreto.");
    }
  };

  if (activateBtn) {
    activateBtn.addEventListener('click', () => {
      if (activationCodeInput) activatePremium(activationCodeInput.value.trim());
    });
  }

  if (modalActivateBtn) {
    modalActivateBtn.addEventListener('click', () => {
      if (modalActivationCodeInput) activatePremium(modalActivationCodeInput.value.trim());
    });
  }

  const handleAuth = async (type) => {
    const username = authUsernameInput?.value.trim();
    const password = authPasswordInput?.value.trim();
    if (!username || !password) return alert("Preencha todos os campos!");
    if (loader) loader.classList.remove('hidden');
    try {
      const ip = await getIP();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, username, password, ip, userAgent: navigator.userAgent })
      });
      const data = await res.json();
      if (data.success) {
        const userData = getUserData();
        userData.username = username;
        saveUserData(userData);
        alert(type === 'register' ? "Conta criada com sucesso!" : "Login realizado com sucesso!");
      } else { alert("Erro: " + data.error); }
    } catch (e) {
      const userData = getUserData();
      userData.username = username;
      saveUserData(userData);
    } finally {
      if (loader) loader.classList.add('hidden');
    }
  };

  if (loginBtn) loginBtn.addEventListener('click', () => handleAuth('login'));
  if (registerBtn) registerBtn.addEventListener('click', () => handleAuth('register'));

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.remove('hidden');
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }

  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', () => {
      if (avatarInput) avatarInput.click();
    });
  }

  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) return alert("Foto muito grande!");
        const reader = new FileReader();
        reader.onload = (ev) => { if (profilePreview) profilePreview.src = ev.target.result; };
        reader.readAsDataURL(file);
      }
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const data = getUserData();
      if (profilePreview) data.avatar = profilePreview.src;
      saveUserData(data);
      alert("Perfil atualizado!");
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm("Deseja realmente sair?")) {
        const data = getUserData();
        data.username = '';
        saveUserData(data);
        location.reload();
      }
    });
  }

  const renderHistory = () => {
    const data = getUserData();
    if (!historyList) return;
    if (data.history.length === 0) {
      historyList.innerHTML = `<div class="empty-state"><p>Nenhum projeto ainda.</p></div>`;
      return;
    }
    historyList.innerHTML = data.history.map(item => `
      <div class="history-item">
        <h4>${item.title}</h4>
        <button onclick="viewHistoryItem(${item.id})"><i class="fas fa-eye"></i></button>
      </div>
    `).join('');
  };

  const switchMode = (activeBtn, activeSection) => {
    [gamerModeBtn, studentModeBtn, humanizeModeBtn, projectsModeBtn, supportModeBtn, adminPanelBtn].forEach(btn => btn?.classList.remove('active'));
    [gamerSection, studentSection, humanizeSection, projectsSection, supportSection, adminSection].forEach(sec => sec?.classList.add('hidden'));
    activeBtn?.classList.add('active');
    activeSection?.classList.remove('hidden');
    if (resultArea) resultArea.classList.add('hidden');
  };

  if (gamerModeBtn) gamerModeBtn.addEventListener('click', () => switchMode(gamerModeBtn, gamerSection));
  if (studentModeBtn) studentModeBtn.addEventListener('click', () => switchMode(studentModeBtn, studentSection));
  if (humanizeModeBtn) humanizeModeBtn.addEventListener('click', () => switchMode(humanizeModeBtn, humanizeSection));
  if (projectsModeBtn) projectsModeBtn.addEventListener('click', () => switchMode(projectsModeBtn, projectsSection));
  if (supportModeBtn) supportModeBtn.addEventListener('click', () => switchMode(supportModeBtn, supportSection));
  if (adminPanelBtn) adminPanelBtn.addEventListener('click', () => switchMode(adminPanelBtn, adminSection));

  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      const description = descriptionInput?.value.trim();
      if (!description) return alert('Descreva o script.');
      if (!useCredit()) return;
      if (loader) loader.classList.remove('hidden');
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, platform: 'FiveM' })
        });
        const data = await res.json();
        if (resultArea) resultArea.classList.remove('hidden');
        if (outputCode) typeWriter(data.result, outputCode);
        incrementGlobalScripts();
      } catch (e) { alert("Erro ao gerar script."); }
      finally { if (loader) loader.classList.add('hidden'); }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (outputCode) {
        navigator.clipboard.writeText(outputCode.textContent);
        alert("Copiado!");
      }
    });
  }

  updateUI();
  setInterval(updateStatsUI, 15000);
});
