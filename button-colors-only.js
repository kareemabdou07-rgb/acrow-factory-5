/* ACROW Factory 5 — main buttons: blue + light yellow, active luminous yellow */
/* v20 */
(function(){
'use strict';
var activeText='';
var base='linear-gradient(135deg,#0759a0 0%,#1878c9 58%,#ffd84a 100%)';
var active='linear-gradient(135deg,#ffe100 0%,#fff36a 52%,#fffbd0 100%)';
function textOf(b){return (b.textContent||'').replace(/\s+/g,' ').trim();}
function isMainButton(b){var t=textOf(b);return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);}
function paint(b,on){if(!b)return;b.setAttribute('data-acrow-main-color','1');b.style.setProperty('background-image',on?active:base,'important');b.style.setProperty('background-color',on?'#fff36a':'#1878c9','important');b.style.setProperty('color',on?'#17395d':'#fff','important');b.style.setProperty('border','2px solid '+(on?'#d2aa00':'#084b88'),'important');b.style.setProperty('font-weight','1000','important');b.style.setProperty('font-size','1.09em','important');b.style.setProperty('transition','filter .08s ease,box-shadow .08s ease,background-image .08s ease','important');if(on){b.style.setProperty('box-shadow','0 0 9px 4px rgba(255,238,50,.98),0 0 26px 10px rgba(255,214,0,.62)','important');b.style.setProperty('filter','brightness(1.12) saturate(1.1)','important');}else{b.style.removeProperty('box-shadow');b.style.removeProperty('filter');}}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,activeText!==''&&textOf(b)===activeText);});}
function choose(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeText=textOf(b);setTimeout(apply,0);}
function boot(){apply();document.addEventListener('pointerdown',choose,true);document.addEventListener('click',choose,true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();