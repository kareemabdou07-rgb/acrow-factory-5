/* ACROW Factory 5 — v232: guaranteed fault-screen button */
(function(){
'use strict';
function make(){
  try{
    var b=document.getElementById('acrowFaultButtonFinal');
    if(!b){
      b=document.createElement('button');
      b.id='acrowFaultButtonFinal';
      b.type='button';
      b.textContent='شاشة الأعطال';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof window.showFaultLog==='function')window.showFaultLog();};
      b.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;width:100%!important;min-height:50px!important;margin:12px 0!important;padding:12px 16px!important;background:#0f6fff!important;color:#fff!important;border:0!important;border-radius:9px!important;font-family:Tajawal,sans-serif!important;font-size:17px!important;font-weight:800!important;cursor:pointer!important;position:relative!important;z-index:2147483647!important;';
    }
    var anchor=document.getElementById('machineSelectList');
    if(anchor&&anchor.parentNode){
      if(b.parentNode!==anchor.parentNode || b.nextElementSibling!==anchor) anchor.parentNode.insertBefore(b,anchor);
      return;
    }
    var all=document.querySelectorAll('h2,h3,h4,div,p,button');
    for(var i=0;i<all.length;i++){
      var t=(all[i].textContent||'').trim();
      if(t==='اختيار الماكينات المنتجة اليوم' || t.indexOf('اختيار الماكينات المنتجة اليوم')>=0){
        if(all[i].parentNode){all[i].parentNode.insertBefore(b,all[i].nextSibling);return;}
      }
    }
    if(!b.parentNode) document.body.appendChild(b);
    b.style.position='fixed';
    b.style.top='120px';
    b.style.left='12px';
    b.style.right='12px';
    b.style.width='calc(100% - 24px)';
  }catch(e){console.error('ACROW final fault button',e);}
}
function boot(){make();[100,300,700,1200,2000,3500].forEach(function(t){setTimeout(make,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
setInterval(make,1000);
})();
