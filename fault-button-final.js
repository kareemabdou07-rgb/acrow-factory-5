/* ACROW Factory 5 — v236: standalone fault screen button on main page */
(function(){
'use strict';
function make(){
 try{
  ['faultScreenBtn','acrowNativeFaultButton'].forEach(function(id){var old=document.getElementById(id);if(old)old.remove();});
  document.querySelectorAll('button').forEach(function(x){if(x.id!=='acrowFaultButtonFinal'&&(x.textContent||'').trim()==='شاشة الأعطال')x.remove();});
  var b=document.getElementById('acrowFaultButtonFinal');
  if(!b){b=document.createElement('button');b.id='acrowFaultButtonFinal';b.type='button';b.textContent='شاشة الأعطال';b.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof window.showFaultLog==='function')window.showFaultLog();};}
  b.className='acrow-fault-main-button';
  b.style.cssText='display:block!important;position:fixed!important;top:76px!important;right:12px!important;z-index:2147483647!important;min-height:50px!important;width:auto!important;margin:0!important;padding:11px 20px!important;background:#ff8c00!important;color:#fff!important;border:2px solid #fff!important;border-radius:10px!important;font-family:Tajawal,sans-serif!important;font-size:17px!important;font-weight:900!important;cursor:pointer!important;box-shadow:0 5px 18px rgba(0,0,0,.4)!important;pointer-events:auto!important;';
  if(b.parentNode!==document.body)document.body.appendChild(b);
 }catch(e){console.error('ACROW v236 fault button',e);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',make);else make();
if(window.MutationObserver)new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
setInterval(make,500);
})();
