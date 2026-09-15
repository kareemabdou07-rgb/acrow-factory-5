/* ACROW Factory 5 — main-screen button colors only. No functionality changes. */
/* v5 — light blue/green base + persistent pale-yellow active command */
(function(){
'use strict';
var SEL='button[data-acrow-main-color="1"]';
var activeButton=null;
var base='linear-gradient(135deg,#19a974 0%,#25b7e8 100%)';
var yellow='#fff4a3';
function isMainButton(b){
  var t=(b.textContent||'').replace(/\s+/g,' ').trim();
  return /طباعة التقارير|إدارة الأعطال|الخطة الشهرية|التعديل|تسجيل الإنتاج|أسباب نقص الكفاءة/.test(t);
}
function apply(){
  document.querySelectorAll('button').forEach(function(b){
    if(!isMainButton(b)) return;
    b.setAttribute('data-acrow-main-color','1');
    if(b!==activeButton){
      b.style.setProperty('background',base,'important');
      b.style.setProperty('color','#fff','important');
      b.style.setProperty('border-color','#25b7e8','important');
    }
    b.style.setProperty('font-weight','900','important');
    b.style.setProperty('transition','background .15s ease,color .15s ease','important');
  });
}
function installStyle(){
  var old=document.getElementById('acrow-button-colors-style');
  if(old) old.remove();
  var s=document.createElement('style');
  s.id='acrow-button-colors-style';
  s.textContent=SEL+'{background:'+base+'!important;color:#fff!important;border-color:#25b7e8!important;}'+
    SEL+'.acrow-yellow-active{background:'+yellow+'!important;color:#1769aa!important;border-color:'+yellow+'!important;box-shadow:0 0 0 2px rgba(255,244,163,.45)!important;}'+
    SEL+':active{background:'+yellow+'!important;color:#1769aa!important;border-color:'+yellow+'!important;}';
  document.head.appendChild(s);
}
function boot(){
  installStyle();
  apply();
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest(SEL);
    if(!b) return;
    if(activeButton && activeButton!==b) activeButton.classList.remove('acrow-yellow-active');
    activeButton=b;
    b.classList.add('acrow-yellow-active');
    apply();
  },true);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300);});
else setTimeout(boot,300);
new MutationObserver(function(){apply();}).observe(document.documentElement,{childList:true,subtree:true});
})();
