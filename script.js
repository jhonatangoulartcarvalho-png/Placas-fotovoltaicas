/* =========================================
   INICIALIZAÇÃO DO VLIBRAS (Obrigatório)
   ========================================= */
window.addEventListener('load', function() {
    new window.VLibras.Widget('https://vlibras.gov.br/app');
});

/* =========================================
   ACESSIBILIDADE
   ========================================= */
function toggleTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleFont(font) {
    document.documentElement.setAttribute('data-font', font);
    localStorage.setItem('font', font);
}

function changeSize(direction) {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    let current = document.documentElement.getAttribute('data-size') || 'medium';
    let index = sizes.indexOf(current);
    
    index += direction;
    if (index < 0) index = 0;
    if (index >= sizes.length) index = sizes.length - 1;
    
    document.documentElement.setAttribute('data-size', sizes[index]);
    localStorage.setItem('size', sizes[index]);
}

// Carregar preferências salvas
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const savedFont = localStorage.getItem('font');
    const savedSize = localStorage.getItem('size');
    
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedFont) document.documentElement.setAttribute('data-font', savedFont);
    if (savedSize) document.documentElement.setAttribute('data-size', savedSize);
});

// Menu Mobile
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
});

/* =========================================
   SIMULAÇÃO CANVAS: EFEITO FOTOELÉTRICO
   ========================================= */
const canvas = document.getElementById('canvas-fotoeletrico');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let photons = [];
    let electrons = [];

    function draw() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar material (silício)
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 200, canvas.width, 100);
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '14px Arial';
        ctx.fillText('Material Semicondutor (Silício)', 100, 250);

        // Gerar fótons
        if (Math.random() < 0.05) {
            photons.push({ x: Math.random() * canvas.width, y: 0, speed: 3 });
        }

        // Atualizar e desenhar fótons
        ctx.fillStyle = '#FFD700';
        for (let i = photons.length - 1; i >= 0; i--) {
            let p = photons[i];
            p.y += p.speed;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Colisão com o material
            if (p.y >= 200) {
                // Simulação: 70% de chance de liberar elétron (energia suficiente)
                if (Math.random() > 0.3) {
                    electrons.push({ x: p.x, y: 200, speed: -2 - Math.random() * 2 });
                }
                photons.splice(i, 1);
            }
        }

        // Atualizar e desenhar elétrons
        ctx.fillStyle = '#00A8E8';
        for (let i = electrons.length - 1; i >= 0; i--) {
            let e = electrons[i];
            e.y += e.speed;
            e.x += (Math.random() - 0.5) * 2; // Movimento aleatório lateral
            ctx.beginPath();
            ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
            ctx.fill();

            if (e.y < 0) electrons.splice(i, 1);
        }

        // Legenda
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Fótons (Luz)', 10, 20);
        ctx.fillStyle = '#00A8E8';
        ctx.fillText('Elétrons (Corrente)', 10, 180);

        requestAnimationFrame(draw);
    }
    draw();
}

/* =========================================
   SIMULADORES INTERATIVOS
   ========================================= */

// Simulador 1: Intensidade
const sim1Slider = document.getElementById('sim1-intensidade');
if (sim1Slider) {
    sim1Slider.addEventListener('input', (e) => {
        const intensity = parseInt(e.target.value);
        document.getElementById('val-sim1').textContent = intensity;
        
        // Cálculo: Painel 400Wp em 1000W/m². Proporcional, mas com perda de eficiência em calor extremo (>1000)
        let efficiency = 20;
        if (intensity > 1000) efficiency = 18; // Perda por temperatura
        
        const power = (intensity / 1000) * 400 * (efficiency / 20);
        
        document.getElementById('res-sim1-pot').textContent = Math.round(power) + ' W';
        document.getElementById('res-sim1-ef').textContent = efficiency + '%';
    });
}

