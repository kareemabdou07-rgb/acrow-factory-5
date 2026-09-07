/* ACROW Factory 5 — v203 production input fix */
(function(){
  'use strict';
  function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function bind(el){
    if(!isProd(el)||el.dataset.v203Prod==='1')return;
    el.dataset.v203Prod='1';
    /* Never force a change/render while the operator is typing (e.g. 500). */
    el.addEventListener('blur',function(){
      try{if(typeof queueCloudSave==='function')queueCloudSave();}catch(e){}
      try{if(window.__acrowV198Sync&&typeof window.__acrowV198Sync.saveNow==='function')window.__acrowV198Sync.saveNow();}catch(e){}
    });
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
