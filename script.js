(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var R=document.documentElement;
var pages=['inicio','ciencia','simuladores','automacao','quiz','acessibilidade','mapa'];
var names={inicio:'Início',ciencia:'Ciência: funcionamento, equações, tecnologias',simuladores:'Simuladores: dimensionamento e temperatura',automacao:'Automação do consumo',quiz:'Quiz',acessibilidade:'Acessibilidade, Libras e VLibras',mapa:'Mapa do site'};
function fmt(n,d){return n.toLocaleString('pt-BR',{maximumFractionDigits:d==null?0:d,minimumFractionDigits:d==null?0:d})}
// mapa do site
$('#sm').innerHTML=pages.map(function(p){return'<li><a href="#'+p+'">'+names[p]+'</a></li>'}).join('');
// roteamento
function route(h){
 h=(typeof h==='string'?h:(location.hash||'#inicio').slice(1));if(pages.indexOf(h)<0)h='inicio';
 $$('section.pg').forEach(function(s){s.classList.toggle('on',s.dataset.p===h)});
 $$('nav a').forEach(function(a){if(a.getAttribute('href')==='#'+h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 closeMenu();document.title=names[h].split(':')[0]+' · Sol + Água';
 window.scrollTo(0,0);var t=$('#h-'+({simuladores:'sim',automacao:'aut',acessibilidade:'ac'}[h]||h));if(t){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}
}
addEventListener('hashchange',function(){route()});
document.addEventListener('click',function(e){
 var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a||a.id==='skip')return;
 var h=a.getAttribute('href').slice(1);if(pages.indexOf(h)<0)return;
 e.preventDefault();try{if(location.hash!=='#'+h)location.hash=h}catch(x){}route(h);
});
$('#skip').onclick=function(e){e.preventDefault();$('#conteudo').focus()};
// menu
function closeMenu(){$('#menu').classList.remove('open');$('#bg').setAttribute('aria-expanded','false')}
$('#bg').onclick=function(){var o=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',o)};
addEventListener('keydown',function(e){if(e.key==='Escape'){closeMenu();$('#bg').focus()}});
// preferências
var P={fs:100,c:0,d:0,t:0,m:0};
try{P=Object.assign(P,JSON.parse(localStorage.getItem('sa-prefs')||'{}'))}catch(e){}
function apply(){
 R.style.setProperty('--fs',P.fs+'%');
 P.c?R.setAttribute('data-contrast','high'):R.removeAttribute('data-contrast');
 P.d?R.setAttribute('data-dys','on'):R.removeAttribute('data-dys');
 P.m?R.setAttribute('data-motion','off'):R.removeAttribute('data-motion');
 if(P.t)R.setAttribute('data-theme','dark');else R.removeAttribute('data-theme');
 $('#tc').setAttribute('aria-pressed',!!P.c);$('#td').setAttribute('aria-pressed',!!P.d);$('#tt').setAttribute('aria-pressed',!!P.t);$('#tm').setAttribute('aria-pressed',!!P.m);
 try{localStorage.setItem('sa-prefs',JSON.stringify(P))}catch(e){}
}
$('#fm').onclick=function(){P.fs=Math.max(80,P.fs-10);apply()};
$('#fp').onclick=function(){P.fs=Math.min(160,P.fs+10);apply()};
$('#tc').onclick=function(){P.c=P.c?0:1;apply()};
$('#td').onclick=function(){P.d=P.d?0:1;apply()};
$('#tt').onclick=function(){P.t=P.t?0:1;apply()};
$('#tm').onclick=function(){P.m=P.m?0:1;apply()};
if(!('t' in JSON.parse((function(){try{return localStorage.getItem('sa-prefs')||'{}'}catch(e){return'{}'}})())) && matchMedia('(prefers-color-scheme:dark)').matches)P.t=1;
apply();
// passos
var steps=[
['Fótons chegam à célula','A luz solar é composta de fótons. Cada fóton carrega energia E = h·c/λ. Fótons com energia abaixo de 1,12 eV (infravermelho distante) atravessam o silício sem efeito, e a energia que sobra nos fótons azuis vira calor. Essa é uma das principais perdas.'],
['Pares elétron-lacuna','Um fóton com energia suficiente libera um elétron, deixando uma lacuna (ausência de elétron). O par é criado em milissegundos e precisa ser separado antes de se recombinar.'],
['A junção p-n separa as cargas','O campo elétrico interno da junção empurra elétrons para o lado n e lacunas para o lado p. É esse campo que cria a tensão: cerca de 0,6 V por célula de silício.'],
['Surge a corrente elétrica','Ligando uma carga entre os contatos, os elétrons percorrem o circuito e voltam. Cerca de 60 a 72 células em série formam um módulo de 30 a 50 V em corrente contínua, que o inversor converte em corrente alternada.']];
function showStep(i){$('#step').innerHTML='<h3>'+steps[i][0]+'</h3><p>'+steps[i][1]+'</p>';$$('[data-s]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s==i)})}
$$('[data-s]').forEach(function(b){b.onclick=function(){showStep(+b.dataset.s)}});showStep(0);
// sim 1
function s1(){
 var c=+$('#cons').value||0,h=+$('#cid').value,t=+$('#tar').value||0,w=+$('#wp').value,k=+$('#cst').value||0,pr=.8;
 var kwp=c/(h*30*pr),n=Math.ceil(kwp*1000/w),real=n*w/1000,gen=real*h*30*pr,use=Math.min(gen,c);
 var eco=use*t,inv=real*k,pb=eco>0?inv/(eco*12):0;
 var co=gen*12*.05;
 $('#o1').innerHTML=[['Placas',n],['Potência',fmt(real,2)+' kWp'],['Área',fmt(n*2.6)+' m²'],['Geração',fmt(gen)+' kWh/mês'],['Economia',fmt(eco*1,0)+' R$/mês'],['Retorno',fmt(pb,1)+' anos'],['CO₂ evitado',fmt(co)+' kg/ano']].map(function(x){return'<div>'+x[0]+'<strong>'+x[1]+'</strong></div>'}).join('');
}
['cons','cid','tar','wp','cst'].forEach(function(i){$('#'+i).addEventListener('input',s1)});s1();
// sim 2
function s2(){
 var g=+$('#g').value,ta=+$('#ta').value;$('#gv').textContent=g;$('#tv').textContent=ta;
 function pw(G){var tc=ta+(45-20)/800*G;return{tc:tc,r:(G/1000)*(1-.0035*(tc-25))}}
 var m=pw(g),pct=Math.max(0,m.r*100);
 $('#o2').innerHTML='<div>Temp. da célula<strong>'+fmt(m.tc)+' °C</strong></div><div>Potência<strong>'+fmt(pct)+'%</strong></div><div>Placa de 550 W<strong>'+fmt(5.5*pct)+' W</strong></div>';
 $('#b2').style.width=Math.min(100,pct)+'%';
 var pts=[],tot=0;for(var h=6;h<=18;h+=.5){var G=g*Math.pow(Math.sin(Math.PI*(h-6)/12),1.3),v=Math.max(0,pw(G).r*100);tot+=v*.5/100;pts.push([20+(h-6)*(280/12),120-v*.9])}
 var d='M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' L');
 var tk=[6,9,12,15,18].map(function(h){var x=20+(h-6)*(280/12);return'<text x="'+x+'" y="136" font-size="9" text-anchor="middle" fill="var(--mu)">'+h+'h</text>'}).join('');
 $('#gr').innerHTML='<line x1="20" y1="120" x2="310" y2="120" stroke="var(--bd)"/><path d="'+d+' L300 120 L20 120Z" fill="var(--sun)" opacity=".55"/><path d="'+d+'" fill="none" stroke="var(--pr)" stroke-width="2.5"/>'+tk;
 $('#grt').textContent='Equivale a cerca de '+fmt(tot,1)+' horas de produção na potência nominal ao longo do dia.';
}
['g','ta'].forEach(function(i){$('#'+i).addEventListener('input',s2)});s2();
// automação
var ap=[['Chuveiro elétrico (5,5 kW, 0,7 h)',3.85,1],['Máquina de lavar (0,5 kW, 1,5 h)',.75,1],['Ar-condicionado (1 kW, 4 h)',4,1],['Ferro de passar (1 kW, 0,5 h)',.5,1],['Bomba d’água (0,75 kW, 1 h)',.75,1],['Geladeira (1,2 kWh/dia, fixa)',1.2,0]];
$('#ap').innerHTML=ap.map(function(a,i){return'<div class="row"><input type="checkbox" id="ap'+i+'"'+(a[2]?'':' disabled')+'><label for="ap'+i+'">'+a[0]+'</label></div>'}).join('');
function s3(){
 var tot=0,sol=0;ap.forEach(function(a,i){var on=a[2]&&$('#ap'+i).checked;tot+=a[1];sol+=a[1]*(a[2]?(on?.85:.25):.4)});
 var p=sol/tot*100;
 $('#o3').innerHTML='<div>Consumo<strong>'+fmt(tot,1)+' kWh/dia</strong></div><div>Usado direto do sol<strong>'+fmt(sol,1)+' kWh</strong></div><div>Autoconsumo<strong>'+fmt(p)+'%</strong></div>';
 $('#b3').style.width=p+'%';
}
$$('#ap input').forEach(function(i){i.addEventListener('change',s3)});s3();
// quiz
var Q=[
['Qual fenômeno físico gera eletricidade na placa?',['Efeito fotovoltaico','Efeito Joule','Indução magnética'],0,'Fótons liberam elétrons no semicondutor.'],
['O que acontece com a potência quando a placa esquenta?',['Aumenta','Diminui, cerca de 0,35% por °C acima de 25 °C','Não muda'],1,'O coeficiente de temperatura do silício é negativo.'],
['Qual equipamento converte corrente contínua em alternada?',['Diodo de bypass','Inversor','Controlador de carga'],1,'O inversor também realiza o MPPT.'],
['Qual o melhor horário para ligar cargas flexíveis em casa com placas?',['Por volta das 10h às 15h','Depois das 20h','De madrugada'],0,'É quando a geração é maior.']];
var qi=0,sc=0;
function q(){var z=$('#qz');
 if(qi>=Q.length){z.innerHTML='<div class="card sun"><h2 style="margin-top:0">Você acertou '+sc+' de '+Q.length+'</h2><button id="rq">Refazer</button></div>';$('#rq').onclick=function(){qi=0;sc=0;q()};return}
 var x=Q[qi];z.innerHTML='<div class="card water"><h2 style="margin-top:0">Pergunta '+(qi+1)+' de '+Q.length+'</h2><p>'+x[0]+'</p><div class="tabs" role="group" aria-label="Alternativas" style="flex-direction:column;align-items:flex-start">'+x[1].map(function(o,i){return'<button data-o="'+i+'">'+o+'</button>'}).join('')+'</div><p id="fb" role="status" aria-live="polite"></p></div>';
 $$('[data-o]',z).forEach(function(b){b.onclick=function(){var ok=+b.dataset.o===x[2];if(ok)sc++;$$('[data-o]',z).forEach(function(k){k.disabled=true});$('#fb').innerHTML=(ok?'Correto. ':'Não foi dessa vez. ')+x[3]+' <button id="nx">'+(qi<Q.length-1?'Próxima':'Ver resultado')+'</button>';$('#nx').focus();$('#nx').onclick=function(){qi++;q();var h=$('#qz button');if(h)h.focus()}}});
}
q();
// Libras: vídeos
$$('.libras').forEach(function(f){
 var v=document.createElement('video');v.controls=true;v.preload='metadata';v.setAttribute('playsinline','');v.setAttribute('aria-label',f.dataset.t||'Vídeo em Libras');
 if(f.dataset.vtt){var t=document.createElement('track');t.kind='captions';t.src=f.dataset.vtt;t.srclang='pt';t.label='Português';v.appendChild(t)}
 var ph=document.createElement('div');ph.className='lib';ph.hidden=true;ph.textContent='Vídeo em Libras em breve. Leia a transcrição abaixo.';
 v.addEventListener('error',function(){v.hidden=true;ph.hidden=false});
 v.src=f.dataset.src;f.insertBefore(ph,f.firstChild);f.insertBefore(v,f.firstChild);
});
// VLibras
var vlOk=false;
function vls(m){var e=$('#vls');if(e)e.textContent=m}
function loadVL(){
 if(vlOk){vls('VLibras ativo: clique no botão de mãos no canto da tela.');return}
 if(!$('[vw]')){var w=document.createElement('div');w.setAttribute('vw','');w.className='enabled';w.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';document.body.appendChild(w)}
 var s=document.createElement('script');s.src='https://vlibras.gov.br/app/vlibras-plugin.js';
 s.onload=function(){try{new window.VLibras.Widget('https://vlibras.gov.br/app');vlOk=true;vls('VLibras ativo: clique no botão de mãos no canto da tela.')}catch(e){vls('Não foi possível iniciar o VLibras.')}};
 s.onerror=function(){vls('VLibras indisponível nesta página ou sem internet. Os vídeos em Libras e as transcrições continuam disponíveis.')};
 document.head.appendChild(s);
}
$('#vl').onclick=loadVL;loadVL();
route();
})();
