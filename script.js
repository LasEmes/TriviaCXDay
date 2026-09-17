
/* ==========================================================================
   TRIVIA DIGITAL - CXDAY (MOTOR DE JUEGO MINIMALISTA & DIVERTI-CORPORATIVO)
   ========================================================================== */

// Base de Datos de los 9 Casos Reales del NPS
const ALL_CASES = [
  {
    id: 1,
    comment: "Hace dos semanas solicité una sombrilla y todavía nadie me dio respuesta.",
    prompt: "¿Qué harías?",
    driver: "Materiales y equipos",
    options: [
      { text: "Esperar a que el área de Materiales responda.", isCorrect: false },
      { text: "Confirmar la solicitud, verificar el estado y dar una fecha estimada al cliente.", isCorrect: true },
      { text: "Decirle que vuelva a solicitarla la próxima visita.", isCorrect: false }
    ],
    explanation: "Verificar el estado de la solicitud y comprometer una fecha le da previsibilidad al cliente y resuelve la falta de respuesta."
  },
  {
    id: 2,
    comment: "El camión nunca pasó y me quedé sin mercadería.",
    prompt: "¿Qué harías?",
    driver: "Entrega de productos",
    options: [
      { text: "Esperar al próximo reparto.", isCorrect: false },
      { text: "Consultar el estado del pedido y coordinar una solución inmediata.", isCorrect: true },
      { text: "Indicar que haga nuevamente el pedido.", isCorrect: false }
    ],
    explanation: "Ante un quiebre de stock por fallas de reparto, consultar la situación y coordinar una entrega de emergencia preserva el negocio del cliente."
  },
  {
    id: 3,
    comment: "La aplicación no me deja ingresar pedidos.",
    prompt: "¿Qué harías?",
    driver: "Servicio en línea",
    options: [
      { text: "Decir que pruebe más tarde.", isCorrect: false },
      { text: "Registrar el inconveniente, ofrecer un canal alternativo y hacer seguimiento.", isCorrect: true },
      { text: "Indicar que llame a otro sector.", isCorrect: false }
    ],
    explanation: "No dejamos solo al cliente ante una falla digital: tomamos el reporte, habilitamos la venta por otro canal y acompañamos la resolución."
  },
  {
    id: 4,
    comment: "Hace más de un mes que el vendedor no visita mi comercio.",
    prompt: "¿Qué harías?",
    driver: "Frecuencia de visitas",
    options: [
      { text: "Esperar la próxima ruta.", isCorrect: false },
      { text: "Informar al supervisor comercial para coordinar una visita.", isCorrect: true },
      { text: "Pedirle paciencia.", isCorrect: false }
    ],
    explanation: "Escalar la falta de contacto con la supervisión permite normalizar las visitas y restablecer el vínculo comercial."
  },
  {
    id: 5,
    comment: "Las promociones nunca llegan a mi negocio.",
    prompt: "¿Qué harías?",
    driver: "Promociones / ofertas",
    options: [
      { text: "Explicar que las promociones son iguales para todos.", isCorrect: false },
      { text: "Revisar si cumple las condiciones y explicar claramente las promociones disponibles.", isCorrect: true },
      { text: "Decir que seguramente llegarán más adelante.", isCorrect: false }
    ],
    explanation: "Revisar la situación particular y clarificar los requisitos genera transparencia y ayuda a aprovechar los beneficios."
  },
  {
    id: 6,
    comment: "La factura vino con un importe incorrecto.",
    prompt: "¿Qué harías?",
    driver: "Liquidaciones / Créditos",
    options: [
      { text: "Esperar el próximo cierre.", isCorrect: false },
      { text: "Escalar el caso al área correspondiente y mantener informado al cliente.", isCorrect: true },
      { text: "Pedir que vuelva a llamar.", isCorrect: false }
    ],
    explanation: "Gestionar los ajustes administrativos y mantener informado al cliente evita la incertidumbre y protege la confianza."
  },
  {
    id: 7,
    comment: "La heladera dejó de enfriar.",
    prompt: "¿Qué harías?",
    driver: "EDF",
    options: [
      { text: "Esperar que pase el técnico cuando pueda.", isCorrect: false },
      { text: "Registrar el reclamo y coordinar el servicio técnico.", isCorrect: true },
      { text: "Sugerir que use otra heladera.", isCorrect: false }
    ],
    explanation: "El equipo de frío es crítico para el producto: abrir el reclamo e impulsar la reparación asegura la calidad y exhibición."
  },
  {
    id: 8,
    comment: "El vendedor siempre me atiende excelente.",
    prompt: "¿Qué harías?",
    driver: "Servicio venta presencial",
    options: [
      { text: "No hacer nada.", isCorrect: false },
      { text: "Reconocer el buen desempeño y reforzar la buena práctica.", isCorrect: true },
      { text: "Cerrar el caso sin comentarios.", isCorrect: false }
    ],
    explanation: "Celebrar y reconocer las interacciones positivas refuerza la cultura de excelencia en el servicio en toda la organización."
  },
  {
    id: 9,
    comment: "Compré una promoción, pero en la factura no me aplicaron el descuento.",
    prompt: "¿Qué harías?",
    driver: "Promociones / ofertas",
    options: [
      { text: "Le explico que seguramente el descuento aparecerá en la próxima factura.", isCorrect: false },
      { text: "Verifico la promoción, gestiono el reclamo con el área correspondiente y mantengo informado al cliente sobre el estado de la resolución.", isCorrect: true },
      { text: "Le indico que vuelva a llamar cuando reciba la próxima factura.", isCorrect: false }
    ],
    explanation: "Comprobar la factura, activar el reclamo interno y dar seguimiento constante demuestra compromiso real con el cliente."
  }
];

