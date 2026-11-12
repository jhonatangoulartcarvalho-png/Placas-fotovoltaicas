"use strict";

/* =========================================
   VLIBRAS OFICIAL
   ========================================= */
window.addEventListener("load", () => {
  if (window.VLibras && window.VLibras.Widget) {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  }
});

/* =========================================
   ACESSIBILIDADE
   ========================================= */
const root = document.documentElement;

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // O site continua funcionando mesmo sem armazenamento.
  }
}

function toggleTheme(theme) {
  if (!["light", "dark", "high-contrast"].includes(theme)) return;
  root.setAttribute("data-theme", theme);
  savePreference("theme", theme);
}

function toggleFont(font) {
  if (!["normal", "dyslexia"].includes(font)) return;
  root.setAttribute("data-font", font);
  savePreference("font", font);
}

function changeSize(direction) {
  const sizes = ["small", "medium", "large", "xlarge"];
  const current = root.getAttribute("data-size") || "medium";
  let index = sizes.indexOf(current);

  if (index < 0) index = 1;

  index = Math.max(0, Math.min(sizes.length - 1, index + direction));

  root.setAttribute("data-size", sizes[index]);
  savePreference("size", sizes[index]);
}

function loadPreferences() {
  try {
    const theme = localStorage.getItem("theme");
    const font = localStorage.getItem("font");
    const size = localStorage.getItem("size");

    if (["light", "dark", "high-contrast"].includes(theme)) {
      root.setAttribute("data-theme", theme);
    }

    if (["normal", "dyslexia"].includes(font)) {
      root.setAttribute("data-font", font);
    }

    if (["small", "medium", "large", "xlarge"].includes(size)) {
      root.setAttribute("data-size", size);
    }
  } catch (error) {
    // Preferências padrão.
  }
}

/* =========================================
   MENU RESPONSIVO
   ========================================= */
function setupMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");

  if (!menuButton || !nav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );

    menuButton.textContent = isOpen ? "✕ Fechar" : "☰ Menu";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu de navegação");
      menuButton.textContent = "☰ Menu";
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("active")) {
      nav.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });
}

/* =========================================
   SIMULADOR 1 — RADIAÇÃO E POTÊNCIA
   =========================================
   Modelo simplificado:
   P = potência nominal x irradiância / 1000.
   O resultado é uma estimativa, não uma medição.
*/
function setupSimulator1() {
  const slider = document.getElementById("sim1-intensidade");
  if (!slider) return;

  const value = document.getElementById("val-sim1");
  const powerOutput = document.getElementById("res-sim1-pot");
  const efficiencyOutput = document.getElementById("res-sim1-ef");

  function update() {
    const irradiance = Number(slider.value);
    const nominalPower = 400;

    const power = nominalPower * irradiance / 1000;

    value.textContent = irradiance;
    powerOutput.textContent = `${Math.round(power)} W`;

    // Eficiência nominal ilustrativa do painel.
    efficiencyOutput.textContent = "20%";
    slider.setAttribute("aria-valuenow", String(irradiance));
  }

  slider.addEventListener("input", update);
  update();
}

/* =========================================
   SIMULADOR 2 — HORÁRIO DO DIA
   ========================================= */
