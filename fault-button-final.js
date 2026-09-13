/* ACROW Factory 5 — v234: fault screen button fully outside machine selector */
(function(){
'use strict';
function make(){
  try{
    /* Delete every older fault button, including versions inserted in machine selector. */
    ['faultScreenBtn','acrowNativeFaultButton'].forEach(function(id){var old=document.getElementById(id);if(old)old.remove();});
    document.querySelectorAll('button').forEach(function(x){
      if(x.id!=='acrowFaultButtonFinal' && (x.textContent||'').trim()==='شاشة الأعطال') x.remove();
    });

    var host=document.querySelector('.topbar') || document.body;
    var b=document.getElementById('acrowFaultButtonFinal');
    if(!b){
      b=document.createElement('button');
      b.id='acrowFaultButtonFinal';
      b.type='button';
      b.textContent='شاشة الأعطال';
      b.className='top-main-action select-machines-btn';
      b.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        if(typeof window.showFaultLog==='function')window.showFaultLog();
      };
    }
    b.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;position:fixed!important;top:76px!important;right:12px!important;z-index:2147483647!important;min-height:46px!important;margin:0!important;padding:10px 16px!important;background:linear-gradient(135deg,#0f6fff,#20b8ff)!important;color:#fff!important;border:1px solid #20b8ff!important;border-radius:9px!important;font-family:Tajawal,sans-serif!important;font-size:16px!important;font-weight:800!important;cursor:pointer!important;box-shadow:0 4px 14px rgba(0,0,0,.28)!important;';

    /* The button is attached to the top-level page, never to the machine selector. */
    if(b.parentNode!==host)host.appendChild(b);
  }catch(e){console.error('ACROW v234 main fault button',e);}
}
function boot(){make();[50,100,200,400,700,1200,2000,3500].forEach(function(t){setTimeout(make,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
setInterval(make,250);
})();
