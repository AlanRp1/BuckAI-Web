document.addEventListener('DOMContentLoaded', () => {
  const activeNowEl = document.getElementById('activeNow');
  const totalScriptsEl = document.getElementById('totalScripts');
  const totalClientsEl = document.getElementById('totalClients');

  // Configuração do Socket.io para estatísticas em tempo real
  let socket = null;
  if (typeof io !== 'undefined') {
    socket = io();
    
    // Atualizar estatísticas via Socket.io
    socket.on('updateStats', (stats) => {
      if (stats.activeNow !== undefined) activeNowEl.textContent = stats.activeNow;
      if (stats.totalScripts !== undefined) totalScriptsEl.textContent = stats.totalScripts;
      if (stats.totalClients !== undefined) totalClientsEl.textContent = stats.totalClients;
    });
  }

  // Buscar estatísticas iniciais
  fetch('/stats')
    .then(res => res.json())
    .then(stats => {
      activeNowEl.textContent = stats.activeNow;
      totalScriptsEl.textContent = stats.totalScripts;
      totalClientsEl.textContent = stats.totalClients;
    });

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

  // Verificar se o usuário já "logou" nesta sessão
  const isSubscribed = sessionStorage.getItem('isSubscribed');
  if (!isSubscribed) {
    lockScreen.classList.remove('hidden');
  }

  // Lógica de Desbloqueio e Login (Simulado para Web)
  verifySubBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username || !password) {
      alert('Por favor, crie um usuário e uma senha para continuar.');
      return;
    }

    try {
      const response = await fetch('/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        sessionStorage.setItem('isSubscribed', 'true');
        lockScreen.classList.add('hidden');
        alert(`Conta criada com sucesso! Bem-vindo, ${username}.`);
      }
    } catch (error) {
      alert('Erro ao verificar inscrição.');
    }
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

  // Download ZIP via Backend
  downloadBtn.addEventListener('click', async () => {
    const code = outputCode.textContent;
    const platform = getSelectedPlatform();

    if (!code) return;

    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Zipando...';

    try {
      const response = await fetch('/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, platform })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BuckAI_Script_${platform}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        throw new Error('Erro ao gerar ZIP');
      }
    } catch (error) {
      alert('Erro ao baixar ZIP: ' + error.message);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Baixar .ZIP';
    }
  });

  // Gerar Script via Backend
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
      const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          platform, 
          base64Image: selectedImageBase64 
        })
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

    } catch (error) {
      console.error('Erro ao gerar script:', error);
      alert('Ocorreu um erro: ' + error.message);
    } finally {
      loader.classList.add('hidden');
      generateBtn.disabled = false;
    }
  });

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
    }).catch(err => {
      console.error('Erro ao copiar código:', err);
      alert('Não foi possível copiar o código.');
    });
  });

  fixBtn.addEventListener('click', async () => {
    const code = outputCode.textContent;
    const platform = getSelectedPlatform();
    const errorMsg = prompt("O que está errado ou o que você quer melhorar?");

    if (!code) return;

    loader.querySelector('p').textContent = 'Corrigindo seu script...';
    loader.classList.remove('hidden');
    fixBtn.disabled = true;

    try {
      const response = await fetch('/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, platform, errorMsg })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      typeWriter(data.result, outputCode);

    } catch (error) {
      console.error('Erro ao corrigir script:', error);
      alert('Erro ao corrigir: ' + error.message);
    } finally {
      loader.classList.add('hidden');
      loader.querySelector('p').textContent = 'Codificando seu script...';
      fixBtn.disabled = false;
    }
  });
});