// Simulador 2: Horário
function setTime(time) {
    // Resetar botões
    document.querySelectorAll('#simuladores .sim-controls button').forEach(btn => {
        if (btn.parentElement === document.querySelectorAll('#simuladores .sim-controls')[1]) {
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    event.target.setAttribute('aria-pressed', 'true');

    const angulos = { 'manha': '45°', 'meio_dia': '90° (Ideal)', 'tarde': '45°', 'noite': '0°' };
    const geracao = { 'manha': '60%', 'meio_dia': '100%', 'tarde': '60%', 'noite': '0%' };
    
    document.getElementById('res-sim2-ang').textContent = angulos[time];
    document.getElementById('res-sim2-ger').textContent = geracao[time];
}

// Simulador 3: Clima
function setWeather(weather) {
    document.querySelectorAll('#simuladores .sim-controls button').forEach(btn => {
        if (btn.parentElement === document.querySelectorAll('#simuladores .sim-controls')[2]) {
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    event.target.setAttribute('aria-pressed', 'true');

    const transmissao = { 'sol': '100%', 'parcial': '60%', 'nublado': '20%' };
    const producao = { 'sol': '400 W', 'parcial': '240 W', 'nublado': '80 W' };
    
    document.getElementById('res-sim3-trans').textContent = transmissao[weather];
    document.getElementById('res-sim3-prod').textContent = producao[weather];
}

// Simulador 4: Piscina
const sim4Atual = document.getElementById('sim4-temp-atual');
const sim4Desejada = document.getElementById('sim4-temp-desejada');

function updateSim4() {
    const atual = parseInt(sim4Atual.value);
    const desejada = parseInt(sim4Desejada.value);
    
    document.getElementById('val-sim4-atual').textContent = atual;
    document.getElementById('val-sim4-desejada').textContent = desejada;
    
    const statusEl = document.getElementById('res-sim4-status');
    const consumoEl = document.getElementById('res-sim4-consumo');
    const calorEl = document.getElementById('res-sim4-calor');
    
    if (atual < desejada) {
        statusEl.textContent = 'LIGADA (Aquecendo)';
        statusEl.className = 'status-on';
        // Simulação: Para subir 1°C, consome ~1.5 kWh em uma piscina média, mas gera 4x mais calor (COP 4)
        const diff = desejada - atual;
        consumoEl.textContent = (diff * 1.5).toFixed(1) + ' kWh';
        calorEl.textContent = (diff * 6.0).toFixed(1) + ' kWh';
    } else {
        statusEl.textContent = 'DESLIGADA (Temperatura atingida)';
        statusEl.className = 'status-off';
        consumoEl.textContent = '0 kWh';
        calorEl.textContent = '0 kWh';
    }
}

if (sim4Atual) {
    sim4Atual.addEventListener('input', updateSim4);
    sim4Desejada.addEventListener('input', updateSim4);
    updateSim4();
}

// Simulador 5: Automação
const sim5Temp = document.getElementById('sim5-temp-sensor');
const sim5Luz = document.getElementById('sim5-luz-sensor');

function updateSim5() {
    const temp = parseInt(sim5Temp.value);
    const luz = parseInt(sim5Luz.value);
    
    document.getElementById('val-sim5-temp').textContent = temp;
    document.getElementById('val-sim5-luz').textContent = luz;
    
    const acaoEl = document.getElementById('res-sim5-acao');
    
    // Lógica: SE Temp < 28 E Luz > 200 (dia)
    if (temp < 28 && luz > 200) {
        acaoEl.textContent = 'LIGAR BOMBA';
        acaoEl.className = 'status-on';
    } else if (temp >= 28) {
        acaoEl.textContent = 'DESLIGAR (Temp. OK)';
        acaoEl.className = 'status-off';
    } else {
        acaoEl.textContent = 'DESLIGAR (Sem luz solar/Noite)';
        acaoEl.className = 'status-off';
    }
}

if (sim5Temp) {
    sim5Temp.addEventListener('input', updateSim5);
    sim5Luz.addEventListener('input', updateSim5);
    updateSim5();
}

/* =========================================
   QUIZ INTERATIVO
   ========================================= */
const quizData = [
    {
        q: "O que é um fóton?",
        options: ["Uma onda sonora", "Uma partícula de luz que transporta energia", "Um tipo de elétron", "Um componente do silício"],
        correct: 1,
        explanation: "Fótons são partículas elementares da luz que transportam pacotes discretos de energia (quanta)."
    },
    {
        q: "Qual material é mais comumente usado em células fotovoltaicas?",
        options: ["Cobre", "Ferro", "Silício", "Plástico"],
        correct: 2,
        explanation: "O silício é um semicondutor abundante e com propriedades ideais para o efeito fotovoltaico."
    },
    {
        q: "O que acontece na junção P-N de uma célula solar?",
        options: ["Forma-se um campo elétrico interno que separa cargas", "O silício derrete", "A luz é refletida totalmente", "Gera-se calor sem eletricidade"],
        correct: 0,
        explanation: "A junção P-N cria um campo elétrico que empurra elétrons para o lado N e lacunas para o lado P, gerando corrente."
    },
    {
        q: "Qual a diferença principal entre o efeito fotoelétrico externo e o fotovoltaico?",
        options: ["Não há diferença", "O externo arranca elétrons para o vácuo; o fotovoltaico gera pares elétron-lacuna dentro do material", "O fotovoltaico só funciona à noite", "O externo usa silício, o fotovoltaico usa vácuo"],
        correct: 1,
        explanation: "Einstein explicou o efeito externo (emissão de elétrons). O fotovoltaico é um efeito interno de geração de portadores de carga em semicondutores."
    },
    {
        q: "Por que uma capa térmica é importante para a piscina?",
        options: ["Para deixar a água colorida", "Para reduzir a evaporação e a perda de calor por radiação infravermelha", "Para aumentar o peso da água", "Para gerar eletricidade"],
        correct: 1,
        explanation: "A evaporação é a maior causa de perda de calor. A capa também bloqueia a emissão de radiação térmica (corpo negro) da água para o céu noturno."
    },
    {
        q: "O que mede um sensor LDR em um sistema de automação?",
        options: ["Temperatura da água", "Nível da água", "Intensidade da luminosidade", "Velocidade do vento"],
        correct: 2,
        explanation: "LDR (Light Dependent Resistor) varia sua resistência elétrica conforme a quantidade de luz incidente."
    },
    {
        q: "Como a temperatura ambiente afeta a eficiência de um painel fotovoltaico?",
        options: ["Quanto mais quente, melhor", "Não afeta", "Temperaturas muito altas reduzem a eficiência", "O painel congela e para de funcionar"],
        correct: 2,
        explanation: "O calor excessivo aumenta a agitação térmica dos átomos no silício, dificultando o fluxo ordenado de elétrons e reduzindo a tensão."
    },
    {
        q: "Qual é a função da Bomba de Calor no projeto da piscina?",
        options: ["Gerar luz", "Transferir calor do ar ambiente para a água usando eletricidade de forma eficiente", "Filtrar sujeira", "Gerar energia solar"],
        correct: 1,
        explanation: "A bomba de calor não aquece por resistência (Joule), mas move calor de um lugar para outro, tendo um COP (Coeficiente de Performance) maior que 1."
    },
    {
        q: "A equação E = h·f relaciona:",
        options: ["Massa e velocidade", "Energia do fóton e sua frequência", "Tensão e corrente", "Temperatura e volume"],
        correct: 1,
        explanation: "É a equação de Planck, onde E é energia, h é a constante de Planck e f é a frequência da radiação eletromagnética."
    },
    {
        q: "Se um painel tem 20% de eficiência, o que isso significa?",
        options: ["Ele funciona apenas 20% do tempo", "20% da energia solar incidente é convertida em eletricidade útil", "Ele quebra 20% das vezes", "Ele ocupa 20% do telhado"],
        correct: 1,
        explanation: "Eficiência é a razão entre a potência elétrica de saída e a potência da radiação solar que incide sobre a área do painel."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    answered = false;
    document.getElementById('quiz-next-btn').disabled = true;
    document.getElementById('quiz-progress').textContent = `Pergunta ${currentQuestion + 1} de ${quizData.length}`;
    document.getElementById('quiz-question-text').textContent = quizData[currentQuestion].q;
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    quizData[currentQuestion].options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.onclick = () => checkAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    if (answered) return;
    answered = true;
    
    const correctIndex = quizData[currentQuestion].correct;
    const options = document.querySelectorAll('.quiz-option');
    
    options[correctIndex].classList.add('correct');
    options[correctIndex].setAttribute('aria-checked', 'true');
    
    if (selectedIndex === correctIndex) {
        score++;
    } else {
        btnElement.classList.add('incorrect');
        btnElement.setAttribute('aria-checked', 'true');
    }
    
    // Mostrar explicação
    const feedback = document.createElement('p');
    feedback.style.marginTop = '15px';
    feedback.style.fontStyle = 'italic';
    feedback.style.color = 'var(--secondary)';
    feedback.textContent = "Explicação: " + quizData[currentQuestion].explanation;
    document.getElementById('quiz-options').appendChild(feedback);
    
    document.getElementById('quiz-next-btn').disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-question-box').classList.add('hidden');
    document.getElementById('quiz-result-box').classList.remove('hidden');
    
    const percentage = (score / quizData.length) * 100;
    document.getElementById('quiz-score').textContent = `Você acertou ${score} de ${quizData.length} perguntas (${percentage}%).`;
    
    let msg = "";
    if (percentage === 100) msg = "Excelente! Você domina a Física Moderna e a Energia Solar!";
    else if (percentage >= 70) msg = "Muito bom! Você tem um ótimo entendimento do tema.";
    else if (percentage >= 50) msg = "Bom, mas revise os conceitos de efeito fotoelétrico e eficiência.";
    else msg = "Continue estudando! Releia as seções sobre Física Moderna e Simuladores.";
    
    document.getElementById('quiz-feedback').textContent = msg;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-question-box').classList.remove('hidden');
    document.getElementById('quiz-result-box').classList.add('hidden');
    loadQuestion();
}

// Iniciar Quiz
loadQuestion();
