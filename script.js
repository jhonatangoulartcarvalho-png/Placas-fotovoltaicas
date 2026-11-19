
"use strict";

/* =========================================
   SOLAR AQUA — INTERAÇÕES DO SITE
   ========================================= */

/* MENU RESPONSIVO */
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.textContent = opened ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

/* ACESSIBILIDADE */
const accessPanel = document.querySelector("#accessPanel");
const accessOpen = document.querySelector("#accessOpen");
const accessClose = document.querySelector("#accessClose");
const accessStatus = document.querySelector("#accessStatus");

let fontScale = 1;

function toggleAccessPanel(force) {
  const open = typeof force === "boolean"
    ? force
    : accessPanel.hidden;

  accessPanel.hidden = !open;
  accessOpen.setAttribute("aria-expanded", String(open));

  if (open) {
    document.querySelector("#fontUp").focus();
  } else {
    accessOpen.focus();
  }
}

accessOpen.addEventListener("click", () => toggleAccessPanel());
accessClose.addEventListener("click", () => toggleAccessPanel(false));

document.querySelector("#fontUp").addEventListener("click", () => {
  fontScale = Math.min(1.3, fontScale + 0.1);
  document.documentElement.style.setProperty("--font-scale", fontScale);
  accessStatus.textContent = "Tamanho da fonte aumentado.";
});

document.querySelector("#fontDown").addEventListener("click", () => {
  fontScale = Math.max(0.8, fontScale - 0.1);
  document.documentElement.style.setProperty("--font-scale", fontScale);
  accessStatus.textContent = "Tamanho da fonte diminuído.";
});

document.querySelector("#contrastToggle").addEventListener("click", event => {
  const active = document.body.classList.toggle("high-contrast");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  accessStatus.textContent = active
    ? "Alto contraste ativado."
    : "Alto contraste desativado.";
});

document.querySelector("#dyslexiaToggle").addEventListener("click", event => {
  const active = document.body.classList.toggle("dyslexia-mode");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  accessStatus.textContent = active
    ? "Modo de leitura com fonte alternativa ativado."
    : "Modo de leitura desativado.";
});

document.querySelector("#motionToggle").addEventListener("click", event => {
  const active = document.body.classList.toggle("reduce-motion");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  accessStatus.textContent = active
    ? "Animações reduzidas."
    : "Animações normais.";
});

document.querySelector("#accessReset").addEventListener("click", () => {
  fontScale = 1;
  document.documentElement.style.setProperty("--font-scale", "1");

  document.body.classList.remove(
    "high-contrast",
    "dyslexia-mode",
    "reduce-motion"
  );

  document.querySelectorAll(".access-controls button").forEach(button => {
    button.setAttribute("aria-pressed", "false");
  });

  accessStatus.textContent = "Configurações restauradas.";
});

/* FECHAR PAINEL COM ESC */
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !accessPanel.hidden) {
    toggleAccessPanel(false);
  }
});

/* ABAS DOS SIMULADORES */
const labTabs = document.querySelectorAll(".lab-tab");
const simPanels = document.querySelectorAll(".sim-panel");

labTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    labTabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    simPanels.forEach(panel => {
      const selected = panel.id === target;
      panel.hidden = !selected;
      panel.classList.toggle("active", selected);
    });
  });
});

/* NAVEGAÇÃO POR SETAS NAS ABAS */
labTabs.forEach((tab, index) => {
  tab.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;

    event.preventDefault();

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + labTabs.length) % labTabs.length;

    labTabs[nextIndex].focus();
    labTabs[nextIndex].click();
  });
});

/* =========================================
   SIMULADOR 01 — ESPECTRO ELETROMAGNÉTICO
   ========================================= */

const waveData = {
  radio: {
    wavelength: "Maior que 1 m",
    description: "Utilizadas em transmissões de rádio e comunicação.",
    wave: "∿  ∿  ∿  ∿  ∿",
    color: "#a8c1d4"
  },
  micro: {
    wavelength: "1 mm a 1 m",
    description: "Utilizadas em radares, telecomunicações e fornos de micro-ondas.",
    wave: "∿∿  ∿∿  ∿∿  ∿∿",
    color: "#b6b5e9"
  },
  infra: {
    wavelength: "Aproximadamente 700 nm a 1 mm",
    description: "Associado à radiação térmica emitida por corpos aquecidos.",
    wave: "∿∿∿∿∿∿∿",
    color: "#ff9d61"
  },
  visible: {
    wavelength: "Aproximadamente 380 a 700 nm",
    description: "Faixa percebida pelo olho humano e importante para a energia fotovoltaica.",
    wave: "∿∿∿∿∿∿∿∿∿",
    color: "#76e5b2"
  },
  uv: {
    wavelength: "Aproximadamente 10 a 400 nm",
    description: "Radiação ultravioleta, com frequência superior à luz visível.",
    wave: "∿∿∿∿∿∿∿∿∿∿",
    color: "#b58aff"
  },
  xray: {
    wavelength: "Aproximadamente 0,01 a 10 nm",
    description: "Radiação de alta energia utilizada em exames de imagem.",
    wave: "∿∿∿∿∿∿∿∿∿∿∿",
    color: "#75c7ff"
  },
  gamma: {
    wavelength: "Menor que 0,01 nm",
    description: "Radiação de frequência muito alta e grande energia por fóton.",
    wave: "∿∿∿∿∿∿∿∿∿∿∿∿",
    color: "#e0edff"
  }
};

