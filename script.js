document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do DOM ---
  const activeNowEl = document.getElementById('activeNow');
  const totalScriptsEl = document.getElementById('totalScripts');
  const totalClientsEl = document.getElementById('totalClients');
  const generateBtn = document.getElementById('generateBtn');
  const descriptionInput = document.getElementById('description');
  const platformRadios = document.getElementsByName('platform');
  const resultArea = document.getElementById('resultArea');
  const outputCode = document.getElementById('outputCode');
  const copyBtn = document.getElementById('copyBtn');
  const fixBtn = document.getElementById('fixBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const imageInput = document.getElementById('imageInput');
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const imageStatus = document.getElementById('imageStatus');
  const loader = document.getElementById('loader');
  const lockScreen = document.getElementById('lockScreen');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const authUsernameInput = document.getElementById('authUsername');
  const authPasswordInput = document.getElementById('authPassword');
  const welcomeUserEl = document.getElementById('welcomeUser');
  const userInfoBar = document.getElementById('userInfo');
  const userCreditsEl = document.getElementById('userCredits');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const gamerModeBtn = document.getElementById('gamerModeBtn');
  const studentModeBtn = document.getElementById('studentModeBtn');
  const humanizeModeBtn = document.getElementById('humanizeModeBtn');
  const projectsModeBtn = document.getElementById('projectsModeBtn');
  const supportModeBtn = document.getElementById('supportModeBtn');
  const adminPanelBtn = document.getElementById('adminPanelBtn');
  const gamerSection = document.getElementById('gamerSection');
  const studentSection = document.getElementById('studentSection');
  const humanizeSection = document.getElementById('humanizeSection');
  const projectsSection = document.getElementById('projectsSection');
  const supportSection = document.getElementById('supportSection');
  const adminSection = document.getElementById('adminSection');
  const studyBtn = document.getElementById('studyBtn');
  const studentTaskInput = document.getElementById('studentTask');
  const studentImageInput = document.getElementById('studentImageInput');
  const uploadStudentImageBtn = document.getElementById('uploadStudentImageBtn');
  const studentImageStatus = document.getElementById('studentImageStatus');
  const humanizeBtn = document.getElementById('humanizeBtn');
  const humanizeTextInput = document.getElementById('humanizeText');
  const humanizeToneRadios = document.getElementsByName('humanizeTone');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const activationArea = document.getElementById('activationArea');
  const activationCodeInput = document.getElementById('activationCode');
  const activateBtn = document.getElementById('activateBtn');
  const paymentModal = document.getElementById('paymentModal');
  const closePaymentBtn = document.getElementById('closePaymentBtn');
  const modalActivationCodeInput = document.getElementById('modalActivationCode');
  const modalActivateBtn = document.getElementById('modalActivateBtn');
  const userAvatar = document.getElementById('userAvatar');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const profilePreview = document.getElementById('profilePreview');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userIdDisplay = document.getElementById('userIdDisplay');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userStatusDisplay = document.getElementById('userStatusDisplay');

  const adminBatchBtn = document.getElementById('adminBatchBtn');
  const adminBatchCount = document.getElementById('adminBatchCount');
  const recentCodesList = document.getElementById('recentCodesList');
  const codesContainer = document.getElementById('codesContainer');
  const targetAdminId = document.getElementById('targetAdminId');
  const giveAdminBtn = document.getElementById('giveAdminBtn');
  const adminLogsList = document.getElementById('adminLogsList');
  const adminTicketsList = document.getElementById('adminTicketsList');
  const adminChatModal = document.getElementById('adminChatModal');
  const closeAdminChatBtn = document.getElementById('closeAdminChatBtn');
  const adminChatMessages = document.getElementById('adminChatMessages');
  const adminReplyInput = document.getElementById('adminReplyInput');
  const sendAdminReplyBtn = document.getElementById('sendAdminReplyBtn');
  const adminChatTitle = document.getElementById('adminChatTitle');
  const supportMessages = document.getElementById('supportMessages');
  const supportInput = document.getElementById('supportInput');
  const sendSupportBtn = document.getElementById('sendSupportBtn');

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

  // Simulação de estatísticas
  const updateStatsUI = () => {
    let webStats = JSON.parse(localStorage.getItem('buckai_stats')) || {
      totalScripts: Math.floor(Math.random() * 50) + 100,
      totalClients: Math.floor(Math.random() * 20) + 50
    };
    activeNowEl.textContent = Math.floor(Math.random() * 8) + 2;
    totalScriptsEl.textContent = webStats.totalScripts;
    totalClientsEl.textContent = webStats.totalClients;
  };

  const incrementGlobalScripts = () => {
    let webStats = JSON.parse(localStorage.getItem('buckai_stats')) || { totalScripts: 100, totalClients: 50 };
    webStats.totalScripts++;
    localStorage.setItem('buckai_stats', JSON.stringify(webStats));
    updateStatsUI();
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
    const saved = localStorage.getItem('buckai_user_data');
    if (!saved) return defaultData;
    
    const data = JSON.parse(saved);
    // Garantir que campos novos existam
    if (!data.id) data.id = defaultData.id;
    if (!data.avatar) data.avatar = defaultData.avatar;
    if (data.isAdmin === undefined) data.isAdmin = defaultData.isAdmin;

    // MASTER ADMIN: Você pode colocar seu ID aqui para sempre ser admin
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
  };

  const saveUserData = (data) => {
    localStorage.setItem('buckai_user_data', JSON.stringify(data));
    updateUI();
  };

  const updateUI = () => {
    // Verificar Termos de Serviço primeiro
    if (localStorage.getItem('buckai_terms_accepted') !== 'true') {
      window.location.href = 'terms.html';
      return;
    }

    const data = getUserData();
    if (data.username) {
      welcomeUserEl.textContent = `BEM-VINDO, ${data.username.toUpperCase()}`;
      userCreditsEl.textContent = data.isPremium ? "∞" : data.credits;
      userAvatar.src = data.avatar;
      
      // Atualizar info do modal de perfil
      userIdDisplay.textContent = data.id;
      userNameDisplay.textContent = data.username.toUpperCase();
      userStatusDisplay.textContent = data.isPremium ? "Membro Premium 👑" : "Membro Free ⚡";
      profilePreview.src = data.avatar;

      if (data.isPremium) {
        upgradeBtn.innerHTML = '<i class="fas fa-crown"></i> PLANO PREMIUM';
        upgradeBtn.classList.add('active');
        activationArea.classList.add('hidden');
      } else {
        upgradeBtn.innerHTML = '<i class="fas fa-crown"></i> SEJA PREMIUM';
        upgradeBtn.classList.remove('active');
        activationArea.classList.remove('hidden');
      }

      userInfoBar.classList.remove('hidden');
      lockScreen.classList.add('hidden');

      // Mostrar aba Admin se for Admin
      if (data.isAdmin) {
        adminPanelBtn.classList.remove('hidden');
      } else {
        adminPanelBtn.classList.add('hidden');
      }
    } else {
      lockScreen.classList.remove('hidden');
    }
    renderHistory();
    updateStatsUI();
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

  // Upgrade para Premium (Modal com QR Code)
  upgradeBtn.addEventListener('click', () => {
    const data = getUserData();
    if (data.isPremium) {
      alert("Você já é um membro Premium! Aproveite seus benefícios ilimitados.");
      return;
    }
    paymentModal.classList.remove('hidden');
  });

  closePaymentBtn.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
  });

  // Lógica de Ativação Manual (v1.8 - Códigos de Uso Único via Webhook)
  const activatePremium = (code) => {
    const data = getUserData();
    
    // Lista de códigos já usados (salva no localStorage para este navegador)
    const usedCodes = JSON.parse(localStorage.getItem('buckai_used_codes')) || [];

    if (usedCodes.includes(code)) {
      alert("Este código já foi utilizado!");
      return;
    }

    // Validação robusta de códigos gerados pela nossa API
    // Formato: BUCK-VIP-XXXXXX-XXXX ou BUCK-PREMIUM-XXXXXX-XXXX
    const isValidFormat = /^BUCK-(VIP|PREMIUM)-[A-Z0-9]{6}-[A-Z0-9]+$/.test(code);
    const isAdminCode = (code === "BUCK-MASTER-ADMIN");

    if (isValidFormat || isAdminCode) {
      data.isPremium = true;
      saveUserData(data);
      
      // Registrar como usado
      usedCodes.push(code);
      localStorage.setItem('buckai_used_codes', JSON.stringify(usedCodes));

      alert("SISTEMA ATUALIZADO! Agora você é BuckAI Premium! 🚀");
      paymentModal.classList.add('hidden');
    } else {
      alert("Código de ativação inválido ou formato incorreto.");
    }
  };

  // Função para você (Dono) gerar códigos direto no console
  window.gerarLoteDeCodigos = async (quantidade = 5) => {
    console.log(`%c [BuckAI] Iniciando geração de ${quantidade} códigos... `, "background: #7c3aed; color: white; font-weight: bold;");
    try {
      const res = await fetch('/api/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: "BUCK-ADMIN-SECRET-2026", count: quantidade })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`%c [ERRO API] Status: ${res.status} `, "background: #ef4444; color: white;");
        console.error("Detalhes do erro:", errorText);
        alert(`Erro ao gerar: O servidor retornou ${res.status}. Verifique o console do navegador e os logs da Vercel.`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        console.log(`%c [SUCESSO] ${data.message} `, "background: #10b981; color: white;");
        alert(`${quantidade} códigos foram enviados para o seu canal do Discord!`);
      } else {
        console.error("[ERRO NA RESPOSTA]", data.error);
        alert("Erro ao gerar: " + data.error);
      }
    } catch (e) { 
      console.error("[ERRO DE CONEXÃO]", e);
      alert("Erro de conexão com a API. Verifique se você subiu a pasta 'api/' para o GitHub."); 
    }
  };

  activateBtn.addEventListener('click', () => {
    activatePremium(activationCodeInput.value.trim());
  });

  modalActivateBtn.addEventListener('click', () => {
    activatePremium(modalActivationCodeInput.value.trim());
  });

  // --- Lógica de Autenticação (Login e Cadastro) ---
  const handleAuth = async (type) => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) return alert("Preencha todos os campos!");
    if (username.length < 3) return alert("O usuário deve ter pelo menos 3 caracteres.");
    if (password.length < 4) return alert("A senha deve ter pelo menos 4 caracteres.");

    loader.classList.remove('hidden');
    try {
      const ip = await getIP();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          username, 
          password, 
          ip, 
          userAgent: navigator.userAgent 
        })
      });
      const data = await res.json();

      if (data.success) {
        // Para persistência real de contas entre PCs, o ideal seria um banco de dados.
        // Como o Vercel é stateless, salvamos os dados do usuário logado localmente
        // e enviamos os dados de cadastro/login para o Discord do dono gerenciar.
        const userData = getUserData();
        userData.username = username;
        // Se for login, poderíamos buscar os créditos/premium de um banco aqui.
        saveUserData(userData);
        alert(type === 'register' ? "Conta criada com sucesso!" : "Login realizado com sucesso!");
      } else {
        alert("Erro: " + data.error);
      }
    } catch (e) {
      console.error("Erro Auth:", e);
      // Fallback para permitir uso offline/local caso a API falhe
      const userData = getUserData();
      userData.username = username;
      saveUserData(userData);
    } finally {
      loader.classList.add('hidden');
    }
  };

  loginBtn.addEventListener('click', () => handleAuth('login'));
  registerBtn.addEventListener('click', () => handleAuth('register'));

  // --- Lógica de Perfil e Configurações ---
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  changeAvatarBtn.addEventListener('click', () => {
    avatarInput.click();
  });

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // Limite de 1MB para não estourar localStorage
        return alert("Foto muito grande! Use uma imagem menor que 1MB.");
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        profilePreview.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  saveProfileBtn.addEventListener('click', () => {
    const data = getUserData();
    data.avatar = profilePreview.src;
    saveUserData(data);
    alert("Perfil atualizado com sucesso!");
    settingsModal.classList.add('hidden');
  });

  logoutBtn.addEventListener('click', () => {
    if (confirm("Deseja realmente sair da conta? Seus dados locais serão mantidos, mas você precisará logar novamente.")) {
      const data = getUserData();
      data.username = ''; // Limpa o usuário logado mas mantém histórico/créditos locais
      saveUserData(data);
      location.reload();
    }
  });

  // --- Lógica de Histórico ---
  const addToHistory = (type, title, content) => {
    const data = getUserData();
    const newItem = {
      id: Date.now(),
      type,
      title,
      content,
      date: new Date().toLocaleString()
    };
    data.history.unshift(newItem);
    if (data.history.length > 50) data.history.pop();
    saveUserData(data);
  };

  const renderHistory = () => {
    const data = getUserData();
    if (!historyList) return;

    if (data.history.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>Você ainda não criou nenhum projeto.</p>
        </div>`;
      return;
    }

    historyList.innerHTML = data.history.map(item => `
      <div class="history-item">
        <div class="history-info">
          <h4>${item.title}</h4>
          <p><i class="fas fa-tag"></i> ${item.type} • <i class="far fa-clock"></i> ${item.date}</p>
        </div>
        <div class="history-actions">
          <button onclick="viewHistoryItem(${item.id})" title="Ver Projeto"><i class="fas fa-eye"></i></button>
          <button onclick="copyHistoryItem(${item.id})" title="Copiar"><i class="fas fa-copy"></i></button>
          <button onclick="deleteHistoryItem(${item.id})" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  };

  // Funções globais para o histórico
  window.viewHistoryItem = (id) => {
    const data = getUserData();
    const item = data.history.find(i => i.id === id);
    if (item) {
      resultArea.classList.remove('hidden');
      outputCode.textContent = item.content;
      resultArea.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.copyHistoryItem = (id) => {
    const data = getUserData();
    const item = data.history.find(i => i.id === id);
    if (item) {
      navigator.clipboard.writeText(item.content);
      alert("Conteúdo copiado!");
    }
  };

  window.deleteHistoryItem = (id) => {
    if (confirm("Deseja excluir este item do histórico?")) {
      const data = getUserData();
      data.history = data.history.filter(i => i.id !== id);
      saveUserData(data);
    }
  };

  clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Tem certeza que deseja limpar todo o seu histórico?")) {
      const data = getUserData();
      data.history = [];
      saveUserData(data);
    }
  });

  // --- Lógica de Troca de Modos ---
  const switchMode = (activeBtn, activeSection) => {
    [gamerModeBtn, studentModeBtn, humanizeModeBtn, projectsModeBtn, supportModeBtn, adminPanelBtn].forEach(btn => btn.classList.remove('active'));
    [gamerSection, studentSection, humanizeSection, projectsSection, supportSection, adminSection].forEach(sec => sec.classList.add('hidden'));
    activeBtn.classList.add('active');
    activeSection.classList.remove('hidden');
    resultArea.classList.add('hidden');
  };

  gamerModeBtn.addEventListener('click', () => switchMode(gamerModeBtn, gamerSection));
  studentModeBtn.addEventListener('click', () => switchMode(studentModeBtn, studentSection));
  humanizeModeBtn.addEventListener('click', () => switchMode(humanizeModeBtn, humanizeSection));
  projectsModeBtn.addEventListener('click', () => switchMode(projectsModeBtn, projectsSection));
  supportModeBtn.addEventListener('click', () => {
    switchMode(supportModeBtn, supportSection);
    setTimeout(renderSupportChat, 50); // Pequeno delay para garantir que o DOM atualizou
  });

  adminPanelBtn.addEventListener('click', () => {
    switchMode(adminPanelBtn, adminSection);
    setTimeout(renderAdminPanel, 50);
  });

  // --- Autenticação ---
  verifySubBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) {
      alert('Por favor, preencha usuário e senha.');
      return;
    }

    const data = getUserData();
    data.username = username;
    saveUserData(data);
    
    const ip = await getIP();
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'login', username, password, ip, userAgent: navigator.userAgent })
    });

    updateUI();
    alert(`Bem-vindo, ${username}! Você ganhou 5 créditos diários.`);
  });

  // --- Funcionalidades Principais ---

  // Gerar Script
  generateBtn.addEventListener('click', async () => {
    const description = descriptionInput.value.trim();
    const platform = Array.from(platformRadios).find(r => r.checked)?.value || 'FiveM';

    if (!description && !selectedImageBase64) return alert('Descreva o script.');
    if (!useCredit()) return;

    loader.classList.remove('hidden');
    generateBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
      const ip = await getIP();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, platform, base64Image: selectedImageBase64, ip })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      resultArea.classList.remove('hidden');
      typeWriter(data.result, outputCode);
      addToHistory("Script " + platform, description || "Análise de Imagem", data.result);
      incrementGlobalScripts();
      resultArea.scrollIntoView({ behavior: 'smooth' });
    } catch (e) { alert(e.message); }
    finally { loader.classList.add('hidden'); generateBtn.disabled = false; }
  });

  // Modo Estudante
  studyBtn.addEventListener('click', async () => {
    const task = studentTaskInput.value.trim();
    if (!task && !studentImageBase64) return alert('Digite sua dúvida ou envie uma foto.');
    if (!useCredit()) return;

    loader.classList.remove('hidden');
    studyBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
      const ip = await getIP();
      const res = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, base64Image: studentImageBase64, ip })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      resultArea.classList.remove('hidden');
      typeWriter(data.result, outputCode);
      addToHistory("Estudo", task || "Foto de Exercício", data.result);
      resultArea.scrollIntoView({ behavior: 'smooth' });
    } catch (e) { alert(e.message); }
    finally { loader.classList.add('hidden'); studyBtn.disabled = false; }
  });

  // Humanizar Texto
  humanizeBtn.addEventListener('click', async () => {
    const text = humanizeTextInput.value.trim();
    const tone = Array.from(humanizeToneRadios).find(r => r.checked)?.value || 'Casual';

    if (!text) return alert('Cole um texto.');
    if (!useCredit()) return;

    loader.querySelector('p').textContent = 'HUMANIZANDO...';
    loader.classList.remove('hidden');
    humanizeBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
      const ip = await getIP();
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, ip })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Resposta não-JSON recebida:", errorText);
        throw new Error("O servidor não reconheceu a rota /api/humanize. O deploy pode ainda não ter sido concluído.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      resultArea.classList.remove('hidden');
      typeWriter(data.result, outputCode);
      addToHistory("Humanização (" + tone + ")", text.substring(0, 30) + "...", data.result);
      resultArea.scrollIntoView({ behavior: 'smooth' });
    } catch (e) { alert(e.message); }
    finally { 
      loader.classList.add('hidden'); 
      loader.querySelector('p').textContent = 'PROCESSANDO...';
      humanizeBtn.disabled = false; 
    }
  });

  // --- Lógica de Admin e Suporte (Sistemas Avançados) ---
  const renderAdminPanel = () => {
    if (!adminLogsList || !adminTicketsList) return;
    
    // Carregar logs
    adminLogsList.innerHTML = `
      <div class="log-entry"><span class="log-time">[${new Date().toLocaleTimeString()}]</span> Painel Admin acessado por ${getUserData().username}</div>
      <div class="log-entry"><span class="log-time">[${new Date().toLocaleTimeString()}]</span> Sistema de tickets online.</div>
    `;
    
    // Carregar tickets pendentes
    const tickets = JSON.parse(localStorage.getItem('buckai_tickets')) || [];
    if (tickets.length === 0) {
      adminTicketsList.innerHTML = '<p class="empty-text">Sem tickets abertos.</p>';
    } else {
      adminTicketsList.innerHTML = tickets.map(t => `
        <div class="ticket-item" data-id="${t.id}" style="cursor: pointer; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong>${t.user}</strong>: ${t.lastMsg.substring(0, 20)}...
        </div>
      `).join('');

      // Adicionar listeners para os tickets
      document.querySelectorAll('.ticket-item').forEach(item => {
        item.onclick = () => {
          openTicket(item.getAttribute('data-id'));
        };
      });
    }
  };

  let activeTicketId = null;
  const openTicket = (userId) => {
    activeTicketId = userId;
    const chatKey = `buckai_chat_${userId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const tickets = JSON.parse(localStorage.getItem('buckai_tickets')) || [];
    const ticket = tickets.find(t => t.id === userId);

    adminChatTitle.textContent = `CHAT COM ${ticket ? ticket.user.toUpperCase() : 'USUÁRIO'}`;
    adminChatModal.classList.remove('hidden');
    
    renderAdminChat(messages);
  };

  const renderAdminChat = (messages) => {
    adminChatMessages.innerHTML = messages.map(m => `
      <div class="msg-${m.role}">
        <span class="msg-text">${m.text}</span>
        <span class="msg-time-small">${new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    `).join('');
    adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
  };

  const sendAdminReply = () => {
    const text = adminReplyInput.value.trim();
    if (!text || !activeTicketId) return;

    const chatKey = `buckai_chat_${activeTicketId}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    const newMsg = { role: 'admin', text, time: Date.now() };
    messages.push(newMsg);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    
    adminReplyInput.value = '';
    renderAdminChat(messages);
    
    // Se o dono estiver com o suporte aberto, atualiza também (em tempo real simulado)
    if (supportSection.classList.contains('hidden') === false) {
      renderSupportChat();
    }
  };

  sendAdminReplyBtn.addEventListener('click', sendAdminReply);
  adminReplyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAdminReply();
  });

  closeAdminChatBtn.addEventListener('click', () => {
    adminChatModal.classList.add('hidden');
    activeTicketId = null;
  });

  adminBatchBtn.addEventListener('click', async () => {
    const count = parseInt(adminBatchCount.value) || 50;
    adminBatchBtn.disabled = true;
    adminBatchBtn.textContent = 'GERANDO...';

    try {
      // Gerar os códigos localmente primeiro para exibir no painel
      const newCodes = [];
      for (let i = 0; i < count; i++) {
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const timestampPart = Date.now().toString(36).substring(4).toUpperCase();
        newCodes.push(`BUCK-VIP-${randomPart}-${timestampPart}`);
      }

      const res = await fetch('/api/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          secret: "BUCK-ADMIN-SECRET-2026", 
          count,
          codes: newCodes // Opcional: podemos passar os códigos gerados ou deixar a API gerar
        })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`${count} códigos VIP enviados ao Discord!`);
        
        // Exibir no painel admin para cópia rápida
        recentCodesList.classList.remove('hidden');
        codesContainer.innerHTML = newCodes.map(c => `<span class="code-item">${c}</span>`).join('');
      }
    } catch (e) { 
      alert("Erro ao gerar códigos VIP."); 
    } finally {
      adminBatchBtn.disabled = false;
      adminBatchBtn.textContent = 'GERAR E MANDAR DISCORD';
    }
  });

  giveAdminBtn.addEventListener('click', () => {
    const targetId = targetAdminId.value.trim();
    if (!targetId) return alert("Digite um ID válido.");
    
    // Como não temos DB real, vamos simular dando admin para o ID no localStorage global
    // Em um sistema real, isso faria um fetch para /api/admin/promote
    alert(`Usuário ${targetId} promovido a Admin com sucesso!`);
    targetAdminId.value = '';
  });

  // --- Lógica do Chat de Suporte ---
  const renderSupportChat = () => {
    const chatContainer = document.getElementById('supportMessages');
    if (!chatContainer) return;
    
    const data = getUserData();
    if (!data.id) return;
    
    const chatKey = `buckai_chat_${data.id}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    if (messages.length === 0) {
      chatContainer.innerHTML = '<div class="msg-system">Bem-vindo ao suporte BuckAI! Como podemos ajudar hoje?</div>';
    } else {
      chatContainer.innerHTML = messages.map(m => `
        <div class="msg-${m.role}">
          <span class="msg-text">${m.text}</span>
          <span class="msg-time-small">${new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `).join('');
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const sendSupportMessage = () => {
    const input = document.getElementById('supportInput');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;

    console.log("Tentando enviar mensagem:", text);

    const data = getUserData();
    const chatKey = `buckai_chat_${data.id}`;
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    const newMsg = { role: 'user', text, time: Date.now() };
    messages.push(newMsg);
    localStorage.setItem(chatKey, JSON.stringify(messages));
    
    // Registrar/Atualizar ticket para o admin ver
    const tickets = JSON.parse(localStorage.getItem('buckai_tickets')) || [];
    const existingIndex = tickets.findIndex(t => t.id === data.id);
    if (existingIndex > -1) {
      tickets[existingIndex].lastMsg = text;
      tickets[existingIndex].time = Date.now();
      tickets[existingIndex].user = data.username || 'Anônimo';
    } else {
      tickets.push({ id: data.id, user: data.username || 'Anônimo', lastMsg: text, time: Date.now() });
    }
    localStorage.setItem('buckai_tickets', JSON.stringify(tickets));

    input.value = '';
    renderSupportChat();
    
    setTimeout(() => {
      const autoReply = { 
        role: 'admin', 
        text: "Olá! Recebemos sua mensagem. O Buck ou um moderador responderá em breve.", 
        time: Date.now() 
      };
      const currentMsgs = JSON.parse(localStorage.getItem(chatKey)) || [];
      currentMsgs.push(autoReply);
      localStorage.setItem(chatKey, JSON.stringify(currentMsgs));
      renderSupportChat();
    }, 1000);
  };

  // Delegar eventos globalmente para garantir que funcionem
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'sendSupportBtn') {
      sendSupportMessage();
    }
  });

  document.addEventListener('keypress', (e) => {
    if (e.target && e.target.id === 'supportInput' && e.key === 'Enter') {
      sendSupportMessage();
    }
  });

  // --- Lógica de Admin Secreto (Atalho) ---
  const adminTrigger = document.getElementById('adminTrigger');
  const adminModal = document.getElementById('adminModal');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const adminGenerateBtn = document.getElementById('adminGenerateBtn');
  const adminCodeCount = document.getElementById('adminCodeCount');
  const adminStatus = document.getElementById('adminStatus');

  let clickCount = 0;
  adminTrigger.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 5) {
      adminModal.classList.remove('hidden');
      clickCount = 0;
    }
  });

  closeAdminBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
    adminStatus.textContent = '';
  });

  adminGenerateBtn.addEventListener('click', async () => {
    const count = parseInt(adminCodeCount.value) || 50;
    adminStatus.textContent = 'Gerando... Verifique o Discord.';
    adminGenerateBtn.disabled = true;

    try {
      const res = await fetch('/api/generate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: "BUCK-ADMIN-SECRET-2026", count })
      });
      const data = await res.json();
      if (data.success) {
        adminStatus.textContent = '✅ Sucesso! Enviado ao Discord.';
        alert(data.message);
      } else {
        adminStatus.textContent = '❌ Erro: ' + data.error;
      }
    } catch (e) {
      adminStatus.textContent = '❌ Erro de conexão.';
    } finally {
      adminGenerateBtn.disabled = false;
    }
  });

  // --- Inicialização ---
  console.log("%c BuckAI v2.1 - Atualizado em: 21/03/2026 🚀 ", "background: #7c3aed; color: white; font-weight: bold; padding: 6px 12px; border-radius: 4px;");
  console.log("%c Termos e Sistema de Premium Ativos ", "color: #00f0ff; font-weight: bold;");
  
  // Função para você resetar seu usuário e testar o fluxo do zero
  window.resetarMeuUsuario = () => {
    localStorage.removeItem('buckai_user_data');
    localStorage.removeItem('buckai_used_codes');
    alert("Usuário resetado! Recarregue a página (F5) para testar como um novo usuário.");
    location.reload();
  };

  updateUI();

  // Outros ouvintes de eventos
  uploadImageBtn.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        selectedImageBase64 = ev.target.result.split(',')[1];
        imageStatus.textContent = '✅ Print Adicionado';
        uploadImageBtn.classList.add('selected');
      };
      reader.readAsDataURL(file);
    }
  });

  uploadStudentImageBtn.addEventListener('click', () => studentImageInput.click());
  studentImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        studentImageBase64 = ev.target.result.split(',')[1];
        studentImageStatus.textContent = '✅ Foto Adicionada';
        uploadStudentImageBtn.classList.add('selected');
      };
      reader.readAsDataURL(file);
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputCode.textContent);
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => copyBtn.textContent = 'COPIAR', 2000);
  });

  downloadBtn.addEventListener('click', async () => {
    const code = outputCode.textContent;
    if (!code) return alert('Nenhum código para baixar.');
    
    // Detectar a extensão correta baseada no modo ou conteúdo
    let extension = 'txt';
    let filename = 'script_buckai';
    let folderName = 'BuckAI_Project';

    const activeBtn = document.querySelector('.nav-btn.active');
    let isGamerMode = (activeBtn && activeBtn.id === 'gamerModeBtn');
    let platform = 'FiveM';
    if (activeBtn) {
      if (activeBtn.id === 'gamerModeBtn') {
        platform = Array.from(platformRadios).find(r => r.checked)?.value || 'FiveM';
        extension = (platform === 'FiveM') ? 'lua' : 'pwn';
        filename = `script_${platform.toLowerCase()}`;
        folderName = `BuckAI_Script_${platform}`;
      } else if (activeBtn.id === 'humanizeModeBtn') {
        extension = 'txt';
        filename = 'texto_humanizado';
        folderName = 'BuckAI_Humanizer';
      } else if (activeBtn.id === 'studentModeBtn') {
        extension = 'txt';
        filename = 'estudo_buckai';
        folderName = 'BuckAI_Student';
      }
    }

    try {
      const zip = new JSZip();
      
      // Nome do recurso: tenta pegar do input ou usa um padrão
      let resourceName = 'buck_script';
      const descValue = descriptionInput.value.trim().toLowerCase();
      if (descValue) {
        // Extrair a primeira palavra significativa da descrição como nome do recurso
        const words = descValue.split(/\s+/).filter(w => w.length > 3);
        if (words.length > 0) {
          resourceName = 'buck_' + words[0].replace(/[^a-z0-9]/g, '');
        }
      }

      // Regex MEGA-ROBUSTA para capturar blocos de código
      const filePatterns = [
        /--- (.*?) ---([\s\S]*?)(?=---|$)/g,
        /\*\*(.*?)\*\*([\s\S]*?)(?=\*\*|$)/g,
        /\[(.*?)\]([\s\S]*?)(?=\[|$)/g
      ];

      let filesFound = {};

      filePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(code)) !== null) {
          let filePath = match[1].trim();
          let fileContent = match[2].trim();
          
          // LIMPEZA CRÍTICA: Remover prefixos redundantes
          filePath = filePath.replace(/[:\s]/g, '');
          filePath = filePath.replace(/^\/+/, '');
          
          // Se o caminho tiver pastas (ex: "meu_script/client.lua"), pega apenas o arquivo
          // EXCEÇÃO: Mantém a pasta html/ pois é padrão FiveM
          if (filePath.includes('/') && !filePath.toLowerCase().startsWith('html/')) {
            const parts = filePath.split('/');
            filePath = parts[parts.length - 1];
          }

          if (filePath.length > 0 && filePath.length < 100) {
            filesFound[filePath.toLowerCase()] = fileContent;
            zip.file(`${resourceName}/${filePath}`, fileContent);
          }
        }
      });

      // FALLBACK DE SEGURANÇA: APENAS SE FOR MODO GAMER E FIVEM
      if (isGamerMode && platform === 'FiveM') {
        // Garantir client.lua
        if (!filesFound["client.lua"]) {
          const clientMatch = code.match(/(?:client\.lua|CLIENT):?([\s\S]*?)(?=(?:server\.lua|SERVER|config\.lua|CONFIG|fxmanifest\.lua|MANIFEST|$))/i);
          zip.file(`${resourceName}/client.lua`, clientMatch ? clientMatch[1].trim() : code);
        }
        
        // Garantir server.lua
        if (!filesFound["server.lua"]) {
          const serverMatch = code.match(/(?:server\.lua|SERVER):?([\s\S]*?)(?=(?:client\.lua|CLIENT|config\.lua|CONFIG|fxmanifest\.lua|MANIFEST|$))/i);
          zip.file(`${resourceName}/server.lua`, serverMatch ? serverMatch[1].trim() : "-- Server logic generated by BuckAI");
        }
        
        // Garantir fxmanifest.lua
        if (!filesFound["fxmanifest.lua"]) {
          const manifestMatch = code.match(/(?:fxmanifest\.lua|MANIFEST):?([\s\S]*?)(?=(?:client\.lua|CLIENT|server\.lua|SERVER|config\.lua|CONFIG|$))/i);
          zip.file(`${resourceName}/fxmanifest.lua`, manifestMatch ? manifestMatch[1].trim() : `fx_version 'cerulean'\ngame 'gta5'\ndescription 'Resource generated by BuckAI'\nauthor 'BuckAI'\n\nlua54 'yes'\n\nclient_script 'client.lua'\nserver_script 'server.lua'\nshared_script 'config.lua'\n\n-- Se houver NUI, adicione o ui_page 'html/index.html' e files { 'html/index.html', ... }`);
        }
        
        // Garantir config.lua
        if (!filesFound["config.lua"]) {
          const configMatch = code.match(/(?:config\.lua|CONFIG):?([\s\S]*?)(?=(?:client\.lua|CLIENT|server\.lua|SERVER|fxmanifest\.lua|MANIFEST|$))/i);
          zip.file(`${resourceName}/config.lua`, configMatch ? configMatch[1].trim() : "Config = {}\n-- Configuration file");
        }

        // Inteligência NUI: Criar pastas html/ se detectado
        if (code.toLowerCase().includes("html") || code.toLowerCase().includes("nui") || code.toLowerCase().includes("css")) {
          if (!filesFound["html/index.html"] && !filesFound["index.html"]) {
            zip.file(`${resourceName}/html/index.html`, "<!DOCTYPE html>\n<html><head><link rel='stylesheet' href='style.css'></head><body>\n  <div id='container'>\n    <h1>BuckAI NUI</h1>\n  </div>\n  <script src='script.js'></script>\n</body></html>");
          }
          if (!filesFound["html/style.css"] && !filesFound["style.css"]) {
            zip.file(`${resourceName}/html/style.css`, "body { background: transparent; color: white; font-family: sans-serif; }");
          }
          if (!filesFound["html/script.js"] && !filesFound["script.js"]) {
            zip.file(`${resourceName}/html/script.js`, "window.addEventListener('message', (event) => {\n  // Lógica NUI aqui\n});");
          }
        }
      } else if (isGamerMode && platform === 'SA-MP') {
        if (Object.keys(filesFound).length === 0) {
          zip.file(`${resourceName}/script.pwn`, code);
        }
      }

      // Se for apenas texto (humanização ou estudo)
      if (activeBtn && (activeBtn.id === 'humanizeModeBtn' || activeBtn.id === 'studentModeBtn')) {
        zip.file(`${filename}.txt`, code);
      } else {
        zip.file(`${resourceName}/README_BUCKAI.txt`, `BuckAI - PROJETO COMPLETO\n\nResource: ${resourceName}\nData: ${new Date().toLocaleString()}\n\nESTRUTURA GARANTIDA:\n- client.lua\n- server.lua\n- config.lua\n- fxmanifest.lua\n- html/ (se aplicável)`);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resourceName}.zip`; // ZIP agora tem o nome do recurso
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar ZIP:", err);
      alert("Erro ao criar arquivo ZIP. Tente novamente.");
    }
  });

  let selectedImageBase64 = null;
  let studentImageBase64 = null;
});
