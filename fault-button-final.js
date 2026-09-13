/* ACROW Factory 5 — v233: fault screen button on main page navigation */
(function(){
'use strict';
function make(){
  try{
    /* Remove the older versions that were being placed inside the machine selector. */
    ['faultScreenBtn','acrowNativeFaultButton'].forEach(function(id){var old=document.getElementById(id);if(old)old.remove();});

    var nav=document.querySelector('.topbar .shift-controls');
    if(!nav)return;

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
    b.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;min-height:46px!important;margin:6px 0!important;padding:10px 16px!important;background:#b9dff2!important;color:#123!important;border:1px solid #7fb9d8!important;border-radius:9px!important;font-family:Tajawal,sans-serif!important;font-size:16px!important;font-weight:800!important;cursor:pointer!important;position:relative!important;z-index:99999!important;';

    /* Keep it outside the machine selector: first item in the main navigation. */
    if(b.parentNode!==nav || nav.firstElementChild!==b)nav.insertBefore(b,nav.firstElementChild);
  }catch(e){console.error('ACROW main fault button',e);}
}
function boot(){make();[100,300,700,1200,2000,3500].forEach(function(t){setTimeout(make,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
setInterval(make,1000);
})();
