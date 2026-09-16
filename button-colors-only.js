/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v16 — strong blue + luminous yellow active */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#012653 0%,#0056a6 58%,#087ed0 100%)';
function isMainButton(b){var t=(b.textContent||'').replace(/\s+/g,' ').trim();return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);}
function paint(b,active){if(!b)return;b.setAttribute('data-acrow-main-color','1');b.style.setProperty('background-image',active?'linear-gradient(135deg,#005bb0 0%,#18a0d8 38%,#fff200 100%)':base,'important');b.style.setProperty('background-color','#0056a6','important');b.style.setProperty('color','#fff','important');b.style.setProperty('border','2px solid #d2c200','important');b.style.setProperty('font-weight','1000','important');b.style.setProperty('font-size','1.09em','important');b.style.setProperty('text-shadow','0 1px 2px rgba(0,0,0,.4)','important');b.style.setProperty('transition','filter .08s ease,box-shadow .08s ease,background-image .08s ease','important');if(active){b.style.setProperty('box-shadow','0 0 5px 3px rgba(255,242,0,.95),0 0 18px 6px rgba(255,225,0,.55)','important');b.style.setProperty('filter','brightness(1.18) saturate(1.15)','important');}else{b.style.removeProperty('box-shadow');b.style.removeProperty('filter');}}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,b===activeButton);});}
function boot(){apply();document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