// Estado de la Aplicación
let currentScreen = 'screen-attract';
let activeGameCases = [];
let currentCaseIndex = 0;
let score = 0;
let correctCount = 0;
let currentShuffledOptions = [];

// Temporizadores de Tótem
let idleTimer = null;
let resetCountdownTimer = null;
let resetCountdownSeconds = 30;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  resetToAttractScreen();
});

// Escuchadores de Eventos
function setupEventListeners() {
  window.addEventListener('pointerdown', resetTotemIdleTimer, { passive: true });

  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }

  document.getElementById('btn-attract-start').addEventListener('click', () => {
    showScreen('screen-intro');
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    startNewGame();
  });

  document.getElementById('btn-next-case').addEventListener('click', () => {
    hideFeedbackOverlay();
    advanceToNextCase();
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    resetToAttractScreen();
  });
}

// Pantalla Completa
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error al activar pantalla completa: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Gestión de Pantallas
function showScreen(screenId) {
  document.querySelectorAll('.screen-view').forEach(view => {
    view.classList.remove('active');
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
  }
  
  if (screenId === 'screen-results') {
    startResultsResetCountdown();
  } else {
    stopResultsResetCountdown();
  }
}

function resetToAttractScreen() {
  stopResultsResetCountdown();
  showScreen('screen-attract');
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Iniciar Partida (3 Casos Random)
function startNewGame() {
  score = 0;
  correctCount = 0;
  currentCaseIndex = 0;
  
  const shuffledCases = shuffleArray(ALL_CASES);
  activeGameCases = shuffledCases.slice(0, 3);
  
  updateScoreDisplay();
  showScreen('screen-game');
  loadCase(currentCaseIndex);
}

// Cargar Caso Actual
function loadCase(index) {
  const caseData = activeGameCases[index];
  if (!caseData) return;

  document.getElementById('case-counter').textContent = `CASO ${index + 1} DE 3`;
  document.getElementById('driver-tag').textContent = `🏷️ Driver: ${caseData.driver}`;
  document.getElementById('nps-comment-text').textContent = `"${caseData.comment}"`;

  currentShuffledOptions = shuffleArray(caseData.options);

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  const letters = ['A', 'B', 'C'];

  currentShuffledOptions.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.setAttribute('data-index', idx);
    btn.innerHTML = `
      <div class="option-letter-badge">${letters[idx]}</div>
      <div class="option-text-content">${opt.text}</div>
    `;

    btn.addEventListener('click', () => handleOptionSelection(opt, caseData));
    container.appendChild(btn);
  });
}

