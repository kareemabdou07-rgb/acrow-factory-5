/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v14 — predominantly blue main buttons + bright yellow on press */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#063f7a 0%,#0b5fa8 70%,#2477a6 92%,#7f914e 100%)';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background-image',active?'linear-gradient(135deg,#0a5a99 0%,#2b83b8 35%,#ffd92f 100%)':base,'important');
  b.style.setProperty('background-color','#0b5fa8','important');
  b.style.setProperty('color','#ffffff','important');
  b.style.setProperty('border','2px solid #a8a14a','important');
  b.style.setProperty('font-weight','1000','important');
  b.style.setProperty('font-size','1.09em','important');
  b.style.setProperty('text-shadow','0 1px 2px rgba(0,0,0,.32)','important');
  b.style.setProperty('letter-spacing','.15px','important');
  b.style.setProperty('transition','filter .08s ease,transform .08s ease,box-shadow .08s ease,background-image .08s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 3px rgba(255,218,35,.9),0 6px 18px rgba(21,95,159,.35)','important');
    b.style.setProperty('filter','brightness(1.13) saturate(1.08)','important');
  }else{
    b.style.removeProperty('box-shadow');
    b.style.removeProperty('filter');
  }
}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,b===activeButton);});}
function boot(){apply();document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
