// TEMPOS CONFIGURÁVEIS
const TEMPOS_PRESETS = {
  Avisos: "15:00",
  Louvor: "25:00",
  Ministração: "50:00",
};

class RemoteControl {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.setupTimerInput();
    this.setupWindowCommunication();
    this.setupCustomization();

    // Sinalizar que a janela remota está pronta
    setTimeout(() => {
      this.signalReady();
    }, 100);
  }

  initializeElements() {
    // Display elements
    this.remoteMinutesEl = document.getElementById("remoteMinutes");
    this.remoteSecondsEl = document.getElementById("remoteSeconds");
    this.remoteStatusEl = document.getElementById("remoteStatus");
    this.connectionStatusEl = document.getElementById("connectionStatus");

    // Input
    this.remoteTimerInputEl = document.getElementById("remoteTimerInput");

    // Control buttons
    this.remoteStartBtn = document.getElementById("remoteStartBtn");
    this.remotePauseBtn = document.getElementById("remotePauseBtn");
    this.remoteResumeBtn = document.getElementById("remoteResumeBtn");
    this.remoteResetBtn = document.getElementById("remoteResetBtn");

    // Preset buttons
    this.presetButtons = document.querySelectorAll(".preset-btn");
  }

  initializeEventListeners() {
    // Control buttons
    this.remoteStartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Botão Iniciar clicado");
      this.startTimer();
    });

    this.remotePauseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Botão Pausar clicado");
      this.sendCommand("PAUSE");
    });

    this.remoteResumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Botão Continuar clicado");
      this.sendCommand("RESUME");
    });

    this.remoteResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Botão Zerar clicado");
      this.sendCommand("RESET");
    });

    // Preset buttons
    this.presetButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = btn.dataset.name;
        const time = TEMPOS_PRESETS[name]; // agora pega da variável
        if (!time) {
          alert(`Tempo não configurado para ${name}`);
          return;
        }
        console.log(`Preset ${name} clicado: ${time}`);
        this.startPresetTimer(time, name);
      });
    });
  }

  setupTimerInput() {
    this.remoteTimerInputEl.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito

      // Limita a 4 dígitos (MMSS)
      if (value.length > 4) {
        value = value.substring(0, 4);
      }

      // Formata com os dois pontos
      if (value.length > 2) {
        const minutes = value.substring(0, 2);
        let seconds = value.substring(2);

        // Corrige segundos para máximo 59
        if (seconds > 59) {
          seconds = "59";
        }

        e.target.value = `${minutes}:${seconds}`;
      } else if (value.length > 0) {
        e.target.value = value;
      } else {
        e.target.value = "";
      }
    });

    // Permite apagar os dois pontos
    this.remoteTimerInputEl.addEventListener("keydown", (e) => {
      if (
        e.key === "Backspace" &&
        this.remoteTimerInputEl.selectionStart ===
          this.remoteTimerInputEl.value.indexOf(":") + 1
      ) {
        const value = this.remoteTimerInputEl.value.replace(/\D/g, "");
        this.remoteTimerInputEl.value = value.substring(0, value.length - 1);
        e.preventDefault();
      }
    });

    this.remoteTimerInputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.startTimer();
      }
    });
  }

  setupWindowCommunication() {
    // Listen for messages from parent window
    window.addEventListener("message", (event) => {
      console.log("Mensagem recebida no popup:", event.data);

      if (event.data.type === "TIMER_STATE") {
        this.updateDisplay(event.data);
      } else if (event.data.type === "SET_PRESET") {
        // Nova funcionalidade: receber preset do menu principal
        console.log("Recebendo preset do menu:", event.data);
        this.setPresetFromMenu(event.data.time, event.data.name);
      }
    });

    // Check connection status
    this.checkConnection();
    setInterval(() => this.checkConnection(), 3000);

    // Solicitar estado periodicamente se não receber
    setInterval(() => {
      this.requestInitialState();
    }, 5000);
  }

  // ← NOVA FUNÇÃO
  applyCustomization(customization) {
    // Aplicar cor de fundo
    if (customization.background) {
      document.body.className = document.body.className.replace(/bg-\w+/g, "");
      document.body.classList.add(`bg-${customization.background}`);
    }

    // Aplicar cor do texto
    if (customization.textColor) {
      const timerNumbers = document.querySelectorAll(".timer-number");
      timerNumbers.forEach((el) => {
        el.className = el.className.replace(/text-\w+/g, "");
        el.classList.add(`text-${customization.textColor}`);
      });
    }
  }

  // Nova função para definir preset recebido do menu principal
  setPresetFromMenu(time, name) {
    console.log(
      `Definindo preset ${name} com tempo ${time} no controle remoto...`
    );

    // Preencher o campo de input
    this.remoteTimerInputEl.value = time;

    // Atualizar o status
    this.updateStatus(`${name} selecionado - Pronto para iniciar`);

    // Destacar visualmente que está pronto
    this.remoteTimerInputEl.style.borderColor = "rgba(76, 175, 80, 0.5)";
    this.remoteTimerInputEl.style.background = "rgba(76, 175, 80, 0.1)";

    // Remover destaque após alguns segundos
    setTimeout(() => {
      this.remoteTimerInputEl.style.borderColor = "rgba(255, 255, 255, 0.1)";
      this.remoteTimerInputEl.style.background = "rgba(255, 255, 255, 0.05)";
    }, 3000);

    console.log("Preset definido no controle remoto:", {
      input: this.remoteTimerInputEl.value,
      status: this.remoteStatusEl.textContent,
    });
  }

  signalReady() {
    console.log("Sinalizando que janela remota está pronta...");
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "REMOTE_READY" }, "*");
    }
  }

  requestInitialState() {
    console.log("Solicitando estado inicial...");
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "REQUEST_STATE" }, "*");
    }
  }

  startTimer() {
    const timeValue = this.remoteTimerInputEl.value.trim();

    if (!timeValue || !timeValue.includes(":")) {
      alert("Digite um tempo válido (MM:SS)");
      this.remoteTimerInputEl.focus();
      return;
    }

    const [minutesStr, secondsStr] = timeValue.split(":");
    let minutes = parseInt(minutesStr, 10);
    let seconds = parseInt(secondsStr, 10);

    // Corrige valores inválidos
    if (isNaN(minutes)) minutes = 0;
    if (isNaN(seconds)) seconds = 0;

    // Limita os valores
    minutes = Math.min(99, Math.max(0, minutes));
    seconds = Math.min(59, Math.max(0, seconds));

    if (minutes === 0 && seconds === 0) {
      alert("Defina um tempo maior que zero");
      this.remoteTimerInputEl.focus();
      return;
    }

    // Formata corretamente para enviar
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    console.log("Enviando comando START com tempo:", formattedTime);
    this.sendCommand("START", formattedTime);
  }

  sendCommand(action, time = null) {
    const command = {
      type: "TIMER_CONTROL",
      action: action,
    };

    if (time) {
      command.time = time;
    }

    console.log("Enviando comando:", command);

    // Send to parent window
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(command, "*");
      console.log("Comando enviado com sucesso");
    } else {
      console.log("ERRO: Janela pai não encontrada");
      alert("Conexão perdida com a janela principal");
    }
  }

  startPresetTimer(time, name) {
    this.remoteTimerInputEl.value = time;
    this.updateStatus(`Iniciando ${name}...`);
    this.sendCommand("START", time);
  }

  updateDisplay(state) {
    console.log("Atualizando display do popup com estado:", state);

    const minutes = Math.floor(state.totalSeconds / 60);
    const seconds = state.totalSeconds % 60;

    // ATUALIZAR O DISPLAY DO TEMPO NO POPUP
    this.remoteMinutesEl.textContent = minutes.toString().padStart(2, "0");
    this.remoteSecondsEl.textContent = seconds.toString().padStart(2, "0");

    console.log("Display atualizado:", {
      minutes: this.remoteMinutesEl.textContent,
      seconds: this.remoteSecondsEl.textContent,
    });

    // Update button states
    console.log("Estados:", {
      isRunning: state.isRunning,
      isPaused: state.isPaused,
      totalSeconds: state.totalSeconds,
    });

    // Botão Iniciar: desabilitado quando executando
    this.remoteStartBtn.disabled = state.isRunning;

    // Botão Pausar: habilitado apenas quando executando
    this.remotePauseBtn.disabled = !state.isRunning;

    // Botão Continuar: habilitado apenas quando pausado E tem tempo
    this.remoteResumeBtn.disabled = !state.isPaused || state.totalSeconds <= 0;

    // Botão Zerar: sempre habilitado
    this.remoteResetBtn.disabled = false;

    console.log("Estados dos botões:", {
      start: this.remoteStartBtn.disabled,
      pause: this.remotePauseBtn.disabled,
      resume: this.remoteResumeBtn.disabled,
      reset: this.remoteResetBtn.disabled,
    });

    // Update status
    if (state.isRunning) {
      this.updateStatus("Executando");
    } else if (state.isPaused) {
      this.updateStatus("Pausado");
    } else {
      this.updateStatus("Parado");
    }

    // Visual effects for time
    this.remoteMinutesEl.classList.remove("warning", "danger");
    this.remoteSecondsEl.classList.remove("warning", "danger");

    if (state.totalSeconds <= 5 && state.totalSeconds > 0 && state.isRunning) {
      this.remoteMinutesEl.classList.add("danger");
      this.remoteSecondsEl.classList.add("danger");
    } else if (
      state.totalSeconds <= 30 &&
      state.totalSeconds > 5 &&
      state.isRunning
    ) {
      this.remoteMinutesEl.classList.add("warning");
      this.remoteSecondsEl.classList.add("warning");
    }
  }

  updateStatus(status) {
    this.remoteStatusEl.textContent = status;
    console.log("Status do popup atualizado:", status);
  }

  checkConnection() {
    const dot = this.connectionStatusEl.querySelector(".connection-dot");
    if (window.opener && !window.opener.closed) {
      dot.classList.remove("disconnected");
    } else {
      dot.classList.add("disconnected");
    }
  }
}

// Initialize remote control when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando controle remoto...");
  new RemoteControl();
});
