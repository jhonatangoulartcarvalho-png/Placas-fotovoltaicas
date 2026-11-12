/* =========================================
   ENERGIA FOTOVOLTAICA
   Interatividade, simuladores e quiz
========================================= */

"use strict";

/* =========================================
   ACESSIBILIDADE
========================================= */

const html = document.documentElement;

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Não foi possível salvar a preferência.", error);
  }
}

function loadPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
}

function setTheme(theme) {
  html.dataset.theme = theme;
  savePreference("site-theme", theme);

  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.themeChoice === theme)
    );
  });
}

function setFont(font) {
  html.dataset.font = font;
  savePreference("site-font", font);

  document.querySelectorAll("[data-font-choice]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.fontChoice === font)
    );
  });
}

function setFontSize(size) {
  html.dataset.size = size;
  savePreference("site-font-size", size);
}

setTheme(loadPreference("site-theme", "light"));
setFont(loadPreference("site-font", "normal"));
setFontSize(loadPreference("site-font-size", "medium"));

document.querySelectorAll("[data-theme-choice]").forEach(button => {
  button.addEventListener("click", () => {
    setTheme(button.dataset.themeChoice);
  });
});

document.querySelectorAll("[data-font-choice]").forEach(button => {
  button.addEventListener("click", () => {
    setFont(button.dataset.fontChoice);
  });
});

const fontSizes = ["small", "medium", "large"];

document.getElementById("font-minus").addEventListener("click", () => {
  let current = html.dataset.size;
  let index = fontSizes.indexOf(current);

  if (index > 0) {
    setFontSize(fontSizes[index - 1]);
  }
});

document.getElementById("font-plus").addEventListener("click", () => {
  let current = html.dataset.size;
  let index = fontSizes.indexOf(current);

  if (index < fontSizes.length - 1) {
    setFontSize(fontSizes[index + 1]);
  }
});

/* =========================================
   MENU PARA CELULAR
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector("span").textContent =
    isOpen ? "Fechar" : "Menu";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector("span").textContent = "Menu";
  });
});

/* =========================================
   ANIMAÇÃO DOS FÓTONS
========================================= */

const canvas = document.getElementById("photon-canvas");
const ctx = canvas.getContext("2d");

let animationPaused = false;
let animationFrame = null;
let particles = [];
let lastFrame = 0;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const photonButton = document.getElementById("pause-animation");

function createParticles() {
  particles = [];

  for (let i = 0; i < 18; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * 115,
      speed: 1.1 + Math.random() * 1.5,
      size: 2 + Math.random() * 2,
      color: "#ffd76a"
    });
  }
}

function drawPhotonScene() {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Fundo
  ctx.fillStyle = "#071e32";
  ctx.fillRect(0, 0, width, height);

  // Camadas do semicondutor
  ctx.fillStyle = "#3184b4";
  ctx.fillRect(0, 220, width, 55);

  ctx.fillStyle = "#c16b96";
  ctx.fillRect(0, 275, width, 55);

  // Junção
  ctx.fillStyle = "#f5cf71";
  ctx.fillRect(0, 212, width, 8);

  // Legendas
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#d9ecf7";
  ctx.fillText("Fótons incidentes", 20, 24);
  ctx.fillText("Região semicondutora", 20, 205);

  // Partículas de luz
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = particle.color;
    ctx.fill();

    if (!animationPaused) {
      particle.y += particle.speed;

      if (particle.y > 205) {
        particle.y = 0;
        particle.x = Math.random() * width;
      }
    }
  });

  // Elétrons
  ctx.fillStyle = "#6ed5ff";

  for (let i = 0; i < 6; i++) {
    const x = 90 + i * 85;
    const y = 245 + Math.sin(Date.now() / 500 + i) * 8;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lacunas
  ctx.fillStyle = "#ff9dc6";

  for (let i = 0; i < 5; i++) {
    const x = 125 + i * 90;
    const y = 300 + Math.cos(Date.now() / 500 + i) * 5;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Separação das cargas
  ctx.font = "12px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Elétrons (−)", 20, 240);
  ctx.fillText("Lacunas (+)", 20, 320);
}

function animatePhotons(timestamp) {
  if (animationPaused) {
    return;
  }

  if (timestamp - lastFrame > 30) {
    drawPhotonScene();
    lastFrame = timestamp;
  }

  animationFrame = requestAnimationFrame(animatePhotons);
}

function startPhotonAnimation() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationPaused = false;
  photonButton.textContent = "Pausar animação";

  if (reducedMotion) {
    drawPhotonScene();
    return;
  }

  animationFrame = requestAnimationFrame(animatePhotons);
}

function stopPhotonAnimation() {
  animationPaused = true;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  drawPhotonScene();
  photonButton.textContent = "Continuar animação";
}

