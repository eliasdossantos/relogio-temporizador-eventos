<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Relógio & Temporizador</title>
  <link rel="stylesheet" href="css/styles.css" />

  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
    rel="stylesheet" />
</head>

<body>
  <!-- Menu Hambúrguer -->
  <button class="menu-toggle" id="menuToggle">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>

  <!-- Menu Dropdown -->
  <div class="menu-dropdown" id="menuDropdown">
    <!-- Configurações -->
    <div class="config-menu-section">
      <span class="config-menu-title">Personalização</span>
      <!-- Cor do Texto -->
      <div class="config-item">
        <label class="config-label">Cor do Relógio</label><br><br>
        <div class="color-options">
          <button class="text-color-btn active" data-color="white" style="background: #ffffff;" title="Branco"></button>
          <button class="text-color-btn" data-color="yellow" style="background: #ffff00;" title="Amarelo"></button>
          <button class="text-color-btn" data-color="cyan" style="background: #00ffff;" title="Ciano"></button>
          <button class="text-color-btn" data-color="lime" style="background: #00ff00;" title="Verde Limão"></button>
          <button class="text-color-btn" data-color="orange" style="background: #ffa500;" title="Laranja"></button>
        </div>
      </div>
    </div>
    <button id="clockBtn" class="menu-btn active">Relógio</button>
    <button id="timerBtn" class="menu-btn">Temporizador</button>
    <button id="remoteBtn" class="remote-btn">Controle Remoto</button>

    <!-- Separador -->
    <div class="menu-separator"></div>

    <!-- Presets -->
    <div class="preset-menu-section">
      <span class="preset-menu-title">Tempos Rápidos</span>
      <button class="preset-menu-btn" data-time="15:00" data-name="Avisos">
        <span class="preset-menu-name">Avisos</span>
        <span class="preset-menu-time">15 min</span>
      </button>
      <button class="preset-menu-btn" data-time="25:00" data-name="Louvor">
        <span class="preset-menu-name">Louvor</span>
        <span class="preset-menu-time">25 min</span>
      </button>
      <button
        class="preset-menu-btn"
        data-time="50:00"
        data-name="Ministração">
        <span class="preset-menu-name">Ministração</span>
        <span class="preset-menu-time">50 min</span>
      </button>
    </div>
  </div>

  <!-- Container Principal -->
  <main class="main-container">
    <!-- Seção do Relógio -->
    <section id="clockSection" class="section active">
      <div class="time-display">
        <div class="time-unit">
          <span id="hours" class="time-number">21</span>
          <span class="time-label">Horas</span>
        </div>
        <div class="time-unit">
          <span id="minutes" class="time-number">29</span>
          <span class="time-label">Minutos</span>
        </div>
        <div class="time-unit">
          <span id="seconds" class="time-number">28</span>
          <span class="time-label">Segundos</span>
        </div>
      </div>
    </section>

    <!-- Seção do Temporizador -->
    <section id="timerSection" class="section">
      <div class="timer-container">
        <div class="timer-display">
          <div class="time-unit">
            <span id="timerMinutes" class="time-number">00</span>
            <span class="time-label">Minutos</span>
          </div>
          <div class="time-unit">
            <span id="timerSeconds" class="time-number">00</span>
            <span class="time-label">Segundos</span>
          </div>
        </div>

        <div class="timer-status-display">
          <span id="timerStatus">Aguardando controle remoto...</span>
        </div>
      </div>
    </section>
  </main>

  <script src="js/script.js"></script>
</body>

</html>