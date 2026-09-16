/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v17 — yellow main buttons + luminous yellow active */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#f2c400 0%,#ffd21f 55%,#ffe66a 100%)';
function isMainButton(b){var t=(b.textContent||'').replace(/\s+/g,' ').trim();return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);}
function paint(b,active){if(!b)return;b.setAttribute('data-acrow-main-color','1');b.style.setProperty('background-image',active?'linear-gradient(135deg,#ffe600 0%,#fff200 48%,#fffbd0 100%)':base,'important');b.style.setProperty('background-color','#ffd21f','important');b.style.setProperty('color','#12365a','important');b.style.setProperty('border','2px solid #b38f00','important');b.style.setProperty('font-weight','1000','important');b.style.setProperty('font-size','1.09em','important');b.style.setProperty('text-shadow','0 1px 1px rgba(255,255,255,.7)','important');b.style.setProperty('transition','filter .08s ease,box-shadow .08s ease,background-image .08s ease','important');if(active){b.style.setProperty('box-shadow','0 0 7px 3px rgba(255,242,0,.98),0 0 22px 8px rgba(255,220,0,.62)','important');b.style.setProperty('filter','brightness(1.15) saturate(1.12)','important');}else{b.style.removeProperty('box-shadow');b.style.removeProperty('filter');}}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,b===activeButton);});}
function boot(){apply();document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