photonButton.addEventListener("click", () => {
  if (animationPaused) {
    startPhotonAnimation();
  } else {
    stopPhotonAnimation();
  }
});

createParticles();
startPhotonAnimation();

/* =========================================
   SIMULADOR 1 — IRRADIÂNCIA
========================================= */

const irradianceInput = document.getElementById("irradiance");

function updateIrradiance() {
  const irradiance = Number(irradianceInput.value);

  // Módulo de referência: 400 W a 1000 W/m².
  const referencePower = 400;
  const power = referencePower * irradiance / 1000;

  // Cinco horas equivalentes de sol pleno.
  const energy = power * 5 / 1000;

  document.getElementById("irradiance-value").textContent =
    irradiance.toLocaleString("pt-BR");

  document.getElementById("power-result").textContent =
    `${power.toFixed(0)} W`;

  document.getElementById("energy-result").textContent =
    `${energy.toFixed(2).replace(".", ",")} kWh`;

  document.getElementById("efficiency-result").textContent = "20%";

  let explanation;

  if (irradiance === 0) {
    explanation = "Sem irradiância incidente, o modelo considera geração nula.";
  } else if (irradiance < 300) {
    explanation = "A irradiância está baixa. A geração estimada também é reduzida.";
  } else if (irradiance < 800) {
    explanation = "A irradiância é intermediária. O painel gera parte da potência de referência.";
  } else if (irradiance <= 1000) {
    explanation = "A irradiância está próxima da condição de referência do módulo.";
  } else {
    explanation = "A irradiância está acima da referência. O resultado é uma estimativa proporcional simplificada.";
  }

  document.getElementById("irradiance-explanation").textContent =
    explanation;
}

irradianceInput.addEventListener("input", updateIrradiance);

/* =========================================
   SIMULADOR 2 — HORÁRIO DO DIA
========================================= */

const timeData = {
  morning: {
    value: 65,
    text: "Pela manhã, a geração pode estar aumentando conforme o Sol sobe no horizonte."
  },

  noon: {
    value: 100,
    text: "Próximo ao meio-dia solar, a incidência pode ser mais favorável, dependendo da instalação."
  },

  afternoon: {
    value: 60,
    text: "À tarde, a geração pode diminuir conforme a posição do Sol muda."
  },

  night: {
    value: 0,
    text: "À noite, sem radiação solar incidente, o painel não produz energia solar."
  }
};

function updateTime(choice) {
  const data = timeData[choice];

  document.getElementById("time-result").textContent =
    `${data.value}%`;

  document.getElementById("time-explanation").textContent =
    data.text;

  document.querySelectorAll("[data-time]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.time === choice)
    );
  });
}

document.querySelectorAll("[data-time]").forEach(button => {
  button.addEventListener("click", () => {
    updateTime(button.dataset.time);
  });
});

/* =========================================
   SIMULADOR 3 — CONDIÇÕES DO CÉU
========================================= */

const weatherData = {
  sun: {
    factor: 1,
    text: "Céu aberto: condição de referência simplificada."
  },

  partial: {
    factor: 0.65,
    text: "Sol entre nuvens: a geração pode variar conforme a cobertura e as sombras."
  },

  cloud: {
    factor: 0.25,
    text: "Céu nublado: a luz difusa ainda pode gerar eletricidade, mas a potência tende a diminuir."
  }
};

function updateWeather(choice) {
  const irradiance = Number(irradianceInput.value);
  const basePower = 400 * irradiance / 1000;
  const power = basePower * weatherData[choice].factor;

  document.getElementById("weather-result").textContent =
    `${power.toFixed(0)} W`;

  document.getElementById("weather-explanation").textContent =
    weatherData[choice].text;

  document.querySelectorAll("[data-weather]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.weather === choice)
    );
  });
}

document.querySelectorAll("[data-weather]").forEach(button => {
  button.addEventListener("click", () => {
    updateWeather(button.dataset.weather);
  });
});

irradianceInput.addEventListener("input", () => {
  const selectedWeather = document.querySelector(
    "[data-weather][aria-pressed='true']"
  );

  if (selectedWeather) {
    updateWeather(selectedWeather.dataset.weather);
  }
});

/* =========================================
   SIMULADOR 4 — AQUECIMENTO DA PISCINA
========================================= */

const currentWater = document.getElementById("water-current");
const targetWater = document.getElementById("water-target");
const poolVolume = document.getElementById("pool-volume");

