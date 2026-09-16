/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v9 — blue-dominant; light yellow accent; active button remains blue */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#155f9f 0%,#237fba 52%,#cdb85a 100%)';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background-image',base,'important');
  b.style.setProperty('background-color','#237fba','important');
  b.style.setProperty('color','#ffffff','important');
  b.style.setProperty('border','2px solid #cdb85a','important');
  b.style.setProperty('font-weight','900','important');
  b.style.setProperty('transition','filter .15s ease,transform .15s ease,box-shadow .15s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 2px rgba(205,184,90,.32),0 5px 14px rgba(21,95,159,.28)','important');
    b.style.setProperty('filter','brightness(1.03) saturate(1.03)','important');
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
