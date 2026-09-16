/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v8 — blue + yellow + green on every main button */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(110deg,#1268ff 0%,#1268ff 28%,#ffd21f 50%,#ffd21f 58%,#20b968 82%,#20b968 100%)';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background-image',base,'important');
  b.style.setProperty('background-color','#ffd21f','important');
  b.style.setProperty('color','#111827','important');
  b.style.setProperty('border','2px solid #ffd21f','important');
  b.style.setProperty('font-weight','900','important');
  b.style.setProperty('transition','filter .15s ease,transform .15s ease,box-shadow .15s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 3px rgba(255,210,31,.5),0 5px 16px rgba(0,0,0,.22)','important');
    b.style.setProperty('filter','saturate(1.15) brightness(1.05)','important');
  }else{
    b.style.removeProperty('box-shadow');
    b.style.removeProperty('filter');
  }
}
function apply(){document.querySelectorAll('button').forEach(function(b){if(isMainButton(b))paint(b,b===activeButton);});}
function boot(){apply();document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!isMainButton(b))return;activeButton=b;apply();},true);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();