function updatePool() {
  const current = Number(currentWater.value);
  const target = Number(targetWater.value);
  const volume = Number(poolVolume.value);

  document.getElementById("water-current-value").textContent = current;
  document.getElementById("water-target-value").textContent = target;
  document.getElementById("pool-volume-value").textContent = volume;

  const temperatureDifference = Math.max(0, target - current);

  /*
    Aproximação:
    1 m³ de água = aproximadamente 1000 kg
    Calor específico da água = 4,186 kJ/(kg·°C)
    1 kWh = 3600 kJ

    Resultado em kWh térmicos:
    volume × 1000 × 4,186 × ΔT / 3600
  */

  const thermalEnergy =
    volume * 1000 * 4.186 * temperatureDifference / 3600;

  // COP ilustrativo de 4.
  const electricEnergy = thermalEnergy / 4;

  document.getElementById("pool-heat").textContent =
    `${thermalEnergy.toFixed(1).replace(".", ",")} kWh`;

  document.getElementById("pool-electric").textContent =
    `${electricEnergy.toFixed(1).replace(".", ",")} kWh`;

  const message = document.getElementById("pool-message");

  if (temperatureDifference === 0) {
    message.textContent =
      "A água já está na temperatura desejada ou acima dela.";
  } else {
    message.textContent =
      `Para elevar ${volume} m³ de água em ${temperatureDifference} °C, ` +
      `o modelo estima ${thermalEnergy.toFixed(1).replace(".", ",")} kWh ` +
      `de energia térmica. A estimativa elétrica considera COP 4.`;
  }
}

[currentWater, targetWater, poolVolume].forEach(input => {
  input.addEventListener("input", updatePool);
});

/* =========================================
   SIMULADOR 5 — AUTOMAÇÃO
========================================= */

const sensorTemp = document.getElementById("sensor-temp");
const sensorLight = document.getElementById("sensor-light");

function updateAutomation() {
  const temperature = Number(sensorTemp.value);
  const light = Number(sensorLight.value);

  document.getElementById("sensor-temp-value").textContent =
    temperature;

  document.getElementById("sensor-light-value").textContent =
    light;

  const action = document.getElementById("controller-action");
  const reason = document.getElementById("controller-reason");
  const led = document.getElementById("controller-led");

  const targetTemperature = 28;
  const minimumLight = 200;

  if (temperature >= targetTemperature) {
    action.textContent = "Aquecimento não solicitado";
    reason.textContent =
      "A água já atingiu a temperatura definida no exemplo.";
    led.classList.remove("active");
  } else if (light < minimumLight) {
    action.textContent = "Aguardar condição favorável";
    reason.textContent =
      "A água está abaixo da meta, mas a luminosidade está abaixo do limite configurado.";
    led.classList.remove("active");
  } else {
    action.textContent = "Solicitar aquecimento";
    reason.textContent =
      "A água está abaixo da meta e a luminosidade está acima do limite do exemplo.";
    led.classList.add("active");
  }
}

[sensorTemp, sensorLight].forEach(input => {
  input.addEventListener("input", updateAutomation);
});

/* =========================================
   RESTAURAR SIMULADORES
========================================= */

document.getElementById("reset-simulators").addEventListener("click", () => {
  irradianceInput.value = 1000;
  currentWater.value = 24;
  targetWater.value = 28;
  poolVolume.value = 30;
  sensorTemp.value = 25;
  sensorLight.value = 800;

  updateIrradiance();
  updateTime("noon");
  updateWeather("sun");
  updatePool();
  updateAutomation();
});

updateIrradiance();
updateTime("noon");
updateWeather("sun");
updatePool();
updateAutomation();

/* =========================================
   QUIZ
========================================= */

