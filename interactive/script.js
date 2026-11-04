// ProbLearn interactive calculators — no external JavaScript libraries required.
const $ = (id) => document.getElementById(id);
const number = (id) => Number($(id).value);
const pct = (v) => `${(v * 100).toFixed(2)}%`;
const fmt = (v, digits = 4) => Number.isFinite(v) ? v.toFixed(digits) : "—";
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Abramowitz-Stegun approximation to erf, accurate enough for an educational calculator.
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592)*t*Math.exp(-x*x);
  return sign * y;
}
function normalCDF(x, mean, sd) {
  return 0.5 * (1 + erf((x - mean) / (sd * Math.sqrt(2))));
}
function normalPDF(x, mean, sd) {
  const z = (x - mean) / sd;
  return Math.exp(-0.5*z*z) / (sd * Math.sqrt(2*Math.PI));
}
function validPositive(ids, message) {
  for (const id of ids) {
    if (!Number.isFinite(number(id)) || number(id) <= 0) {
      $(id).setCustomValidity(message); $(id).reportValidity(); $(id).setCustomValidity(""); return false;
    }
  }
  return true;
}
function validRange(lowId, highId) {
  if (number(lowId) >= number(highId)) {
    $(highId).setCustomValidity("Upper limit must be greater than lower limit.");
    $(highId).reportValidity(); $(highId).setCustomValidity(""); return false;
  }
  return true;
}

// Canvas chart helper. Canvas is redrawn at its actual display size for crisp lines.
function drawDistribution(canvasId, config) {
  const canvas = $(canvasId);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.floor(rect.width));
  const height = 210;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr; canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const pad = {l: 43, r: 14, t: 14, b: 31};
  const plotW = width-pad.l-pad.r, plotH = height-pad.t-pad.b;
  const {min, max, mean, pdf, lower, upper, color="#3478ee", labels=true} = config;
  const samples = 240;
  const points = [];
  let maxY = 0;
  for (let i=0;i<=samples;i++) {
    const x=min+(max-min)*i/samples, y=pdf(x);
    points.push({x,y}); maxY=Math.max(maxY,y);
  }
  maxY *= 1.16;
  const X = x => pad.l+(x-min)/(max-min)*plotW;
  const Y = y => pad.t+plotH-(y/maxY)*plotH;

  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle="#e9eef5"; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=pad.t+plotH*i/4;
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(width-pad.r,y);ctx.stroke();
  }
  const shade = (from,to,fill) => {
    const a=clamp(from,min,max), b=clamp(to,min,max);
    if(b<=a)return;
    ctx.beginPath();ctx.moveTo(X(a),Y(0));
    for(let i=0;i<=100;i++){const x=a+(b-a)*i/100;ctx.lineTo(X(x),Y(pdf(x)));}
    ctx.lineTo(X(b),Y(0));ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  };
  if (lower !== undefined && upper !== undefined) {
    shade(min,lower,"rgba(225,107,104,.23)");
    shade(lower,upper,"rgba(37,166,120,.23)");
    shade(upper,max,"rgba(225,107,104,.23)");
  } else if (lower !== undefined) shade(min,lower,"rgba(52,120,238,.18)");
  ctx.beginPath();
  points.forEach((p,i)=>{if(i===0)ctx.moveTo(X(p.x),Y(p.y));else ctx.lineTo(X(p.x),Y(p.y));});
  ctx.strokeStyle=color;ctx.lineWidth=2.7;ctx.stroke();
  const marker = (x, stroke, dash=false) => {
    if(x<min||x>max)return;
    ctx.save();ctx.strokeStyle=stroke;ctx.lineWidth=1.5;
    if(dash)ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(X(x),pad.t);ctx.lineTo(X(x),pad.t+plotH);ctx.stroke();ctx.restore();
  };
  marker(mean,"#3478ee",true);
  if(lower!==undefined)marker(lower,"#d87570");
  if(upper!==undefined)marker(upper,"#d87570");
  ctx.fillStyle="#8492a6";ctx.font="10px DM Sans, sans-serif";ctx.textAlign="center";
  for(let i=0;i<=4;i++){const x=min+(max-min)*i/4;ctx.fillText(Number(x.toPrecision(3)).toString(),X(x),height-10);}
  ctx.textAlign="left";ctx.fillText(labels?"Value":"",pad.l,10);
}

