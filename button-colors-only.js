/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v19 — blue idle, soft yellow active, luminous yellow on press/selected */
(function(){
'use strict';
var activeText='';
var base='linear-gradient(135deg,#0b5ea8 0%,#1677c8 55%,#3f95dc 100%)';
var active='linear-gradient(135deg,#ffd84a 0%,#ffe878 55%,#fff3b0 100%)';
function textOf(b){return (b.textContent||'').replace(/\s+/g,' ').trim();}
function isMainButton(b){var t=textOf(b);return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);}
function paint(b,on){if(!b)return;b.setAttribute('data-acrow-main-color','1');b.style.setProperty('background-image',on?active:base,'important');b.style.setProperty('background-color',on?'#ffe878':'#1677c8','important');b.style.setProperty('color',on?'#17395d':'#fff','important');b.style.setProperty('border','2px solid '+(on?'#c49b00':'#084b88'),'important');b.style.setProperty('font-weight','1000','important');b.style.setProperty('font-size','1.09em','important');b.style.setProperty('text-shadow',on?'0 1px 1px rgba(255,255,255,.85)':'0 1px 2px rgba(0,0,0,.35)','important');b.style.setProperty('transition','filter .08s ease,box-shadow .08s ease,background-image .08s ease','important');if(on){b.style.setProperty('box-shadow','0 0 8px 3px rgba(255,230,70,.98),0 0 24px 9px rgba(255,215,40,.58)','important');b.style.setProperty('filter','brightness(1.08) saturate(1.08)','important');}else{b.style.removeProperty('box-shadow');b.style.removeProperty('filter');}}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,activeText!==''&&textOf(b)===activeText);});}
function choose(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeText=textOf(b);setTimeout(apply,0);}
function boot(){apply();document.addEventListener('pointerdown',choose,true);document.addEventListener('click',choose,true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