const questions = [
  {
    question: "Qual é a principal função de uma placa fotovoltaica?",
    options: [
      "Aquecer a água diretamente",
      "Transformar luz solar em eletricidade",
      "Armazenar água da chuva",
      "Produzir vento"
    ],
    answer: 1,
    explanation:
      "A placa fotovoltaica transforma a energia da radiação solar em energia elétrica."
  },

  {
    question: "Qual material é muito utilizado nas células fotovoltaicas?",
    options: [
      "Madeira",
      "Plástico",
      "Silício",
      "Borracha"
    ],
    answer: 2,
    explanation:
      "O silício é um semicondutor bastante utilizado na fabricação de células solares."
  },

  {
    question: "O que são fótons?",
    options: [
      "Partículas associadas à luz",
      "Tipos de sensores",
      "Fios elétricos",
      "Partes de uma bateria"
    ],
    answer: 0,
    explanation:
      "Fótons são os quanta da radiação eletromagnética e transportam energia."
  },

  {
    question: "Qual fórmula representa a energia de um fóton?",
    options: [
      "P = V × I",
      "E = h × f",
      "v = d / t",
      "F = m × a"
    ],
    answer: 1,
    explanation:
      "A energia de um fóton é calculada por E = h × f."
  },

  {
    question: "Qual é o papel da junção P-N?",
    options: [
      "Armazenar água",
      "Aumentar a temperatura do painel",
      "Ajudar a separar cargas elétricas",
      "Impedir a entrada de luz"
    ],
    answer: 2,
    explanation:
      "O campo elétrico interno da junção ajuda a separar elétrons e lacunas."
  },

  {
    question: "Qual é a função de um inversor em um sistema fotovoltaico?",
    options: [
      "Transformar corrente contínua em alternada",
      "Produzir radiação solar",
      "Resfriar os painéis",
      "Medir a temperatura da água"
    ],
    answer: 0,
    explanation:
      "O inversor converte a corrente contínua dos módulos em corrente alternada."
  },

  {
    question: "O que pode reduzir a geração de um painel solar?",
    options: [
      "Sombras",
      "Orientação inadequada",
      "Baixa irradiância",
      "Todas as alternativas"
    ],
    answer: 3,
    explanation:
      "Sombras, baixa irradiância e instalação inadequada podem diminuir a geração."
  },

  {
    question: "Como a energia fotovoltaica pode ajudar a aquecer uma piscina?",
    options: [
      "Transformando a água em eletricidade",
      "Alimentando eletricamente uma bomba de calor",
      "Aumentando a luz da piscina",
      "Substituindo todos os sensores"
    ],
    answer: 1,
    explanation:
      "A eletricidade solar pode alimentar uma bomba de calor que transfere calor do ar para a água."
  },

  {
    question: "Qual é uma função da capa térmica da piscina?",
    options: [
      "Aumentar a evaporação",
      "Produzir eletricidade",
      "Reduzir principalmente a perda de calor por evaporação",
      "Substituir a bomba de calor"
    ],
    answer: 2,
    explanation:
      "A cobertura reduz a evaporação, que é uma das principais formas de perda de calor da piscina."
  },

  {
    question: "Qual sensor pode medir a temperatura da água?",
    options: [
      "LDR",
      "DS18B20",
      "Painel fotovoltaico",
      "Inversor"
    ],
    answer: 1,
    explanation:
      "O DS18B20 é um sensor digital que pode ser utilizado para medir temperatura."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionTitle = document.getElementById("quiz-question");
const optionsContainer = document.getElementById("quiz-options");
const feedback = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("quiz-next");
const quizCard = document.getElementById("quiz-card");
const quizFinal = document.getElementById("quiz-final");

function loadQuestion() {
  answered = false;

  const question = questions[currentQuestion];

  questionTitle.textContent = question.question;

  document.getElementById("quiz-progress").textContent =
    `PERGUNTA ${currentQuestion + 1} DE ${questions.length}`;

  document.getElementById("quiz-live-score").textContent = score;

  document.getElementById("quiz-progress-bar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  optionsContainer.innerHTML = "";
  feedback.hidden = true;
  feedback.textContent = "";

  nextButton.disabled = true;

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "quiz-option";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    button.append(letter, text);

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    optionsContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const question = questions[currentQuestion];
  const buttons = optionsContainer.querySelectorAll("button");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.answer) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && selectedIndex !== question.answer) {
      button.classList.add("incorrect");
    }
  });

  if (selectedIndex === question.answer) {
    score++;
    feedback.textContent = `Correto! ${question.explanation}`;
  } else {
    feedback.textContent =
      `Resposta incorreta. ${question.explanation}`;
  }

  feedback.hidden = false;

  document.getElementById("quiz-live-score").textContent = score;

  nextButton.disabled = false;

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "Ver resultado"
      : "Próxima pergunta →";
}

function showFinalResult() {
  quizCard.hidden = true;
  quizFinal.hidden = false;

  document.getElementById("final-score").textContent =
    `${score} de ${questions.length}`;

  let message;

  if (score === 10) {
    message = "Excelente! Você acertou todas as perguntas.";
  } else if (score >= 7) {
    message = "Muito bom! Você demonstrou um ótimo entendimento.";
  } else if (score >= 5) {
    message = "Bom trabalho! Revise alguns conteúdos e tente novamente.";
  } else {
    message = "Continue estudando! Volte às seções e tente novamente.";
  }

  document.getElementById("final-message").textContent = message;
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showFinalResult();
  }
});

document.getElementById("quiz-restart").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  answered = false;

  quizCard.hidden = false;
  quizFinal.hidden = true;

  loadQuestion();
});

loadQuestion();

/* =========================================
   VLibras OFICIAL
   PRESERVAR ESTA INTEGRAÇÃO
========================================= */

window.addEventListener("load", () => {
  if (
    window.VLibras &&
    typeof window.VLibras.Widget === "function"
  ) {
    try {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    } catch (error) {
      console.error("Não foi possível inicializar o VLibras:", error);
    }
  }
});
