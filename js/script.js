// TEMPOS CONFIGURÁVEIS
const TEMPOS_PRESETS = {
  Avisos: "15:00",
  Louvor: "25:00",
  Ministração: "50:00",
};

class TimerSystem {
  constructor() {
    this.timerInterval = null; //
    this.clockInterval = null; // Intervalo do relógio
    this.totalSeconds = 0; // Tempo total do temporizador em segundos
    this.isRunning = false; // Flag para indicar se o temporizador está em execução
    this.isPaused = false; // Flag para indicar se o temporizador está pausado
    this.isCompleting = false; // Flag para evitar múltiplas execuções de finalização
    this.remoteWindows = []; // Lista para armazenar janelas remotas
    this.initializeElements(); // Inicializa os elementos do DOM
    this.initializeEventListeners(); // Inicializa os ouvintes de eventos
    this.startClock(); // Inicia o relógio
    this.setupWindowCommunication(); // Configura a comunicação entre janelas
    this.setupMenuToggle(); // Configura o menu de navegação
    this.setupCustomization();
  }

  // ← NOVA FUNÇÃO
  setupCustomization() {
    this.loadSettings(); // Carregar configurações salvas

    // Botões de cor de fundo
    const bgButtons = document.querySelectorAll(".color-btn");
    bgButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        bgButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.changeBackground(btn.dataset.bg);
      });
    });

    // Botões de cor do texto
    const textColorButtons = document.querySelectorAll(".text-color-btn");
    textColorButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        textColorButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.changeTextColor(btn.dataset.color);
      });
    });
    // ... mais event listeners ...
  }

  // ← NOVAS FUNÇÕES
  changeBackground(bgColor) {
    document.body.className = document.body.className.replace(/bg-\w+/g, "");
    document.body.classList.add(`bg-${bgColor}`);
    this.saveSettings();
    this.broadcastCustomization(); // Enviar para controle remoto
  }

  changeTextColor(textColor) {
    const timeNumbers = document.querySelectorAll(".time-number");
    timeNumbers.forEach((el) => {
      el.className = el.className.replace(/text-\w+/g, "");
      el.classList.add(`text-${textColor}`);
    });
    this.saveSettings();
    this.broadcastCustomization();
  }

  saveSettings() {
    const settings = {
      background: this.getCurrentBackground(),
      textColor: this.getCurrentTextColor(),
      size: this.getCurrentSize(),
      position: this.getCurrentPosition(),
    };
    localStorage.setItem("timerSettings", JSON.stringify(settings));
  }

  loadSettings() {
    const saved = localStorage.getItem("timerSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      // Aplicar configurações salvas...
    }
  }

  broadcastCustomization() {
    const customization = {
      type: "CUSTOMIZATION_UPDATE",
      background: this.getCurrentBackground(),
      textColor: this.getCurrentTextColor(),
    };

    // Enviar para todas as janelas remotas
    this.remoteWindows.forEach((remoteWindow) => {
      if (remoteWindow && !remoteWindow.closed) {
        remoteWindow.postMessage(customization, "*");
      }
    });
  }

  initializeElements() {
    // Elementos do relógio
    this.hoursEl = document.getElementById("hours");
    this.minutesEl = document.getElementById("minutes");
    this.secondsEl = document.getElementById("seconds");

    // Elementos do temporizador - apenas exibição
    this.timerMinutesEl = document.getElementById("timerMinutes");
    this.timerSecondsEl = document.getElementById("timerSeconds");
    this.timerStatusEl = document.getElementById("timerStatus");

    // Botões do menu
    this.clockBtn = document.getElementById("clockBtn");
    this.timerBtn = document.getElementById("timerBtn");
    this.remoteBtn = document.getElementById("remoteBtn");

    // Seções
    this.clockSection = document.getElementById("clockSection");
    this.timerSection = document.getElementById("timerSection");
  }

  initializeEventListeners() {
    // Menu navigation
    this.clockBtn.addEventListener("click", () => this.showSection("clock"));
    this.timerBtn.addEventListener("click", () =>
      this.openRemoteControlAndSwitchToTimer()
    );
    this.remoteBtn.addEventListener("click", () =>
      this.openRemoteControlAndSwitchToTimer()
    );

    // Preset buttons no menu
    const presetMenuButtons = document.querySelectorAll(".preset-menu-btn");
    presetMenuButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const time = btn.dataset.time;
        const name = btn.dataset.name;
        console.log(`Preset do menu ${name} clicado: ${time}`);
        this.startPresetFromMenu(time, name);
      });
    });
  }

  setupWindowCommunication() {
    window.addEventListener("message", (event) => {
      console.log("Mensagem recebida na janela principal:", event.data);

      if (event.data.type === "TIMER_CONTROL") {
        this.handleRemoteControl(event.data);
      } else if (event.data.type === "REQUEST_STATE") {
        console.log("Estado solicitado, enviando...");
        // Enviar estado imediatamente para a janela que solicitou
        this.sendStateToWindow(event.source);
      } else if (event.data.type === "REMOTE_READY") {
        console.log("Janela remota pronta, enviando estado...");
        this.sendStateToWindow(event.source);
      }
    });
  }

  sendStateToWindow(targetWindow) {
    if (targetWindow && !targetWindow.closed) {
      const state = {
        type: "TIMER_STATE",
        totalSeconds: this.totalSeconds,
        isRunning: this.isRunning,
        isPaused: this.isPaused,
      };
      console.log("Enviando estado para janela específica:", state);
      targetWindow.postMessage(state, "*");
    }
  }

  handleRemoteControl(data) {
    console.log("Processando comando:", data);

    switch (data.action) {
      case "START":
        if (data.time) {
          console.log("Definindo tempo:", data.time);
          this.setTimerTime(data.time);
        }
        console.log("Iniciando temporizador...");
        this.startTimer();
        break;
      case "PAUSE":
        console.log("Pausando temporizador...");
        this.pauseTimer();
        break;
      case "RESUME":
        console.log("Retomando temporizador...");
        this.resumeTimer();
        break;
      case "RESET":
        console.log("Resetando temporizador...");
        this.resetTimer();
        break;
      case "SET_TIME":
        if (data.time) {
          console.log("Apenas definindo tempo:", data.time);
          this.setTimerTime(data.time);
        }
        break;
    }
  }

  setTimerTime(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    this.totalSeconds = minutes * 60 + seconds;
    console.log("Tempo definido:", this.totalSeconds, "segundos");

    // Parar piscar se estiver acontecendo
    this.stopFlashing();

    this.updateTimerDisplay();
    this.broadcastTimerState();
  }

  showSection(section) {
    document
      .querySelectorAll(".menu-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".section")
      .forEach((sec) => sec.classList.remove("active"));

    if (section === "clock") {
      this.clockBtn.classList.add("active");
      this.clockSection.classList.add("active");

      // Parar piscar quando voltar para o relógio
      this.stopFlashing();
    } else if (section === "timer") {
      this.timerBtn.classList.add("active");
      this.timerSection.classList.add("active");
    }
  }

  // Nova função que combina mudança de tela + abertura do controle remoto
  openRemoteControlAndSwitchToTimer() {
    console.log("Abrindo controle remoto e mudando para temporizador...");

    // Primeiro, mudar para a tela do temporizador
    this.showSection("timer");

    // Depois, abrir o controle remoto
    setTimeout(() => {
      this.openRemoteControl();
    }, 100); // Pequeno delay para garantir que a tela mude primeiro
  }

  // Nova função para iniciar preset direto do menu
  startPresetFromMenu(time, name) {
    console.log(`Iniciando preset ${name} com tempo ${time} direto do menu...`);

    // Mudar para a tela do temporizador
    this.showSection("timer");

    // Definir o tempo
    this.setTimerTime(time);

    // Atualizar status
    this.updateStatus(`${name} definido - Pronto para iniciar`);

    // Abrir controle remoto automaticamente
    setTimeout(() => {
      this.openRemoteControl();
    }, 300);

    // Enviar o tempo para o controle remoto quando ele abrir
    setTimeout(() => {
      this.sendPresetToRemote(time, name);
    }, 1500);
  }

  // Nova função para enviar preset específico para o controle remoto
  sendPresetToRemote(time, name) {
    console.log(`Enviando preset ${name} (${time}) para controle remoto...`);

    const presetData = {
      type: "SET_PRESET",
      time: time,
      name: name,
    };

    // Enviar para todas as janelas remotas
    this.remoteWindows.forEach((remoteWindow, index) => {
      if (remoteWindow && !remoteWindow.closed) {
        try {
          remoteWindow.postMessage(presetData, "*");
          console.log(`Preset enviado para janela remota ${index}`);
        } catch (e) {
          console.log("Erro ao enviar preset para janela", index, ":", e);
          this.remoteWindows.splice(index, 1);
        }
      } else {
        this.remoteWindows.splice(index, 1);
      }
    });
  }

  startClock() {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    this.hoursEl.textContent = hours;
    this.minutesEl.textContent = minutes;
    this.secondsEl.textContent = seconds;
  }

  startTimer() {
    if (!this.isRunning && !this.isPaused && this.totalSeconds <= 0) {
      console.log("Erro: Nenhum tempo definido");
      this.updateStatus("Defina um tempo no controle remoto");
      return;
    }

    console.log("Iniciando temporizador com", this.totalSeconds, "segundos");

    this.isRunning = true;
    this.isPaused = false;
    this.updateStatus("Executando");
    this.broadcastTimerState();

    this.timerInterval = setInterval(() => {
      this.totalSeconds--;
      this.updateTimerDisplay();
      this.broadcastTimerState();

      if (this.totalSeconds <= 0) {
        this.timerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    console.log("Pausando temporizador...");

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.isRunning = false;
    this.isPaused = true;
    this.updateStatus("Pausado");
    this.broadcastTimerState();

    console.log("Temporizador pausado. Estado:", {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      totalSeconds: this.totalSeconds,
    });
  }

  resumeTimer() {
    console.log("Retomando temporizador...");

    if (this.isPaused && this.totalSeconds > 0) {
      this.startTimer();
    } else {
      console.log("Não é possível retomar:", {
        isPaused: this.isPaused,
        totalSeconds: this.totalSeconds,
      });
    }
  }

  resetTimer() {
    console.log("Resetando temporizador...");

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.totalSeconds = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.updateTimerDisplay();
    this.updateStatus("Parado");
    this.broadcastTimerState();

    console.log("Temporizador resetado");
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;

    this.timerMinutesEl.textContent = minutes.toString().padStart(2, "0");
    this.timerSecondsEl.textContent = seconds.toString().padStart(2, "0");

    // Efeito visual quando o tempo está acabando
    if (this.totalSeconds <= 10 && this.totalSeconds > 0) {
      this.timerMinutesEl.style.color = "#ff4444";
      this.timerSecondsEl.style.color = "#ff4444";
    } else {
      this.timerMinutesEl.style.color = "#ffffff";
      this.timerSecondsEl.style.color = "#ffffff";
    }
  }

  updateStatus(status) {
    this.timerStatusEl.textContent = status;
    console.log("Status atualizado:", status);
  }

  timerComplete() {
    console.log("Temporizador finalizado!");

    // Evitar múltiplas execuções
    if (this.isCompleting) {
      return;
    }
    this.isCompleting = true;

    this.resetTimer();
    this.updateStatus("Tempo Esgotado!");

    // Piscar números em vermelho em vez da tela
    this.flashTimerNumbers();

    // Notificação do navegador
    if (Notification.permission === "granted") {
      new Notification("Temporizador", {
        body: "O tempo definido foi esgotado!",
        icon: "/favicon.ico",
      });
    }

    // Reset flag após um tempo
    setTimeout(() => {
      this.isCompleting = false;
    }, 1000);
  }

  flashTimerNumbers() {
    // Garantir que só pisca uma vez
    if (this.timerMinutesEl.classList.contains("flashing-red")) {
      return; // Já está piscando, não fazer novamente
    }

    console.log("Iniciando piscar dos números...");

    // Adicionar classe de piscar
    this.timerMinutesEl.classList.add("flashing-red");
    this.timerSecondsEl.classList.add("flashing-red");

    // Piscar 6 vezes (3 segundos)
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      flashCount++;

      if (flashCount % 2 === 1) {
        // Vermelho
        this.timerMinutesEl.style.color = "#ff0000";
        this.timerSecondsEl.style.textShadow = "0 0 20px #ff0000";
        this.timerSecondsEl.style.color = "#ff0000";
        this.timerSecondsEl.style.textShadow = "0 0 20px #ff0000";
      } else {
        // Branco
        this.timerMinutesEl.style.color = "#ffffff";
        this.timerSecondsEl.style.color = "#ffffff";
        this.timerMinutesEl.style.textShadow = "none";
        this.timerSecondsEl.style.textShadow = "none";
      }

      // Parar após 6 piscadas (3 segundos)
      if (flashCount >= 6) {
        clearInterval(flashInterval);

        // Voltar ao estado normal
        this.timerMinutesEl.style.color = "#ffffff";
        this.timerSecondsEl.style.color = "#ffffff";
        this.timerMinutesEl.style.textShadow = "none";
        this.timerSecondsEl.style.textShadow = "none";

        // Remover classe
        this.timerMinutesEl.classList.remove("flashing-red");
        this.timerSecondsEl.classList.remove("flashing-red");

        console.log("Piscar finalizado");
      }
    }, 500); // Piscar a cada 500ms
  }

  stopFlashing() {
    // Parar qualquer piscar em andamento
    this.timerMinutesEl.classList.remove("flashing-red");
    this.timerSecondsEl.classList.remove("flashing-red");

    // Voltar cores normais
    this.timerMinutesEl.style.color = "#ffffff";
    this.timerSecondsEl.style.color = "#ffffff";
    this.timerMinutesEl.style.textShadow = "none";
    this.timerSecondsEl.style.textShadow = "none";

    console.log("Piscar interrompido");
  }

  broadcastTimerState() {
    const state = {
      type: "TIMER_STATE",
      totalSeconds: this.totalSeconds,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
    };

    console.log("Enviando estado para todas as janelas:", state);

    // Enviar para todas as janelas abertas
    this.remoteWindows.forEach((remoteWindow, index) => {
      if (remoteWindow && !remoteWindow.closed) {
        try {
          remoteWindow.postMessage(state, "*");
        } catch (e) {
          console.log("Erro ao enviar para janela", index, ":", e);
          // Remove janela fechada da lista
          this.remoteWindows.splice(index, 1);
        }
      } else {
        // Remove janela fechada da lista
        this.remoteWindows.splice(index, 1);
      }
    });
  }

  openRemoteControl() {
    const remoteWindow = window.open(
      "remote.php",
      "remoteControl",
      "width=400,height=650,scrollbars=no,resizable=no,toolbar=no,menubar=no"
    );

    if (!remoteWindow) {
      alert("Por favor, permita pop-ups para abrir o controle remoto");
      return;
    }

    // Adicionar à lista de janelas remotas
    this.remoteWindows.push(remoteWindow);

    // Enviar estado atual após um delay maior
    setTimeout(() => {
      console.log("Enviando estado inicial para popup...");
      this.sendStateToWindow(remoteWindow);
    }, 1500);
  }

  setupMenuToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const menuDropdown = document.getElementById("menuDropdown");

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle("active");
      menuDropdown.classList.toggle("show");
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuToggle.classList.remove("active");
        menuDropdown.classList.remove("show");
      }
    });

    // Fechar menu ao clicar em um item
    const menuItems = menuDropdown.querySelectorAll(
      ".menu-btn, .remote-btn, .preset-menu-btn"
    );
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        menuDropdown.classList.remove("show");
      });
    });
  }
}

// Solicita permissão para notificações
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

// Inicializa o sistema quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando sistema principal...");
  new TimerSystem();
});