function updateNormal() {
  const mu=number("nMean"), sd=number("nSd"), lo=number("nLower"), hi=number("nUpper");
  if(!validPositive(["nSd"],"Standard deviation must be greater than zero.") || !validRange("nLower","nUpper"))return;
  const below=normalCDF(lo,mu,sd), through=normalCDF(hi,mu,sd);
  const within=clamp(through-below,0,1), above=clamp(1-through,0,1), defect=clamp(below+above,0,1);
  $("nWithin").textContent=pct(within);$("nBelow").textContent=pct(below);$("nAbove").textContent=pct(above);$("nDefect").textContent=pct(defect);
  const min=Math.min(mu-4*sd,lo-0.5*sd),max=Math.max(mu+4*sd,hi+0.5*sd);
  drawDistribution("normalChart",{min,max,mean:mu,pdf:x=>normalPDF(x,mu,sd),lower:lo,upper:hi,color:"#3478ee"});
  $("normalInterpretation").textContent=`With a mean of ${fmt(mu,4)} and standard deviation ${fmt(sd,4)}, the model estimates ${pct(within)} of components will fall between ${fmt(lo,4)} and ${fmt(hi,4)}. About ${pct(defect)} are expected to fall outside the specification limits.`;
}

function updateExponential() {
  const rate=number("eRate"), t=number("eTime");
  if(!validPositive(["eRate"],"Arrival rate must be greater than zero."))return;
  if(!Number.isFinite(t)||t<0){$("eTime").setCustomValidity("Waiting time cannot be negative.");$("eTime").reportValidity();$("eTime").setCustomValidity("");return;}
  const mean=1/rate, by=-Math.expm1(-rate*t), after=Math.exp(-rate*t), density=rate*after;
  $("eMean").textContent=`${fmt(mean,3)} s`;$("eBy").textContent=pct(by);$("eAfter").textContent=pct(after);$("eDensity").textContent=fmt(density,4);
  const max=Math.max(4/rate,t*1.35,0.1);
  drawDistribution("expChart",{min:0,max,mean:1/rate,pdf:x=>rate*Math.exp(-rate*x),lower:t,color:"#8064d8"});
  $("expInterpretation").textContent=`At an average arrival rate of ${fmt(rate,3)} requests per second, the mean waiting time is ${fmt(mean,3)} seconds. The probability that the next request arrives within ${fmt(t,3)} seconds is ${pct(by)}.`;
}

function updateCLT() {
  const mu=number("cMean"), sd=number("cSd"), n=number("cN"), lo=number("cLower"), hi=number("cUpper");
  if(!validPositive(["cSd"],"Population standard deviation must be greater than zero."))return;
  if(!Number.isInteger(n)||n<1){$("cN").setCustomValidity("Sample size must be a positive whole number.");$("cN").reportValidity();$("cN").setCustomValidity("");return;}
  if(!validRange("cLower","cUpper"))return;
  const se=sd/Math.sqrt(n), below=normalCDF(lo,mu,se), through=normalCDF(hi,mu,se), within=clamp(through-below,0,1), above=clamp(1-through,0,1);
  $("cSE").textContent=`${fmt(se,3)} min`;$("cWithin").textContent=pct(within);$("cBelow").textContent=pct(below);$("cAbove").textContent=pct(above);
  const min=Math.min(mu-4*se,lo-0.5*se),max=Math.max(mu+4*se,hi+0.5*se);
  drawDistribution("cltChart",{min,max,mean:mu,pdf:x=>normalPDF(x,mu,se),lower:lo,upper:hi,color:"#15966b"});
  $("cltInterpretation").textContent=`For samples of ${n} orders, the standard error is ${fmt(se,3)} minutes. The normal approximation estimates a ${pct(within)} chance that the sample mean lies between ${fmt(lo,3)} and ${fmt(hi,3)} minutes.`;
}

function bind(ids, update) { ids.forEach(id => $(id).addEventListener("input", update)); }
bind(["nMean","nSd","nLower","nUpper"],updateNormal);
bind(["eRate","eTime"],updateExponential);
bind(["cMean","cSd","cN","cLower","cUpper"],updateCLT);

$("normalReset").addEventListener("click",()=>{Object.entries({nMean:10,nSd:.05,nLower:9.9,nUpper:10.1}).forEach(([k,v])=>$(k).value=v);updateNormal();});
$("expReset").addEventListener("click",()=>{Object.entries({eRate:2,eTime:1}).forEach(([k,v])=>$(k).value=v);updateExponential();});
$("cltReset").addEventListener("click",()=>{Object.entries({cMean:30,cSd:8,cN:36,cLower:27,cUpper:33}).forEach(([k,v])=>$(k).value=v);updateCLT();});

$("menuToggle").addEventListener("click",()=>{const nav=$("nav"),open=nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>{$("nav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");}));
window.addEventListener("resize",()=>{updateNormal();updateExponential();updateCLT();});
updateNormal();updateExponential();updateCLT();
