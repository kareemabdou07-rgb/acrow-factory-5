/* ACROW Factory 5 — main buttons: blue with an ultra-light yellow border */
/* v26 — 5S/Safety removed */
(function(){
'use strict';
var activeText='';
var base='linear-gradient(135deg,#245f91 0%,#3b82b8 100%)';
var active='linear-gradient(135deg,#e6d56a 0%,#f1e8a8 55%,#faf7dc 100%)';
function textOf(b){return (b.textContent||'').replace(/\s+/g,' ').trim();}
function isMainButton(b){var t=textOf(b);return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);}
function paint(b,on){if(!b)return;b.setAttribute('data-acrow-main-color','1');b.style.setProperty('background-image',on?active:base,'important');b.style.setProperty('background-color',on?'#f1e8a8':'#3b82b8','important');b.style.setProperty('color',on?'#31475a':'#fff','important');b.style.setProperty('border','2px solid '+(on?'#d8c766':'rgba(216,199,102,.18)'),'important');b.style.setProperty('font-weight','900','important');b.style.setProperty('font-size','1.09em','important');b.style.setProperty('transition','filter .08s ease,box-shadow .08s ease,background-image .08s ease','important');if(on){b.style.setProperty('box-shadow','0 0 7px 2px rgba(226,211,105,.55),0 0 16px 5px rgba(220,200,80,.22)','important');b.style.setProperty('filter','brightness(1.04)','important');}else{b.style.removeProperty('box-shadow');b.style.removeProperty('filter');}}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,activeText!==''&&textOf(b)===activeText);});}
function choose(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeText=textOf(b);setTimeout(apply,0);}
function boot(){apply();document.addEventListener('pointerdown',choose,true);document.addEventListener('click',choose,true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();