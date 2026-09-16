/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v10 — blue main buttons with light yellow accent; active button yellow */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#145fa3 0%,#237fbd 62%,#d9c56a 100%)';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة|الصيانة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background-image',active?'linear-gradient(135deg,#ffd84d 0%,#ffe98a 100%)':base,'important');
  b.style.setProperty('background-color',active?'#ffd84d':'#237fbd','important');
  b.style.setProperty('color',active?'#17324d':'#ffffff','important');
  b.style.setProperty('border','2px solid '+(active?'#e4bd35':'#d9c56a'),'important');
  b.style.setProperty('font-weight','900','important');
  b.style.setProperty('transition','filter .15s ease,transform .15s ease,box-shadow .15s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 2px rgba(255,216,77,.38),0 5px 14px rgba(21,95,159,.22)','important');
    b.style.setProperty('filter','brightness(1.03)','important');
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