function setTime(time, button) {
  const data = {
    manha: {
      angle: "45° (inclinação ilustrativa)",
      generation: "60%"
    },
    meio_dia: {
      angle: "90° (incidência ideal ilustrativa)",
      generation: "100%"
    },
    tarde: {
      angle: "45° (inclinação ilustrativa)",
      generation: "60%"
    },
    noite: {
      angle: "0°",
      generation: "0%"
    }
  };

  const result = data[time];
  if (!result) return;

  document.getElementById("res-sim2-ang").textContent = result.angle;
  document.getElementById("res-sim2-ger").textContent = result.generation;

  const controls = button?.parentElement;
  if (controls) {
    controls.querySelectorAll("button").forEach(item => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  }
}

/* =========================================
   SIMULADOR 3 — CONDIÇÕES CLIMÁTICAS
   ========================================= */
function setWeather(weather, button) {
  const data = {
    sol: { transmission: 100, label: "Sol forte" },
    parcial: { transmission: 60, label: "Parcialmente nublado" },
    nublado: { transmission: 20, label: "Nublado" }
  };

  const condition = data[weather];
  if (!condition) return;

  const irradiance = Number(
    document.getElementById("sim1-intensidade")?.value || 1000
  );

  const estimatedPower =
    400 * (irradiance / 1000) * (condition.transmission / 100);

  document.getElementById("res-sim3-trans").textContent =
    `${condition.transmission}%`;

  document.getElementById("res-sim3-prod").textContent =
    `${Math.round(estimatedPower)} W`;

  const controls = button?.parentElement;
  if (controls) {
    controls.querySelectorAll("button").forEach(item => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  }
}

/* =========================================
   SIMULADOR 4 — AQUECIMENTO DA PISCINA
   =========================================
   Estimativa para uma piscina de 10.000 litros.
   Energia térmica = massa x calor específico x variação de temperatura.
   Aproximação: 1,163 kWh por m³ por °C.
   COP ilustrativo = 4.
*/
function setupSimulator4() {
  const currentSlider = document.getElementById("sim4-temp-atual");
  const targetSlider = document.getElementById("sim4-temp-desejada");

  if (!currentSlider || !targetSlider) return;

  const currentValue = document.getElementById("val-sim4-atual");
  const targetValue = document.getElementById("val-sim4-desejada");
  const status = document.getElementById("res-sim4-status");
  const consumption = document.getElementById("res-sim4-consumo");
  const heat = document.getElementById("res-sim4-calor");

  const poolVolumeM3 = 10;
  const cop = 4;

  function update() {
    const current = Number(currentSlider.value);
    const target = Number(targetSlider.value);

    currentValue.textContent = current;
    targetValue.textContent = target;

    if (current >= target) {
      status.textContent = "DESLIGADA — temperatura atingida";
      status.className = "status-off";
      consumption.textContent = "0 kWh";
      heat.textContent = "0 kWh";
      return;
    }

    const difference = target - current;
    const thermalEnergy = 1.163 * poolVolumeM3 * difference;
    const electricalEnergy = thermalEnergy / cop;

    status.textContent = "LIGADA — aquecimento necessário";
    status.className = "status-on";

    consumption.textContent =
      `${electricalEnergy.toFixed(1)} kWh (estimativa)`;

    heat.textContent =
      `${thermalEnergy.toFixed(1)} kWh (estimativa)`;
  }

  currentSlider.addEventListener("input", update);
  targetSlider.addEventListener("input", update);
  update();
}

/* =========================================
   SIMULADOR 5 — AUTOMAÇÃO
   ========================================= */
function setupSimulator5() {
  const tempSlider = document.getElementById("sim5-temp-sensor");
  const lightSlider = document.getElementById("sim5-luz-sensor");

  if (!tempSlider || !lightSlider) return;

  const tempValue = document.getElementById("val-sim5-temp");
  const lightValue = document.getElementById("val-sim5-luz");
  const action = document.getElementById("res-sim5-acao");

  function update() {
    const temperature = Number(tempSlider.value);
    const light = Number(lightSlider.value);

    tempValue.textContent = temperature;
    lightValue.textContent = light;

    if (temperature < 28 && light > 200) {
      action.textContent = "LIGAR BOMBA";
      action.className = "status-on";
    } else if (temperature >= 28) {
      action.textContent = "DESLIGAR — temperatura atingida";
      action.className = "status-off";
    } else {
      action.textContent = "DESLIGAR — luminosidade baixa";
      action.className = "status-off";
    }
  }

  tempSlider.addEventListener("input", update);
  lightSlider.addEventListener("input", update);
  update();
}

/* =========================================
   ANIMAÇÃO DO EFEITO FOTOVOLTAICO
   ========================================= */
function setupCanvas() {
  const canvas = document.getElementById("canvas-fotoeletrico");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let photons = [];
  let electrons = [];
  let animationId = null;
  let lastSpawn = 0;

  function draw(timestamp = 0) {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Fundo
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#071b2d");
    gradient.addColorStop(1, "#123c5b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Raios de luz
    ctx.strokeStyle = "rgba(255, 209, 102, .35)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(35 + i * 75, 0);
      ctx.lineTo(35 + i * 75, 175);
      ctx.stroke();
    }

    // Camadas do semicondutor
    ctx.fillStyle = "#2385bb";
    ctx.fillRect(0, 190, width, 42);

    ctx.fillStyle = "#f1c75b";
    ctx.fillRect(0, 232, width, 7);

    ctx.fillStyle = "#a95c85";
    ctx.fillRect(0, 239, width, 61);

    // Rótulos
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Camada N", 12, 215);
    ctx.fillText("Junção P-N", 12, 252);
    ctx.fillText("Camada P", 12, 278);

    // Criar fótons
    if (timestamp - lastSpawn > 550 && photons.length < 15) {
      photons.push({
        x: 25 + Math.random() * (width - 50),
        y: 12,
        speed: 2.2 + Math.random() * 1.3
      });

      lastSpawn = timestamp;
    }

    // Movimento dos fótons
    photons = photons.filter(photon => {
      photon.y += photon.speed;

      ctx.beginPath();
      ctx.arc(photon.x, photon.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (photon.y >= 190) {
        // Representação simplificada da geração de cargas.
        electrons.push({
          x: photon.x,
          y: 190,
          speed: 1.5 + Math.random() * 1.5
        });
        return false;
      }

      return true;
    });

    // Movimento dos elétrons
    electrons = electrons.filter(electron => {
      electron.y -= electron.speed;
      electron.x += Math.sin(electron.y / 15) * .5;

      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#66dcff";
      ctx.shadowColor = "#66dcff";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      return electron.y > 0;
    });

    // Legenda
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffd166";
    ctx.fillText("● Fótons", 12, 22);
    ctx.fillStyle = "#66dcff";
    ctx.fillText("● Cargas geradas", 100, 22);

    if (!reducedMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  draw();

  // Pausar quando a página estiver em segundo plano.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && !reducedMotion && !animationId) {
      animationId = requestAnimationFrame(draw);
    }
  });
}

/* =========================================
   QUIZ
   ========================================= */
const quizData = [
  {
    q: "O que é um fóton?",
    options: [
      "Uma onda sonora",
      "Uma partícula de luz que transporta energia",
      "Um tipo de elétron",
      "Um componente do silício"
    ],
    correct: 1,
    explanation:
      "Fótons são partículas de luz que transportam quantidades de energia."
  },
  {
    q: "Qual material é muito utilizado nas células fotovoltaicas?",
    options: ["Cobre", "Ferro", "Silício", "Plástico"],
    correct: 2,
    explanation:
      "O silício é um semicondutor utilizado na fabricação de células solares."
  },
  {
    q: "Qual é a função da junção P-N?",
    options: [
      "Criar um campo elétrico interno que ajuda a separar cargas",
      "Derreter o silício",
      "Refletir toda a luz",
      "Produzir apenas calor"
    ],
    correct: 0,
    explanation:
      "O campo elétrico interno ajuda a separar elétrons e lacunas gerados pela luz."
  },
  {
    q: "Qual é a diferença entre o efeito fotoelétrico externo e o fotovoltaico?",
    options: [
      "Não existe diferença",
      "O externo emite elétrons para fora do material; o fotovoltaico gera cargas no semicondutor",
      "O fotovoltaico só funciona à noite",
      "O externo utiliza apenas silício"
    ],
    correct: 1,
    explanation:
      "No efeito fotovoltaico, as cargas são geradas e separadas dentro do semicondutor."
  },
  {
    q: "Por que a capa térmica é importante para uma piscina?",
    options: [
      "Para colorir a água",
      "Para reduzir a evaporação e a perda de calor",
      "Para aumentar o volume",
      "Para gerar eletricidade"
    ],
    correct: 1,
    explanation:
      "A capa reduz principalmente a perda de calor causada pela evaporação."
  },
  {
    q: "O que um sensor LDR mede?",
    options: [
      "Temperatura da água",
      "Nível da água",
      "Luminosidade",
      "Velocidade do vento"
    ],
    correct: 2,
    explanation:
      "O LDR altera sua resistência elétrica conforme a luz recebida."
  },
  {
    q: "Como temperaturas muito altas podem afetar os painéis?",
    options: [
      "Sempre aumentam a eficiência",
      "Não causam efeito algum",
      "Podem reduzir a eficiência elétrica",
      "Fazem o painel produzir apenas à noite"
    ],
    correct: 2,
    explanation:
      "O aumento da temperatura geralmente reduz a tensão e a eficiência do módulo."
  },
  {
    q: "Qual é a função da bomba de calor na piscina?",
    options: [
      "Gerar luz",
      "Transferir calor do ambiente para a água",
      "Filtrar a sujeira",
      "Produzir radiação solar"
    ],
    correct: 1,
    explanation:
      "A bomba de calor utiliza energia elétrica para transferir energia térmica."
  },
  {
    q: "O que representa a equação E = h · f?",
    options: [
      "Massa e velocidade",
      "Energia do fóton e frequência da radiação",
      "Tensão e corrente",
      "Temperatura e volume"
    ],
    correct: 1,
    explanation:
      "A equação relaciona a energia de um fóton à frequência da radiação."
  },
  {
    q: "O que significa um painel com eficiência de 20%?",
    options: [
      "Funciona apenas 20% do dia",
      "Converte 20% da potência solar incidente em potência elétrica",
      "Ocupa 20% do telhado",
      "Produz energia somente em dias quentes"
    ],
    correct: 1,
    explanation:
      "A eficiência compara a potência elétrica produzida com a potência solar recebida."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
  const questionText = document.getElementById("quiz-question-text");
  const progress = document.getElementById("quiz-progress");
  const optionsContainer = document.getElementById("quiz-options");
  const nextButton = document.getElementById("quiz-next-btn");

  if (!questionText || !progress || !optionsContainer || !nextButton) {
    return;
  }

  answered = false;
  nextButton.disabled = true;
  nextButton.textContent = "Próxima pergunta";

  const question = quizData[currentQuestion];

  progress.textContent =
    `Pergunta ${currentQuestion + 1} de ${quizData.length}`;

  questionText.textContent = question.q;
  optionsContainer.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const question = quizData[currentQuestion];
  const options = document.querySelectorAll(".quiz-option");

  options.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add("correct");
      button.setAttribute("aria-checked", "true");
    } else {
      button.setAttribute("aria-checked", "false");
    }

    if (index === selectedIndex && index !== question.correct) {
      button.classList.add("incorrect");
      button.setAttribute("aria-checked", "true");
    }
  });

  if (selectedIndex === question.correct) {
    score++;
  }

  const feedback = document.createElement("p");
  feedback.className = "quiz-feedback";
  feedback.setAttribute("role", "status");
  feedback.textContent = `Explicação: ${question.explanation}`;

  document.getElementById("quiz-options").appendChild(feedback);

  const nextButton = document.getElementById("quiz-next-btn");
  nextButton.disabled = false;

  if (currentQuestion === quizData.length - 1) {
    nextButton.textContent = "Ver resultado";
  }
}

