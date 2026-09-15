/* ACROW Factory 5 — buttons colors only. No functionality changes. */
/* v4 — last clicked button stays yellow until another command */
(function(){
'use strict';
var SEL='button[data-acrow-main-color="1"]';
var activeButton=null;
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
  s.textContent=SEL+'{background:#1769aa!important;color:#fff!important;border-color:#1769aa!important;}'+SEL+'.acrow-yellow-active{background:#fff176!important;color:#1769aa!important;border-color:#fff176!important;box-shadow:0 0 0 2px rgba(255,241,118,.45)!important;}'+SEL+':active{background:#fff176!important;color:#1769aa!important;border-color:#fff176!important;}';
  document.head.appendChild(s);
}
function boot(){
  installStyle(); apply();
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest(SEL);
    if(!b) return;
    if(activeButton && activeButton!==b) activeButton.classList.remove('acrow-yellow-active');
    b.classList.add('acrow-yellow-active');
    activeButton=b;
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
