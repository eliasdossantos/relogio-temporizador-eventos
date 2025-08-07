<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Controle</title>
  <link rel="stylesheet" href="css/remote-styles.css" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
    rel="stylesheet" />
</head>

<body>
  <div class="remote-container">
    <!-- Display do Tempo -->
    <div class="timer-display-remote">
      <span id="remoteMinutes" class="timer-number">00</span>
      <span class="time-separator">:</span>
      <span id="remoteSeconds" class="timer-number">00</span>
    </div>

    <!-- Status -->
    <div class="status-display">
      <span id="remoteStatus">Parado</span>
    </div>

    <!-- Input de Tempo -->
    <div class="input-section">
      <input type="text" id="remoteTimerInput" placeholder="05:30" maxlength="5" />
    </div>

    <!-- Controles Principais -->
    <div class="main-controls">
      <button id="remoteStartBtn" class="control-btn primary">
        <span>Iniciar</span>
      </button>
      <button id="remotePauseBtn" class="control-btn secondary">
        <span>Pausar</span>
      </button>
    </div>

    <!-- Controles Secundários -->
    <div class="secondary-controls">
      <button id="remoteResumeBtn" class="control-btn tertiary">
        <span>Continuar</span>
      </button>
      <button id="remoteResetBtn" class="control-btn tertiary">
        <span>Zerar</span>
      </button>
    </div>

    <!-- Presets -->
    <div class="preset-section preset-menu-section">
      <div class="preset-buttons">
        <button class="preset-btn" data-name="Avisos">
          <span class="preset-name">Avisos</span>
          <span class="preset-time">15 min</span>
        </button>
        <button class="preset-btn" data-name="Louvor">
          <span class="preset-name">Louvor</span>
          <span class="preset-time">25 min</span>
        </button>
        <button class="preset-btn" data-name="Ministração">
          <span class="preset-name">Ministração</span>
          <span class="preset-time">50 min</span>
        </button>
      </div>
    </div>

    <!-- Indicador de Conexão -->
    <div class="connection-indicator" id="connectionStatus">
      <div class="connection-dot"></div>
    </div>
  </div>

  <script src="js/remote-script.js"></script>
</body>

</html>