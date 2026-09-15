/* ACROW Factory 5 — buttons colors only. No functionality changes. */
(function(){
'use strict';
function apply(){
  document.querySelectorAll('button').forEach(function(b){
    var t=(b.textContent||'').trim();
    if(/طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة/.test(t)){
      b.setAttribute('data-acrow-main-color','1');
      b.style.setProperty('background','#1769aa','important');
      b.style.setProperty('color','#fff','important');
      b.style.setProperty('border-color','#1769aa','important');
      b.style.setProperty('font-weight','900','important');
      b.style.setProperty('transition','background .15s ease,color .15s ease','important');
    }
  });
}
function installStyle(){
  if(document.getElementById('acrow-button-colors-style')) return;
  var s=document.createElement('style');
  s.id='acrow-button-colors-style';
  s.textContent='button[data-acrow-main-color="1"]:active{background:#fff176!important;color:#1769aa!important;border-color:#fff176!important;}';
  document.head.appendChild(s);
}
function boot(){installStyle();apply();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
