
// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// ACESSIBILIDADE: CONTRASTE
const contrastBtn = document.getElementById("contrastBtn");

contrastBtn.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("high-contrast");
  contrastBtn.setAttribute("aria-pressed", String(enabled));
  contrastBtn.title = enabled
    ? "Desativar alto contraste"
    : "Ativar alto contraste";
});

// ACESSIBILIDADE: TAMANHO DA FONTE
const fontBtn = document.getElementById("fontBtn");

fontBtn.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("large-font");
  fontBtn.textContent = enabled ? "A−" : "A+";
  fontBtn.title = enabled ? "Voltar ao tamanho normal" : "Aumentar fonte";
});

// SIMULADOR FOTOVOLTAICO
const panelPower = document.getElementById("panelPower");
const sunHours = document.getElementById("sunHours");
const systemLoss = document.getElementById("systemLoss");

const powerValue = document.getElementById("powerValue");
const hoursValue = document.getElementById("hoursValue");
const lossValue = document.getElementById("lossValue");

const dailyEnergy = document.getElementById("dailyEnergy");
const dailyResult = document.getElementById("dailyResult");
const monthlyResult = document.getElementById("monthlyResult");
const yearlyResult = document.getElementById("yearlyResult");

const resetSimulator = document.getElementById("resetSimulator");

function formatEnergy(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculateEnergy() {
  const power = Number(panelPower.value);
  const hours = Number(sunHours.value);
  const losses = Number(systemLoss.value);

  // Energia diária = potência em kW × horas × aproveitamento
  const daily = (power / 1000) * hours * (1 - losses / 100);
  const monthly = daily * 30;
  const yearly = daily * 365;

  powerValue.textContent = `${power} W`;
  hoursValue.textContent = `${hours} h`;
  lossValue.textContent = `${losses}%`;

  dailyEnergy.textContent = formatEnergy(daily);
  dailyResult.textContent = `${formatEnergy(daily)} kWh`;
  monthlyResult.textContent = `${formatEnergy(monthly)} kWh`;
  yearlyResult.textContent = `${formatEnergy(yearly)} kWh`;
}

[panelPower, sunHours, systemLoss].forEach(input => {
  input.addEventListener("input", calculateEnergy);
});

resetSimulator.addEventListener("click", () => {
  panelPower.value = 450;
  sunHours.value = 5;
  systemLoss.value = 20;
  calculateEnergy();
});

calculateEnergy();

// ESPECTRO ELETROMAGNÉTICO
const waveInformation = {
  visivel: {
    title: "Luz visível",
    description: "É a faixa que nossos olhos conseguem enxergar. Faz parte da radiação emitida pelo Sol e pode ser aproveitada pelos painéis fotovoltaicos."
  },
  infravermelho: {
    title: "Infravermelho",
    description: "Está relacionado à transferência de energia térmica. É importante para compreender o aquecimento de superfícies e da água."
  },
  ultravioleta: {
    title: "Ultravioleta",
    description: "Possui frequência maior que a luz visível. Também chega do Sol, mas não é a principal faixa aproveitada pelos painéis solares comuns."
  },
  raiosx: {
    title: "Raios X",
    description: "São ondas de alta frequência e energia, utilizadas principalmente em exames de imagem. Não são utilizadas na geração solar comum."
  }
};

const spectrumButtons = document.querySelectorAll(".spectrum-btn");
const waveTitle = document.getElementById("waveTitle");
const waveDescription = document.getElementById("waveDescription");

spectrumButtons.forEach(button => {
  button.addEventListener("click", () => {
    spectrumButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const selectedWave = waveInformation[button.dataset.wave];

    waveTitle.textContent = selectedWave.title;
    waveDescription.textContent = selectedWave.description;
  });
});

// CENTRAL DE SENSORES
const waterTemp = document.getElementById("waterTemp");
const lightLevel = document.getElementById("lightLevel");
const waterLevel = document.getElementById("waterLevel");

const tempValue = document.getElementById("tempValue");
const lightValue = document.getElementById("lightValue");
const levelValue = document.getElementById("levelValue");

const systemStatus = document.querySelector(".system-status");
const statusIcon = document.getElementById("statusIcon");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");

function updateSensors() {
  const temperature = Number(waterTemp.value);
  const light = Number(lightLevel.value);
  const level = Number(waterLevel.value);

  tempValue.textContent = `${temperature} °C`;
  lightValue.textContent = `${light}%`;
  levelValue.textContent = `${level}%`;

  systemStatus.classList.remove("warning", "alert");

  // As faixas abaixo são apenas parâmetros didáticos da simulação.
  if (level < 30) {
    systemStatus.classList.add("alert");
    statusIcon.textContent = "!";
    statusTitle.textContent = "Nível de água muito baixo";
    statusText.textContent =
      "O sensor identificou pouca água. O sistema deve emitir um alerta para verificação.";
  } else if (temperature < 20) {
    systemStatus.classList.add("warning");
    statusIcon.textContent = "!";
    statusTitle.textContent = "Água abaixo da temperatura de referência";
    statusText.textContent =
      "A água está mais fria que o valor de referência da simulação. O aquecimento pode ser avaliado.";
  } else if (temperature > 32) {
    systemStatus.classList.add("warning");
    statusIcon.textContent = "!";
    statusTitle.textContent = "Temperatura elevada";
    statusText.textContent =
      "A temperatura está acima da faixa de referência definida para esta simulação.";
  } else if (light < 25) {
    systemStatus.classList.add("warning");
    statusIcon.textContent = "!";
    statusTitle.textContent = "Pouca luminosidade";
    statusText.textContent =
      "A captação solar pode estar reduzida neste momento. O sistema continua monitorando as condições.";
  } else {
    statusIcon.textContent = "✓";
    statusTitle.textContent = "Sistema em condições normais";
    statusText.textContent =
      "Os valores simulados estão dentro dos parâmetros definidos para esta demonstração.";
  }
}

[waterTemp, lightLevel, waterLevel].forEach(input => {
  input.addEventListener("input", updateSensors);
});

updateSensors();