const waveType = document.querySelector("#waveType");

function updateSpectrum() {
  const data = waveData[waveType.value];

  document.querySelector("#waveLength").textContent = data.wavelength;
  document.querySelector("#waveDescription").textContent = data.description;

  const preview = document.querySelector("#wavePreview");
  preview.textContent = data.wave;
  preview.style.color = data.color;
  preview.style.textShadow = `0 0 20px ${data.color}`;
}

waveType.addEventListener("change", updateSpectrum);
updateSpectrum();

/* =========================================
   SIMULADOR 02 — ABSORÇÃO TÉRMICA
   ========================================= */

const material = document.querySelector("#material");
const radiation = document.querySelector("#radiation");

const materialData = {
  "0.95": {
    color: "#141a22",
    description: "O preto fosco absorve grande parte da radiação incidente neste modelo."
  },
  "0.75": {
    color: "#153b69",
    description: "O azul escuro apresenta absorção elevada neste exemplo."
  },
  "0.45": {
    color: "#c6c9c5",
    description: "O concreto claro reflete uma parcela maior da energia recebida."
  },
  "0.15": {
    color: "#dcecf2",
    description: "A superfície refletora absorve pouco e devolve grande parte da radiação."
  }
};

function updateAbsorption() {
  const absorptivity = Number(material.value);
  const incident = Number(radiation.value);
  const absorbed = absorptivity * incident;
  const data = materialData[material.value];

  document.querySelector("#radiationOut").textContent =
    incident.toLocaleString("pt-BR") + " W/m²";

  document.querySelector("#absorbedResult").textContent =
    Math.round(absorbed).toLocaleString("pt-BR") + " W/m²";

  document.querySelector("#materialExplanation").textContent =
    data.description;

  document.querySelector("#materialDisplay").style.background = data.color;

  document.querySelector("#absorbMeter").style.width =
    (absorptivity * 100) + "%";
}

material.addEventListener("change", updateAbsorption);
radiation.addEventListener("input", updateAbsorption);
updateAbsorption();

/* =========================================
   SIMULADOR 03 — EFEITO FOTOELÉTRICO
   ========================================= */

const frequency = document.querySelector("#frequency");
const workFunction = document.querySelector("#workFunction");

function updatePhotoelectric() {
  const frequencyTHz = Number(frequency.value);
  const frequencyHz = frequencyTHz * 1e12;
  const work = Number(workFunction.value);

  // E = h * f, convertido para elétron-volts.
  // Constante de Planck dividida pela carga elementar:
  const photonEnergy = 4.135667696e-15 * frequencyHz;

  const released = photonEnergy >= work;
  const kineticEnergy = Math.max(0, photonEnergy - work);

  document.querySelector("#frequencyOut").textContent =
    frequencyTHz + " THz";

  document.querySelector("#photonEnergy").textContent =
    photonEnergy.toFixed(2).replace(".", ",") + " eV";

  const result = document.querySelector("#photoResult");
  const electron = document.querySelector("#electronDot");
  const output = document.querySelector("#electricOutput");

  if (released) {
    result.textContent =
      "O fóton supera a função trabalho. A emissão de elétrons é possível neste modelo. Energia cinética máxima: " +
      kineticEnergy.toFixed(2).replace(".", ",") + " eV.";

    electron.classList.add("released");
    output.classList.remove("off");
    output.textContent = "EMISSÃO POSSÍVEL";
  } else {
    result.textContent =
      "A energia do fóton é insuficiente para superar a função trabalho. Não ocorre emissão neste modelo.";

    electron.classList.remove("released");
    output.classList.add("off");
    output.textContent = "SEM EMISSÃO";
  }

  document.querySelector("#lightBeam").style.opacity =
    Math.max(.25, Math.min(1, frequencyTHz / 1000));
}

frequency.addEventListener("input", updatePhotoelectric);
workFunction.addEventListener("change", updatePhotoelectric);
updatePhotoelectric();

/* =========================================
   SIMULADOR 04 — AQUECIMENTO DA PISCINA
   ========================================= */

