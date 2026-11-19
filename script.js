try{new window.VLibras.Widget('https://vlibras.gov.br/app')}catch(e){}
const $=i=>document.getElementById(i),R=document.documentElement;
const pages=[['inicio','Início'],['ondas','Ondas'],['corpo-negro','Corpo negro'],['fotoeletrico','Efeito fotoelétrico'],['piscina','Projeto da Piscina'],['sensores','Sensores'],['libras','Libras'],['quiz','Quiz'],['impacto','Impacto social'],['acessibilidade','Acessibilidade'],['mapa','Mapa do site']];
$('menu').innerHTML=pages.map(p=>`<li><a href="#${p[0]}">${p[1]}</a></li>`).join('');
$('mapaLista').innerHTML=pages.map(p=>`<li><a href="#${p[0]}">${p[1]}</a></li>`).join('');
function route(){let h=location.hash.slice(1);if(!pages.some(p=>p[0]===h))h='inicio';
document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!==h);
document.querySelectorAll('#menu a').forEach(a=>a.getAttribute('href')==='#'+h?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
document.title=pages.find(p=>p[0]===h)[1]+' · Sol + Água';
const t=document.querySelector('#'+h+' h1');if(t){t.tabIndex=-1;t.focus({preventScroll:true})}scrollTo(0,0);draw()}
addEventListener('hashchange',route);
// acessibilidade
let S={c:0,d:0,m:0,t:0,fs:100};
try{S=Object.assign(S,JSON.parse(localStorage.getItem('sa')||'{}'))}catch(e){}
function apply(){R.dataset.contrast=S.c?'alto':'';document.body.classList.toggle('disl',!!S.d);document.body.classList.toggle('nomotion',!!S.m);
if(S.t)R.dataset.theme='dark';else R.removeAttribute('data-theme');R.style.setProperty('--fs',S.fs+'%');
$('bContraste').setAttribute('aria-pressed',!!S.c);$('bDisl').setAttribute('aria-pressed',!!S.d);$('bMov').setAttribute('aria-pressed',!!S.m);$('bTema').setAttribute('aria-pressed',!!S.t);
try{localStorage.setItem('sa',JSON.stringify(S))}catch(e){}}
if(matchMedia('(prefers-reduced-motion:reduce)').matches)S.m=1;
$('bContraste').onclick=()=>{S.c=!S.c;apply()};$('bDisl').onclick=()=>{S.d=!S.d;apply()};$('bMov').onclick=()=>{S.m=!S.m;apply()};$('bTema').onclick=()=>{S.t=!S.t;apply()};
$('bMais').onclick=()=>{S.fs=Math.min(160,S.fs+10);apply()};$('bMenos').onclick=()=>{S.fs=Math.max(80,S.fs-10);apply()};
// ondas
const sci=x=>x.toExponential(2).replace('e+',' × 10^').replace('e-',' × 10^-');
function bandaOnda(l){return l<1e-11?'Raios gama':l<1e-8?'Raios X':l<3.8e-7?'Ultravioleta':l<7.5e-7?'Luz visível':l<1e-3?'Infravermelho':l<1e-1?'Micro-ondas':'Ondas de rádio'}
function corVis(l){const n=l*1e9;if(n<380||n>750)return'#e6fbff';return'hsl('+Math.round(270-(n-380)/370*270)+',100%,60%)'}
let ph=0;
function drawOnda(){const l=Math.pow(10,+$('lam').value),f=3e8/l,E=1.2398e-6/l;
$('lamv').textContent=sci(l)+' m';
$('oOnda').innerHTML=`<strong>${bandaOnda(l)}</strong><br>Frequência: ${sci(f)} Hz<br>Energia do fóton: ${sci(E)} eV`;
const c=$('cOnda'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
const cyc=2+(3-(+$('lam').value))*1.1;g.strokeStyle=corVis(l);g.lineWidth=3;g.beginPath();
for(let x=0;x<=c.width;x++){const y=100+70*Math.sin(x/c.width*cyc*2*Math.PI-ph);x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
// corpo negro
function planck(l,T){return 1/(Math.pow(l,5)*(Math.exp(14388/(l*T))-1))}
function drawBB(){const T=+$('tk').value,lm=2898/T,xm=Math.max(3,lm*5);$('tkv').textContent=T+' K ('+(T-273.15).toFixed(0)+' °C)';
const c=$('cBB'),g=c.getContext('2d'),W=c.width,H=c.height;g.clearRect(0,0,W,H);
const vx=a=>40+(a/xm)*(W-50);g.fillStyle='rgba(250,204,21,.25)';g.fillRect(vx(.38),10,Math.max(2,vx(.75)-vx(.38)),H-40);
let pk=planck(lm,T);g.strokeStyle='#fbbf24';g.lineWidth=3;g.beginPath();
for(let i=1;i<=300;i++){const l=xm*i/300,y=H-30-(planck(l,T)/pk)*(H-50);i>1?g.lineTo(vx(l),y):g.moveTo(vx(l),y)}g.stroke();
g.fillStyle='#e6fbff';g.font='14px sans-serif';g.fillText('0',36,H-12);g.fillText(xm.toFixed(1)+' µm',W-70,H-12);g.fillText('faixa visível (amarelo)',vx(.38)+4,24);
g.strokeStyle='#e6fbff';g.beginPath();g.moveTo(40,H-30);g.lineTo(W-10,H-30);g.stroke();
const P=5.67e-8*Math.pow(T,4);
$('oBB').innerHTML=`Pico (Wien): <strong>${lm.toFixed(2)} µm</strong> (${lm<.38?'ultravioleta':lm<.75?'visível':'infravermelho'})<br>Potência emitida: <strong>${P>1e5?sci(P):P.toFixed(0)} W/m²</strong>`}
// fotoelétrico
let parts=[];
function feState(){const phi=+$('met').value,l=+$('fl').value,I=+$('fi').value,E=1239.84/l,Ec=E-phi;
$('flv').textContent=l+' nm';$('fiv').textContent=I+'%';return{phi,l,I,E,Ec}}
function drawFE(){const s=feState(),c=$('cFE'),g=c.getContext('2d'),W=c.width,H=c.height;g.clearRect(0,0,W,H);
g.fillStyle='#94a3b8';g.fillRect(W-120,40,30,H-80);g.fillStyle='#e6fbff';g.font='14px sans-serif';g.fillText('Placa',W-125,H-20);
const emit=s.Ec>0;
$('oFE').innerHTML=`Energia do fóton: <strong>${s.E.toFixed(2)} eV</strong> · φ = ${s.phi} eV<br>`+(emit?`Elétrons emitidos com Ec máx. = <strong>${s.Ec.toFixed(2)} eV</strong>. Corrente relativa: <strong>${s.I}%</strong>.`:`<strong>Nenhum elétron é emitido.</strong> O fóton tem menos energia que φ; aumentar a intensidade não resolve. Diminua o comprimento de onda.`);
if(Math.random()<s.I/100*.6)parts.push({x:20,y:50+Math.random()*(H-100),t:0});
const col=corVis(s.l*1e-9);
parts.forEach(p=>{if(p.t===0){p.x+=6;g.fillStyle=col==='#e6fbff'?'#c4b5fd':col;g.beginPath();g.arc(p.x,p.y,5,0,7);g.fill();if(p.x>=W-120){p.t=emit?1:2;p.v=2+s.Ec*1.5}}
else if(p.t===1){p.x-=p.v;g.fillStyle='#38bdf8';g.beginPath();g.arc(p.x,p.y,4,0,7);g.fill()}});
parts=parts.filter(p=>p.t!==2&&p.x>0);if(parts.length>150)parts.shift()}
// piscina
let capa=false;
$('bCapa').onclick=()=>{capa=!capa;$('bCapa').setAttribute('aria-pressed',capa);$('bCapa').textContent='Capa térmica: '+(capa?'ligada':'desligada');drawPi()};
function drawPi(){const v=i=>+$(i).value,A=v('pa'),Tw=v('pt')+273.15,Ts=v('pc')+273.15,s=5.67e-8;
const perda=.96*s*A*(Math.pow(Tw,4)-Math.pow(Ts,4))/1000,perdaC=perda*.15,usa=capa?perdaC:perda;
const kwhN=usa*10,kwhEco=(perda-perdaC)*10,col=v('ac')*v('gi')*.6/1000,pv=v('ap')*v('gi')*.2/1000,bc=pv*4;
$('oPi').innerHTML=`Perda por radiação à noite: <strong>${usa.toFixed(2)} kW</strong> (≈ ${kwhN.toFixed(1)} kWh em 10 h).<br>A capa evita cerca de <strong>${kwhEco.toFixed(1)} kWh</strong> por noite.<br>Calor do coletor: <strong>${col.toFixed(1)} kW</strong> · Eletricidade fotovoltaica: <strong>${pv.toFixed(1)} kW</strong> → bomba de calor: <strong>${bc.toFixed(1)} kW</strong> de calor.`;
const mx=Math.max(perda,col,bc,.1);const b=(n,x,c)=>`<p style="margin:.3rem 0"><span>${n}: ${x.toFixed(2)} kW</span></p><div class="bar ${c}" style="width:${Math.max(3,x/mx*100)}%"></div>`;
$('barras').innerHTML=b('Perda sem capa',perda,'')+b('Perda com capa',perdaC,'')+b('Ganho do coletor solar',col,'s')+b('Calor via fotovoltaico + bomba de calor',bc,'s')}
['pa','pt','pc','ac','ap','gi'].forEach(i=>$(i).addEventListener('input',drawPi));
// sensores
function drawSe(){const G=+$('sl').value,Tc=+$('sc').value,Tp=+$('sp').value;$('slv').textContent=G;$('scv').textContent=Tc;$('spv').textContent=Tp;
const bomba=G>200&&Tc>Tp+5,capa=G<50;
$('oSe').innerHTML=`<span class="led ${bomba?'on':'off'}"></span>Bomba de circulação: <strong>${bomba?'LIGADA':'desligada'}</strong><br><span class="led ${capa?'on':'off'}"></span>Capa térmica: <strong>${capa?'FECHADA (noite)':'aberta'}</strong><br>${bomba?'O coletor está mais quente que a piscina: a água circula e leva calor.':G<=200?'Pouca luz: a bomba fica desligada para não gastar energia.':'Coletor sem diferença suficiente de temperatura: aguardando.'}`}
['sl','sc','sp'].forEach(i=>$(i).addEventListener('input',drawSe));
$('lam').addEventListener('input',drawOnda);$('tk').addEventListener('input',drawBB);
['met','fl','fi'].forEach(i=>$(i).addEventListener('input',drawFE));
document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{$('tk').value=b.dataset.t;drawBB()});
function draw(){drawOnda();drawBB();drawFE();drawPi();drawSe()}
function loop(){if(!S.m){ph+=.06;const h=location.hash.slice(1);if(h==='ondas')drawOnda();if(h==='fotoeletrico')drawFE()}requestAnimationFrame(loop)}
// libras
const terms=[['Onda eletromagnética','Perturbação que transporta energia pelo espaço.'],['Radiação infravermelha','Radiação de calor, que todo corpo morno emite.'],['Corpo negro','Objeto ideal que absorve toda a luz e emite conforme a temperatura.'],['Fóton','Pacote de energia da luz.'],['Efeito fotoelétrico','Luz que arranca elétrons de um material.'],['Painel fotovoltaico','Converte luz em eletricidade.'],['Coletor solar','Absorve luz do Sol e aquece a água.'],['Sensor','Dispositivo que mede luz, temperatura ou outra grandeza.']];
$('libGrid').innerHTML=terms.map(t=>`<figure class="card lib"><video controls preload="none" aria-label="Vídeo em Libras: ${t[0]}"><track kind="captions" srclang="pt-BR" label="Português" src=""></video><figcaption><strong>${t[0]}</strong><br>${t[1]}<br><small>Vídeo em Libras a gravar.</small></figcaption></figure>`).join('');
// quiz
const qz=[['Em que faixa a água da piscina emite mais radiação?',['Ultravioleta','Visível','Infravermelho'],2,'A cerca de 301 K, Wien dá pico perto de 9,6 µm: infravermelho.'],['O que a capa térmica reduz à noite?',['A perda de calor para o céu','A radiação do Sol','A corrente elétrica'],0,'Ela bloqueia a troca de radiação e a evaporação.'],['Luz com energia menor que φ, com intensidade altíssima, arranca elétrons?',['Sim, muitos','Não, nenhum','Só se for azul'],1,'Cada fóton age sozinho: sem energia suficiente, não há emissão.'],['Qual lei relaciona a potência emitida a T⁴?',['Wien','Stefan-Boltzmann','Ohm'],1,'P/A = σT⁴.'],['Quando a bomba de circulação deve ligar?',['Sempre','Quando o coletor está mais quente que a piscina e há sol','Só à noite'],1,'Assim a água leva calor, sem gastar energia à toa.']];
let qi=0,qp=0;
function quiz(){const q=qz[qi];if(!q){$('qz').innerHTML=`<p class="out">Você acertou <strong>${qp} de ${qz.length}</strong>.</p><button id="qr">Refazer</button>`;$('qr').onclick=()=>{qi=0;qp=0;quiz()};return}
$('qz').innerHTML=`<h2>${qi+1}. ${q[0]}</h2>`+q[1].map((o,i)=>`<button class="qo" data-i="${i}">${o}</button>`).join('')+'<div class="out" id="qf" aria-live="polite"></div>';
document.querySelectorAll('.qo').forEach(b=>b.onclick=()=>{const ok=+b.dataset.i===q[2];if(ok)qp++;document.querySelectorAll('.qo').forEach(x=>x.disabled=true);$('qf').innerHTML=(ok?'✅ Correto! ':'❌ Não foi dessa vez. ')+q[3]+' <button
