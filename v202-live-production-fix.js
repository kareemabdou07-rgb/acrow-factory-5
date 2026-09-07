/* ACROW Factory 5 — v202 live production save fix */
(function(){
  'use strict';
  var timers=new WeakMap();
  function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function saveLocalAndNotify(el){
    try{ if(typeof saveStore==='function') saveStore(); }catch(e){}
    try{ if(el) el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
    setTimeout(function(){
      try{
        if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'){
          window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
        }
      }catch(e){}
    },80);
  }
  function bind(el){
    if(!isProd(el)||el.dataset.v202Live==='1')return;
    el.dataset.v202Live='1';
    el.addEventListener('input',function(){
      clearTimeout(timers.get(el));
      timers.set(el,setTimeout(function(){
        if(el.value==='')return;
        saveLocalAndNotify(el);
      },120));
    });
    el.addEventListener('change',function(){
      if(el.value!=='')setTimeout(function(){saveLocalAndNotify(el);},40);
    });
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
