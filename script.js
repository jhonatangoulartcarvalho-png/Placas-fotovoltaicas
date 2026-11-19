
// MENU RESPONSIVO
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("open");
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
  });
});

// SIMULADOR DE ABSORÇÃO SOLAR
const surface = document.getElementById("surface");
const absorptionValue = document.getElementById("absorptionValue");
const absorptionBar = document.getElementById("absorptionBar");

function updateAbsorption() {
  const value = Number(surface.value);
  const percentage = Math.round(value * 100);

  absorptionValue.textContent = percentage + "%";
  absorptionBar.style.width = percentage + "%";
}

surface.addEventListener("change", updateAbsorption);
updateAbsorption();

// SIMULADOR FOTOVOLTAICO
const sunlight = document.getElementById("sunlight");
const panelArea = document.getElementById("panelArea");
const sunlightText = document.getElementById("sunlightText");
const areaText = document.getElementById("areaText");
const powerValue = document.getElementById("powerValue");

function updatePower() {
  const radiation = Number(sunlight.value);
  const area = Number(panelArea.value);

  // Eficiência estimada de 20%
  const power = radiation * area * 0.20;

  sunlightText.textContent = radiation + " W/m²";
  areaText.textContent = area + " m²";
  powerValue.textContent = Math.round(power) + " W";
}

sunlight.addEventListener("input", updatePower);
panelArea.addEventListener("input", updatePower);
updatePower();

// SIMULADOR DE TEMPERATURA
const temperature = document.getElementById("temperature");
const temperatureValue = document.getElementById("temperatureValue");

temperature.addEventListener("input", () => {
  temperatureValue.textContent = temperature.value + " °C";
});

// AUTOMAÇÃO DA PISCINA
const pumpButton = document.getElementById("pumpButton");
const autoButton = document.getElementById("autoButton");
const pumpStatus = document.getElementById("pumpStatus");
const sensorTemperature = document.getElementById("sensorTemperature");
const sensorSun = document.getElementById("sensorSun");
const automationMessage = document.getElementById("automationMessage");

let pumpOn = false;
let automaticMode = false;

function updatePump() {
  pumpStatus.textContent = pumpOn ? "Ligada" : "Desligada";
  pumpButton.textContent = pumpOn ? "Desligar bomba" : "Ligar bomba";
}

pumpButton.addEventListener("click", () => {
  if (automaticMode) {
    automationMessage.textContent =
      "Desative o modo automático para controlar a bomba manualmente.";
    return;
  }

  pumpOn = !pumpOn;
  updatePump();

  automationMessage.textContent = pumpOn
    ? "Bomba ligada manualmente."
    : "Bomba desligada manualmente.";
});

autoButton.addEventListener("click", () => {
  automaticMode = !automaticMode;

  autoButton.textContent = automaticMode
    ? "Desativar modo automático"
    : "Ativar modo automático";

  if (automaticMode) {
    // Exemplo didático de regra automática
    const currentTemperature = 28;
    pumpOn = currentTemperature < 30;

    sensorTemperature.textContent = currentTemperature + " °C";
    sensorSun.textContent = "Alta";

    automationMessage.textContent =
      "Modo automático ativado. A bomba está sendo controlada pela regra simulada.";
  } else {
    automationMessage.textContent =
      "Modo automático desativado. Controle manual disponível.";
  }

  updatePump();
});