const waterVolume = document.querySelector("#waterVolume");
const initialTemp = document.querySelector("#initialTemp");
const finalTemp = document.querySelector("#finalTemp");

function updateHeating() {
  const volume = Number(waterVolume.value);
  const start = Number(initialTemp.value);
  const end = Number(finalTemp.value);

  document.querySelector("#volumeOut").textContent =
    volume.toLocaleString("pt-BR") + " L";

  document.querySelector("#initialOut").textContent = start + " °C";
  document.querySelector("#finalOut").textContent = end + " °C";

  const difference = end - start;

  const heatResult = document.querySelector("#heatEnergy");

  if (difference <= 0) {
    heatResult.textContent = "0 kWh";
    document.querySelector("#heatExplanation").textContent =
      "A temperatura desejada deve ser maior que a inicial para calcular o aquecimento.";
  } else {
    // Q = m * c * ΔT
    // Água: 1 litro ≈ 1 kg; c = 4186 J/(kg °C)
    // Conversão de joules para kWh.
    const joules = volume * 4186 * difference;
    const kWh = joules / 3600000;

    heatResult.textContent =
      kWh.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }) + " kWh";

    document.querySelector("#heatExplanation").textContent =
      "Para elevar " + volume.toLocaleString("pt-BR") +
      " litros em " + difference + " °C, seriam necessários aproximadamente " +
      kWh.toFixed(1).replace(".", ",") + " kWh, sem considerar perdas.";
  }

  const fill = Math.max(5, Math.min(100, ((start - 10) / 30) * 100));

  document.querySelector("#poolFill").style.height = fill + "%";
  document.querySelector("#poolTempVisual").textContent = start + " °C";
}

[waterVolume, initialTemp, finalTemp].forEach(input => {
  input.addEventListener("input", updateHeating);
});

updateHeating();

/* =========================================
   SIMULADOR 05 — TÉRMICO X FOTOVOLTAICO
   ========================================= */

const compareArea = document.querySelector("#compareArea");
const compareSun = document.querySelector("#compareSun");

function updateComparison() {
  const area = Number(compareArea.value);
  const irradiance = Number(compareSun.value);

  // Valores didáticos de eficiência.
  const thermalEfficiency = 0.70;
  const photovoltaicEfficiency = 0.22;

  const receivedPower = area * irradiance;
  const thermal = receivedPower * thermalEfficiency;
  const photovoltaic = receivedPower * photovoltaicEfficiency;

  document.querySelector("#compareAreaOut").textContent =
    area + " m²";

  document.querySelector("#compareSunOut").textContent =
    irradiance + " W/m²";

  document.querySelector("#thermalPower").textContent =
    Math.round(thermal).toLocaleString("pt-BR") + " W";

  document.querySelector("#thermalPercent").textContent =
    Math.round(thermal).toLocaleString("pt-BR") + " W";

  document.querySelector("#pvPower").textContent =
    Math.round(photovoltaic).toLocaleString("pt-BR") + " W";

  const maximum = Math.max(thermal, photovoltaic, 1);

  document.querySelector("#thermalBar").style.width =
    (thermal / maximum * 100) + "%";

  document.querySelector("#pvBar").style.width =
    (photovoltaic / maximum * 100) + "%";

  document.querySelector("#comparisonText").textContent =
    "O coletor térmico transfere calor diretamente para a água. O painel fotovoltaico produz eletricidade, que pode alimentar equipamentos adequados.";
}

compareArea.addEventListener("input", updateComparison);
compareSun.addEventListener("input", updateComparison);
updateComparison();

/* =========================================
   SIMULADOR 06 — CAPA TÉRMICA
   ========================================= */

const poolArea = document.querySelector("#poolArea");
const airTemp = document.querySelector("#airTemp");
const waterTemp = document.querySelector("#waterTemp");

let coverEnabled = false;

function updateCover() {
  const area = Number(poolArea.value);
  const air = Number(airTemp.value);
  const water = Number(waterTemp.value);

  document.querySelector("#poolAreaOut").textContent = area + " m²";
  document.querySelector("#airTempOut").textContent = air + " °C";
  document.querySelector("#waterTempOut").textContent = water + " °C";

  // Modelo didático simplificado.
  // Estima uma perda proporcional à área e à diferença de temperatura.
  const difference = Math.max(0, water - air);
  const lossWithout = area * difference * 0.02;

  // Supõe redução ilustrativa de 65% com a cobertura.
  const lossWith = lossWithout * 0.35;
  const saving = lossWithout - lossWith;

  document.querySelector("#lossWithout").textContent =
    lossWithout.toFixed(1).replace(".", ",") + " kWh/dia";

  document.querySelector("#lossWith").textContent =
    "Com capa: " + lossWith.toFixed(1).replace(".", ",") + " kWh/dia";

  document.querySelector("#coverSaving").textContent =
    "Redução estimada de " + saving.toFixed(1).replace(".", ",") +
    " kWh/dia neste modelo ilustrativo.";

  document.querySelector("#coverSheet").style.opacity =
    coverEnabled ? "1" : "0";

  document.querySelector("#coverOff").setAttribute(
    "aria-pressed", String(!coverEnabled)
  );

  document.querySelector("#coverOn").setAttribute(
    "aria-pressed", String(coverEnabled)
  );
}

