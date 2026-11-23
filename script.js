
"use strict";

/* =========================================
   SOLAR AQUA — INTERAÇÕES DO SITE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) => document.querySelector(selector);

  /* MENU MOBILE */
  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* ACESSIBILIDADE — TAMANHO DO TEXTO */
  let fontScale = 1;

  function updateFontSize() {
    document.documentElement.style.setProperty(
      "--font-scale",
      String(fontScale)
    );
  }

  $("#fontUp")?.addEventListener("click", () => {
    fontScale = Math.min(1.3, +(fontScale + 0.1).toFixed(1));
    updateFontSize();
  });

  $("#fontDown")?.addEventListener("click", () => {
    fontScale = Math.max(0.8, +(fontScale - 0.1).toFixed(1));
    updateFontSize();
  });

  /* ACESSIBILIDADE — ALTO CONTRASTE */
  const contrastToggle = $("#contrastToggle");

  contrastToggle?.addEventListener("click", () => {
    const enabled = document.body.classList.toggle("high-contrast");
    contrastToggle.setAttribute("aria-pressed", String(enabled));
    contrastToggle.setAttribute(
      "aria-label",
      enabled ? "Desativar alto contraste" : "Ativar alto contraste"
    );
  });

  /* =========================================
     ONDAS ELETROMAGNÉTICAS
  ========================================= */

  const waveData = {
    radio: {
      name: "Ondas de rádio",
      description: "Possuem frequências baixas e comprimentos de onda grandes. São utilizadas em sistemas de comunicação.",
      application: "Aplicação: rádio, televisão e comunicação sem fio.",
      cycles: 2
    },
    micro: {
      name: "Micro-ondas",
      description: "São utilizadas em telecomunicações, radares e no aquecimento de alimentos.",
      application: "Aplicação: forno de micro-ondas e comunicação por satélite.",
      cycles: 3
    },
    infra: {
      name: "Infravermelho",
      description: "Está associado à transferência de energia térmica e é emitido por corpos que possuem temperatura.",
      application: "Aplicação: controles remotos, câmeras térmicas e sensores.",
      cycles: 5
    },
    visible: {
      name: "Luz visível",
      description: "É a faixa do espectro que nossos olhos conseguem enxergar. A luz visível faz parte da radiação solar.",
      application: "Aplicação: iluminação e aproveitamento da luz solar.",
      cycles: 7
    },
    uv: {
      name: "Ultravioleta",
      description: "Possui frequência maior que a luz visível. Está presente na radiação solar e pode causar efeitos na pele.",
      application: "Aplicação: esterilização controlada e análises científicas.",
      cycles: 9
    },
    xray: {
      name: "Raios X",
      description: "São ondas de alta frequência capazes de atravessar determinados materiais.",
      application: "Aplicação: exames de diagnóstico por imagem.",
      cycles: 12
    },
    gamma: {
      name: "Raios gama",
      description: "Possuem frequências muito elevadas e são produzidos em processos nucleares e fenômenos astrofísicos.",
      application: "Aplicação: pesquisas nucleares e tratamentos médicos específicos.",
      cycles: 16
    }
  };

  const waveSelect = $("#waveSelect");
  const wavePath = $("#wavePath");

  function drawWave(cycles) {
    if (!wavePath) return;

    const width = 700;
    const center = 110;
    const amplitude = 65;
    const points = [];

    for (let x = 0; x <= width; x += 3) {
      const y = center - Math.sin(
        (x / width) * cycles * Math.PI * 2
      ) * amplitude;

      points.push(`${x},${y.toFixed(2)}`);
    }

    wavePath.setAttribute("d", "M " + points.join(" L "));
  }

  function updateWave() {
    if (!waveSelect) return;

    const selected = waveData[waveSelect.value];
    if (!selected) return;

    $("#waveTypeLabel").textContent = selected.name.toUpperCase();
    $("#waveTitle").textContent = selected.name;
    $("#waveDescription").textContent = selected.description;
    $("#waveApplication").textContent = selected.application;

    drawWave(selected.cycles);
  }

  waveSelect?.addEventListener("change", updateWave);
  updateWave();

  /* =========================================
     RADIAÇÃO DO CORPO NEGRO
  ========================================= */

  const temperatureInput = $("#temperature");

  function updateTemperature() {
    if (!temperatureInput) return;

    const temperature = Number(temperatureInput.value);

    $("#temperatureValue").textContent =
      temperature.toLocaleString("pt-BR") + " K";

    // Lei de Wien: comprimento de onda máximo em metros.
    const wavelengthMeters = 2.898e-3 / temperature;
    const wavelengthNm = wavelengthMeters * 1e9;

    let region = "infravermelho";

    if (wavelengthNm < 380) {
      region = "ultravioleta";
    } else if (wavelengthNm <= 750) {
      region = "luz visível";
    } else if (wavelengthNm <= 1000) {
      region = "infravermelho próximo";
    }

    $("#temperatureResult").textContent =
      `Pico aproximado: ${wavelengthNm.toFixed(0)} nm — ${region}.`;

    const normalized = (temperature - 1000) / 5000;
    const red = Math.round(220 + normalized * 35);
    const green = Math.round(80 + normalized * 130);
    const blue = Math.round(45 + normalized * 45);

    const orb = $("#thermalOrb");

    if (orb) {
      orb.style.background =
        `radial-gradient(circle at 35% 35%, #fff4bd, rgb(${red}, ${green}, ${blue}) 60%, #a93b2c)`;

      orb.style.boxShadow =
        `0 0 ${25 + normalized * 40}px rgba(${red}, ${green}, ${blue}, .55)`;
    }

    $("#thermalDescription").textContent =
      temperature >= 5000
        ? "Temperatura muito elevada"
        : temperature >= 3000
          ? "Emissão intensa"
          : "Emissão térmica";
  }

  temperatureInput?.addEventListener("input", updateTemperature);
  updateTemperature();

  /* =========================================
     EFEITO FOTOELÉTRICO
  ========================================= */

  const frequencyInput = $("#lightFrequency");
  const intensityInput = $("#lightIntensity");
  const testPhotoelectric = $("#testPhotoelectric");
  const experimentScene = $(".experiment-scene");

  function runPhotoelectricExperiment() {
    if (!frequencyInput || !intensityInput || !experimentScene) return;

    const frequency = Number(frequencyInput.value);
    const intensity = Number(intensityInput.value);

    const thresholdFrequency = 6;

    const beam = $("#lightBeam");
    const result = $("#photoResult");
    const status = $("#photoStatus");

    beam.style.opacity = String(0.15 + intensity * 0.075);
    beam.style.width = `${2 + intensity}px`;

    experimentScene.classList.remove("emitting");

    // Reinicia a animação para permitir repetir o experimento.
    void experimentScene.offsetWidth;

    if (frequency >= thresholdFrequency) {
      experimentScene.classList.add("emitting");

      const emittedElectrons = Math.max(
        1,
        Math.min(3, Math.ceil(intensity / 3))
      );

      result.textContent =
        `Emissão de elétrons! A frequência superou o limite do material. ` +
        `Na demonstração, a intensidade influencia a quantidade de elétrons emitidos. ` +
        `Elétrons representados: ${emittedElectrons}.`;

      status.textContent = "EMISSÃO DETECTADA";
    } else {
      result.textContent =
        "Não houve emissão de elétrons. A frequência está abaixo da frequência de corte. Aumentar somente a intensidade não resolve essa condição.";

      status.textContent = "SEM EMISSÃO";
    }
  }

  testPhotoelectric?.addEventListener(
    "click",
    runPhotoelectricExperiment
  );

  /* =========================================
     SIMULADOR FOTOVOLTAICO
  ========================================= */

  const panelPower = $("#panelPower");
  const panelCount = $("#panelCount");
  const sunHours = $("#sunHours");
  const systemLoss = $("#systemLoss");

  function formatNumber(value) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function calculateEnergy() {
    if (!panelPower || !panelCount || !sunHours || !systemLoss) {
      return;
    }

    const power = Number(panelPower.value);
    const count = Number(panelCount.value);
    const hours = Number(sunHours.value);
    const losses = Number(systemLoss.value);

    const inputs = [
      { value: power, min: 50, max: 1000 },
      { value: count, min: 1, max: 100 },
      { value: hours, min: 0, max: 12 },
      { value: losses, min: 0, max: 50 }
    ];

    const valid = inputs.every(item =>
      Number.isFinite(item.value) &&
      item.value >= item.min &&
      item.value <= item.max
    );

    if (!valid) {
      $("#dailyEnergy").textContent = "—";
      $("#installedPower").textContent = "Valores inválidos";
      $("#monthlyEnergy").textContent = "—";
      $("#yearlyEnergy").textContent = "—";
      $("#efficiencyLabel").textContent = "—";
      $("#efficiencyBar").style.width = "0%";
      return;
    }

    // Potência total em kW.
    const installedKW = (power * count) / 1000;

    // Energia diária: potência × horas × aproveitamento.
    const daily = installedKW * hours * (1 - losses / 100);
    const monthly = daily * 30;
    const yearly = daily * 365;

    $("#dailyEnergy").textContent = formatNumber(daily);
    $("#installedPower").textContent =
      `${formatNumber(installedKW)} kWp`;
    $("#monthlyEnergy").textContent =
      `${formatNumber(monthly)} kWh`;
    $("#yearlyEnergy").textContent =
      `${formatNumber(yearly)} kWh`;

    const efficiency = 100 - losses;

    $("#efficiencyLabel").textContent = `${efficiency}%`;
    $("#efficiencyBar").style.width = `${efficiency}%`;
  }

  $("#calculateEnergy")?.addEventListener("click", calculateEnergy);

  [panelPower, panelCount, sunHours, systemLoss].forEach(input => {
    input?.addEventListener("input", calculateEnergy);
  });

  calculateEnergy();

  /* =========================================
     SENSORES E MONITORAMENTO
  ========================================= */

  const sensorData = {
    temperature: {
      title: "TEMPERATURA DA ÁGUA",
      unit: "°C",
      min: 0,
      max: 50,
      initial: 56,
      description: value => {
        if (value < 20) return "Água em temperatura baixa.";
        if (value <= 32) return "Temperatura dentro da faixa de demonstração.";
        return "Temperatura elevada na simulação.";
      },
      status: value => value > 32 ? "ATENÇÃO" : "NORMAL"
    },

    level: {
      title: "NÍVEL DA ÁGUA",
      unit: "%",
      min: 0,
      max: 100,
      initial: 75,
      description: value => {
        if (value < 25) return "Nível baixo: verificar a quantidade de água.";
        if (value > 90) return "Nível elevado na simulação.";
        return "Nível dentro da faixa de demonstração.";
      },
      status: value => value < 25 || value > 90 ? "ATENÇÃO" : "NORMAL"
    },

    light: {
      title: "LUMINOSIDADE AMBIENTE",
      unit: "%",
      min: 0,
      max: 100,
      initial: 70,
      description: value => {
        if (value < 30) return "Baixa incidência de luz.";
        if (value < 70) return "Luminosidade moderada.";
        return "Alta incidência de luz.";
      },
      status: value => value < 30 ? "BAIXA LUZ" : "NORMAL"
    }
  };

  let currentSensor = "temperature";

  function updateSensor(value = null) {
    const sensor = sensorData[currentSensor];
    const slider = $("#sensorAdjust");

    if (!sensor || !slider) return;

    const reading = value === null
      ? Number(slider.value)
      : Math.max(0, Math.min(100, Number(value)));

    slider.value = String(reading);

    const realValue =
      sensor.min + (reading / 100) * (sensor.max - sensor.min);

    $("#monitorCaption").textContent = sensor.title;
    $("#monitorValue").textContent = realValue.toFixed(1);
    $("#monitorUnit").textContent = sensor.unit;
    $("#monitorDescription").textContent =
      sensor.description(realValue);

    $("#monitorMeter").style.width = `${reading}%`;
    $("#monitorStatus").textContent =
      sensor.status(realValue);

    $("#sensorMin").textContent =
      `${sensor.min} ${sensor.unit}`;

    $("#sensorMax").textContent =
      `${sensor.max} ${sensor.unit}`;

    const status = $("#monitorStatus");

    if (status) {
      status.style.color =
        sensor.status(realValue) === "NORMAL"
          ? "#6fe0c7"
          : "#ffd16c";
    }
  }

  document.querySelectorAll(".sensor-item").forEach(item => {
    item.addEventListener("click", () => {
      const sensorName = item.dataset.sensor;

      if (!sensorData[sensorName]) return;

      currentSensor = sensorName;

      document.querySelectorAll(".sensor-item").forEach(sensor => {
        sensor.classList.remove("active");
      });

      item.classList.add("active");

      const config = sensorData[currentSensor];
      $("#sensorAdjust").value = String(config.initial);

      updateSensor();
    });

    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      }
    });
  });

  $("#sensorAdjust")?.addEventListener("input", event => {
    updateSensor(Number(event.target.value));
  });

  updateSensor();

  /* =========================================
     RELÓGIO DO PAINEL
  ========================================= */

  function updateClock() {
    const clock = $("#monitorClock");
    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  updateClock();
  window.setInterval(updateClock, 1000);

});
