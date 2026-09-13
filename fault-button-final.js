/* ACROW Factory 5 — fault screen button: open the existing live maintenance screen */
(function(){
'use strict';
var BID='acrowFaultButtonFinal';
function make(){try{
  var b=document.getElementById(BID);
  if(!b){
    b=document.createElement('button');
    b.id=BID;
    b.type='button';
    b.textContent='شاشة الأعطال';
    b.onclick=function(e){
      e.preventDefault();
      e.stopPropagation();
      location.href=location.pathname.replace(/[^/]*$/,'')+'maintenance-faults.html';
    };
    document.body.appendChild(b);
  }
  b.style.cssText='display:flex!important;align-items:center!important;justify-content:center!important;position:fixed!important;top:76px!important;right:12px!important;z-index:2147483647!important;min-height:48px!important;min-width:145px!important;margin:0!important;padding:10px 18px!important;background:#d60000!important;color:#fff!important;border:2px solid #fff!important;border-radius:10px!important;font-family:Tajawal,sans-serif!important;font-size:16px!important;font-weight:900!important;cursor:pointer!important;box-shadow:0 5px 18px rgba(0,0,0,.45)!important;pointer-events:auto!important;direction:rtl!important;';
}catch(e){console.error('ACROW fault button',e);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',make);else make();
if(window.MutationObserver)new MutationObserver(make).observe(document.documentElement,{childList:true,subtree:true});
setInterval(make,1500);
})();