document.querySelector("#coverOff").addEventListener("click", () => {
  coverEnabled = false;
  updateCover();
});

document.querySelector("#coverOn").addEventListener("click", () => {
  coverEnabled = true;
  updateCover();
});

[poolArea, airTemp, waterTemp].forEach(input => {
  input.addEventListener("input", updateCover);
});

updateCover();

/* =========================================
   AUTOMAÇÃO — SENSORES E BOMBA
   ========================================= */

const sensorTemp = document.querySelector("#sensorTemp");
const targetTemp = document.querySelector("#targetTemp");
const sensorSunlight = document.querySelector("#sensorSunlight");

const dashTemp = document.querySelector("#dashTemp");
const dashTarget = document.querySelector("#dashTarget");
const dashSun = document.querySelector("#dashSun");
const dashPump = document.querySelector("#dashPump");
const systemMessage = document.querySelector("#systemMessage");

const autoMode = document.querySelector("#autoMode");
const manualPump = document.querySelector("#manualPump");

let automationActive = false;
let pumpActive = false;

function updateDashboard() {
  const current = Number(sensorTemp.value);
  const target = Number(targetTemp.value);
  const sunlight = Number(sensorSunlight.value);

  dashTemp.textContent = current.toFixed(1).replace(".", ",") + " °C";
  dashTarget.textContent = target.toFixed(1).replace(".", ",") + " °C";
  dashSun.textContent = sunlight + " W/m²";

  dashPump.textContent = pumpActive ? "LIGADA" : "DESLIGADA";
  dashPump.style.color = pumpActive ? "#75e3b5" : "#ffbd91";

  manualPump.textContent = pumpActive
    ? "Desligar bomba manualmente"
    : "Ligar bomba manualmente";

  if (automationActive) {
    autoMode.textContent = "Desativar automação";
    autoMode.setAttribute("aria-pressed", "true");

    if (current < target && sunlight > 200) {
      pumpActive = true;
      systemMessage.textContent =
        "Automação: temperatura abaixo da meta e há radiação disponível. Circulação ativada.";
    } else if (current >= target) {
      pumpActive = false;
      systemMessage.textContent =
        "Automação: temperatura desejada alcançada. Bomba desligada.";
    } else {
      pumpActive = false;
      systemMessage.textContent =
        "Automação: baixa radiação solar. Bomba desligada nesta estratégia de controle.";
    }
  } else {
    autoMode.textContent = "Ativar automação";
    autoMode.setAttribute("aria-pressed", "false");
  }

  dashPump.textContent = pumpActive ? "LIGADA" : "DESLIGADA";
  dashPump.style.color = pumpActive ? "#75e3b5" : "#ffbd91";
  manualPump.textContent = pumpActive
    ? "Desligar bomba manualmente"
    : "Ligar bomba manualmente";
}

[sensorTemp, targetTemp, sensorSunlight].forEach(input => {
  input.addEventListener("input", () => {
    if (automationActive) {
      updateDashboard();
    } else {
      dashTemp.textContent =
        Number(sensorTemp.value).toFixed(1).replace(".", ",") + " °C";
      dashTarget.textContent = targetTemp.value + ",0 °C";
      dashSun.textContent = sensorSunlight.value + " W/m²";
    }
  });
});

autoMode.addEventListener("click", () => {
  automationActive = !automationActive;

  if (automationActive) {
    updateDashboard();
  } else {
    systemMessage.textContent =
      "Automação desativada. O controle manual está disponível.";
    updateDashboard();
  }
});

manualPump.addEventListener("click", () => {
  if (automationActive) {
    systemMessage.textContent =
      "Desative a automação antes de controlar a bomba manualmente.";
    return;
  }

  pumpActive = !pumpActive;
  updateDashboard();

  systemMessage.textContent = pumpActive
    ? "Modo manual: bomba ligada."
    : "Modo manual: bomba desligada.";
});

updateDashboard();

/* =========================================
   ANO AUTOMÁTICO NO RODAPÉ
   ========================================= */

const footerYear = document.querySelector(".footer");
if (footerYear) {
  const yearText = footerYear.querySelector("p");
  if (yearText) {
    yearText.setAttribute("aria-label", "Projeto educacional Solar Aqua");
  }
}
