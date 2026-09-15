/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v6 — green/blue gradient + persistent pale-yellow active button */
(function(){
'use strict';
var activeButton=null;
var base='linear-gradient(135deg,#159957 0%,#36c6e8 52%,#168aad 100%)';
var yellow='#fff3a6';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة/.test(t);
}
function paint(b,active){
  if(!b)return;
  b.setAttribute('data-acrow-main-color','1');
  b.style.setProperty('background',active?yellow:base,'important');
  b.style.setProperty('color',active?'#1769aa':'#fff','important');
  b.style.setProperty('border-color',active?yellow:'#36c6e8','important');
  b.style.setProperty('font-weight','900','important');
  b.style.setProperty('transition','background .15s ease,color .15s ease','important');
  if(active){
    b.style.setProperty('box-shadow','0 0 0 2px rgba(255,243,166,.55)','important');
  }else{
    b.style.removeProperty('box-shadow');
  }
}
function apply(){
  document.querySelectorAll('button').forEach(function(b){
    if(!isMainButton(b))return;
    if(b===activeButton)paint(b,true); else paint(b,false);
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