// Selección de Respuesta
function handleOptionSelection(selectedOption, caseData) {
  const isCorrect = selectedOption.isCorrect;
  
  if (isCorrect) {
    score += 100;
    correctCount++;
  }

  updateScoreDisplay();
  showFeedbackOverlay(isCorrect, caseData);
}

function updateScoreDisplay() {
  document.getElementById('current-score').textContent = score;
}

// Feedback Modal Inmediato
function showFeedbackOverlay(isCorrect, caseData) {
  const overlay = document.getElementById('feedback-overlay');
  const box = document.getElementById('feedback-box');
  const title = document.getElementById('feedback-title');
  const explanation = document.getElementById('feedback-explanation');
  const driverInfo = document.getElementById('feedback-driver-info');

  if (isCorrect) {
    box.className = 'feedback-card-white correct';
    title.innerHTML = '<span>🎉</span> ¡Decisión Centrada en el Cliente!';
  } else {
    box.className = 'feedback-card-white incorrect';
    title.innerHTML = '<span>💡</span> Decisión Subóptima';
  }

  explanation.textContent = caseData.explanation;
  driverInfo.innerHTML = `Focus Driver: <strong>${caseData.driver}</strong>`;

  overlay.classList.add('active');
}

function hideFeedbackOverlay() {
  document.getElementById('feedback-overlay').classList.remove('active');
}

// Avanzar al Siguiente Caso
function advanceToNextCase() {
  currentCaseIndex++;
  if (currentCaseIndex < 3) {
    loadCase(currentCaseIndex);
  } else {
    showResultsScreen();
  }
}

// Pantalla de Resultados
function showResultsScreen() {
  showScreen('screen-results');

  const avatar = document.getElementById('result-avatar');
  const title = document.getElementById('result-title');
  const desc = document.getElementById('result-desc');

  document.getElementById('final-score-val').textContent = score;
  document.getElementById('final-correct-val').textContent = `${correctCount} / 3`;

  if (score === 300) {
    avatar.textContent = '🌟';
    title.textContent = 'CLIENTE PROMOTOR ENTUSIASTA';
    title.className = 'profile-name promotor';
    desc.textContent = '¡Excelente! Tus decisiones demostraron proactividad, claridad y solución de fondo, generando una experiencia memorable y duradera.';
    document.getElementById('final-nps-val').textContent = 'NPS 10 🚀';
  } else if (score === 200) {
    avatar.textContent = '🙂';
    title.textContent = 'CLIENTE SATISFECHO';
    title.className = 'profile-name satisfecho';
    desc.textContent = 'Resolviste positivamente la mayoría de las situaciones. Con un seguimiento más proactivo lograrás fidelizar por completo al cliente.';
    document.getElementById('final-nps-val').textContent = 'NPS 8 👍';
  } else {
    avatar.textContent = '⚠️';
    title.textContent = 'CLIENTE DETRACTOR';
    title.className = 'profile-name detractor';
    desc.textContent = 'Las respuestas imprecisas o pasivas no resuelven la insatisfacción. Ante un comentario del NPS, la acción inmediata es clave para revertir la experiencia.';
    document.getElementById('final-nps-val').textContent = 'NPS 5 ⚠️';
  }
}

// Temporizadores de Inactividad
function resetTotemIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  
  if (currentScreen !== 'screen-attract') {
    idleTimer = setTimeout(() => {
      resetToAttractScreen();
    }, 60000);
  }
}

function startResultsResetCountdown() {
  stopResultsResetCountdown();
  resetCountdownSeconds = 30;
  const timerSpan = document.getElementById('reset-timer');
  if (timerSpan) timerSpan.textContent = resetCountdownSeconds;

  resetCountdownTimer = setInterval(() => {
    resetCountdownSeconds--;
    if (timerSpan) timerSpan.textContent = resetCountdownSeconds;
    
    if (resetCountdownSeconds <= 0) {
      stopResultsResetCountdown();
      resetToAttractScreen();
    }
  }, 1000);
}

function stopResultsResetCountdown() {
  if (resetCountdownTimer) {
    clearInterval(resetCountdownTimer);
    resetCountdownTimer = null;
  }
}