function nextQuestion() {
  if (!answered) return;

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const questionBox = document.getElementById("quiz-question-box");
  const resultBox = document.getElementById("quiz-result-box");
  const scoreText = document.getElementById("quiz-score");
  const feedback = document.getElementById("quiz-feedback");

  questionBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const percentage = Math.round((score / quizData.length) * 100);

  scoreText.textContent =
    `Você acertou ${score} de ${quizData.length} perguntas (${percentage}%).`;

  let message;

  if (percentage === 100) {
    message = "Excelente! Você acertou todas as perguntas.";
  } else if (percentage >= 70) {
    message = "Muito bom! Você entendeu bem o conteúdo.";
  } else if (percentage >= 50) {
    message = "Bom trabalho! Revise alguns conceitos e tente novamente.";
  } else {
    message = "Continue estudando. Você pode refazer o quiz para praticar.";
  }

  feedback.textContent = message;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;

  document.getElementById("quiz-question-box").classList.remove("hidden");
  document.getElementById("quiz-result-box").classList.add("hidden");

  loadQuestion();
}

/* =========================================
   INICIALIZAÇÃO
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadPreferences();
  setupMenu();
  setupSimulator1();
  setupSimulator4();
  setupSimulator5();
  setupCanvas();
  loadQuestion();

  // Atualiza a estimativa do clima quando a intensidade muda.
  const intensity = document.getElementById("sim1-intensidade");

  if (intensity) {
    intensity.addEventListener("input", () => {
      const selectedWeather = document.querySelector(
        '#simuladores .sim-controls:nth-of-type(2) button[aria-pressed="true"]'
      );

      if (selectedWeather) {
        const weather = selectedWeather.getAttribute("onclick") || "";

        if (weather.includes("parcial")) {
          setWeather("parcial");
        } else if (weather.includes("nublado")) {
          setWeather("nublado");
        } else {
          setWeather("sol");
        }
      }
    });
  }
});
