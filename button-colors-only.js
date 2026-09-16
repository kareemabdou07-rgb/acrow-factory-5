/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v7 — every main button uses blue + yellow + green together */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#1677ff 0%,#ffd43b 50%,#22b573 100%)';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background',base,'important');
  b.style.setProperty('color','#111827','important');
  b.style.setProperty('border-color','#ffd43b','important');
  b.style.setProperty('font-weight','900','important');
  b.style.setProperty('transition','filter .15s ease,transform .15s ease,box-shadow .15s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 3px rgba(255,212,59,.42),0 5px 16px rgba(0,0,0,.18)','important');
    b.style.setProperty('filter','saturate(1.12) brightness(1.04)','important');
  }else{
    b.style.removeProperty('box-shadow');
    b.style.removeProperty('filter');
  }
}
function apply(){
  document.querySelectorAll('button').forEach(function(b){
    if(!isMainButton(b))return;
    paint(b,b===activeButton);
  });
}
function boot(){
  apply();
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button');
    if(!b||!isMainButton(b))return;
    activeButton=b;
    apply();
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});
else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();