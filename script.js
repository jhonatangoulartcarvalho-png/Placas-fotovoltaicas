
// ======================================
// SOLAR AQUA - JAVASCRIPT
// ======================================

const $ = (id) => document.getElementById(id);

// ======================================
// MENU RESPONSIVO
// ======================================

const menuToggle = $("menuToggle");
const mainNav = $("mainNav");

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(open));

  menuToggle.setAttribute(
    "aria-label",
    open ? "Fechar menu" : "Abrir menu"
  );
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// ======================================
// ALTO CONTRASTE
// ======================================

$("contrastToggle").addEventListener("click", () => {
  const active = document.body.classList.toggle("high-contrast");

  $("contrastToggle").setAttribute(
    "aria-pressed",
    String(active)
  );

  $("contrastToggle").title = active
    ? "Desativar alto contraste"
    : "Ativar alto contraste";
});

// ======================================
// FONTE PARA LEITURA
// ======================================

$("fontToggle").addEventListener("click", () => {
  const active = document.body.classList.toggle("dyslexia-font");

  $("fontToggle").setAttribute(
    "aria-pressed",
    String(active)
  );

  $("fontToggle").title = active
    ? "Desativar fonte para leitura"
    : "Ativar fonte para leitura";
});

// ======================================
// NAVEGAÇÃO DOS SIMULADORES
// ======================================

document.querySelectorAll(".sim-tab").forEach(tab => {

  tab.addEventListener("click", () => {

    document.querySelectorAll(".sim-tab").forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    document.querySelectorAll(".sim-panel").forEach(panel => {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const panel = $(tab.dataset.tab);

    panel.hidden = false;
    panel.classList.add("active");

  });

});

// ======================================
// SIMULADOR DE ENERGIA FOTOVOLTAICA
// ======================================

const power = $("panelPower");
const hours = $("sunHours");
const loss = $("systemLoss");

const format = (number, digits = 1) => {
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
};

function updateSolar() {

  const p = Number(power.value);
  const h = Number(hours.value);
  const l = Number(loss.value);

  // Cálculo da geração diária
  const daily = p * h * (1 - l / 100);

  // Atualização dos valores
  $("powerOutput").textContent =
    `${format(p)} kWp`;

  $("sunOutput").textContent =
    `${format(h)} h`;

  $("lossOutput").textContent =
    `${l}%`;

  $("dailyEnergy").textContent =
    format(daily);

  $("monthlyEnergy").textContent =
    `${format(daily * 30, 0)} kWh`;

  $("yearlyEnergy").textContent =
    `${format(daily * 365, 0)} kWh`;
}

// Atualiza quando o usuário movimenta os controles
[power, hours, loss].forEach(input => {
  input.addEventListener("input", updateSolar);
});

// Executa ao abrir a página
updateSolar();

// ======================================
// SIMULADOR DE SENSORES DA PISCINA
// ======================================

const temp = $("waterTemp");
const light = $("lightLevel");
const level = $("waterLevel");

function updateSensor() {

  const t = Number(temp.value);
  const l = Number(light.value);
  const n = Number(level.value);

  // Atualiza os valores exibidos
  $("tempOutput").textContent = `${t} °C`;
  $("lightOutput").textContent = `${l}%`;
  $("levelOutput").textContent = `${n}%`;

  $("tempChip").textContent = `🌡 ${t} °C`;
  $("lightChip").textContent = `☀ ${l}% de luz`;
  $("levelChip").textContent = `💧 Nível ${n}%`;

  // Representação visual do nível da água
  const water = document.querySelector(".pool-water");

  water.style.height = `${Math.max(12, n * 0.6)}%`;

  // Decisões simuladas do controlador
  let title = "Sistema em monitoramento";

  let advice =
    "As condições estão dentro dos parâmetros simulados. Continue acompanhando as leituras.";

  if (n < 30) {

    title = "Atenção: nível baixo";

    advice =
      "O sensor identificou pouca água. O controlador pode emitir um alerta e solicitar uma verificação.";

  } else if (t < 22) {

    title = "Água abaixo da temperatura-alvo";

    if (l > 45) {

      advice =
        "Há boa luminosidade. O controlador pode priorizar a circulação pelo coletor solar térmico, se instalado.";

    } else {

      advice =
        "A luminosidade está baixa. O sistema pode aguardar condições melhores ou utilizar outra fonte de aquecimento.";

    }

  } else if (t > 32) {

    title = "Temperatura elevada";

    advice =
      "O controlador pode interromper o aquecimento e avisar o responsável para avaliar a temperatura.";

  } else if (l > 75) {

    title = "Boa disponibilidade de luz";

    advice =
      "A luminosidade está favorável. Os painéis fotovoltaicos podem gerar energia para os equipamentos.";

  }

  $("sensorDecision").textContent = title;
  $("sensorAdvice").textContent = advice;

}

// Atualização automática dos sensores
[temp, light, level].forEach(input => {
  input.addEventListener("input", updateSensor);
});

updateSensor();

// ======================================
// ESPECTRO ELETROMAGNÉTICO
// ======================================

const waveData = {

  radio: {
    kind: "BAIXA FREQUÊNCIA",
    name: "Ondas de rádio",
    desc: "Possuem comprimentos de onda grandes e são utilizadas em sistemas de comunicação, como rádio e televisão.",
    length: "Maior que 1 m (aprox.)",
    use: "Comunicação",
    position: "0%",
    width: "18%"
  },

  infra: {
    kind: "RADIAÇÃO TÉRMICA",
    name: "Infravermelho",
    desc: "Está associado à transferência de energia térmica. Corpos aquecidos emitem radiação infravermelha, incluindo a água da piscina.",
    length: "700 nm a 1 mm",
    use: "Sensores térmicos",
    position: "30%",
    width: "17%"
  },

  visible: {
    kind: "FAIXA VISÍVEL",
    name: "Luz visível",
    desc: "É a faixa que nossos olhos conseguem detectar. Parte da radiação solar que chega à superfície terrestre está nessa região.",
    length: "380 a 700 nm",
    use: "Painéis solares",
    position: "48%",
    width: "12%"
  },

  uv: {
    kind: "ALTA ENERGIA",
    name: "Ultravioleta",
    desc: "Tem comprimento de onda menor que a luz violeta. Parte da radiação ultravioleta solar é absorvida pela atmosfera.",
    length: "10 a 400 nm",
    use: "Esterilização UV",
    position: "65%",
    width: "15%"
  },

  xray: {
    kind: "MUITA ENERGIA",
    name: "Raios X",
    desc: "São ondas eletromagnéticas de alta frequência utilizadas em exames de imagem e inspeções.",
    length: "0,01 a 10 nm",
    use: "Radiografia",
    position: "83%",
    width: "16%"
  }

};

// Atualiza informações quando a faixa é escolhida
$("waveSelect").addEventListener("change", event => {

  const selected = event.target.value;
  const data = waveData[selected];

  $("waveKind").textContent = data.kind;
  $("waveName").textContent = data.name;
  $("waveDescription").textContent = data.desc;

  $("waveLength").textContent = data.length;
  $("waveUse").textContent = data.use;

  $("spectrumActive").style.left = data.position;
  $("spectrumActive").style.width = data.width;

});

// ======================================
// FIM DO SOLAR AQUA
// ======================================
