/* ACROW Factory 5 — v201 live production sync */
(function(){
  'use strict';
  var lastValues=new WeakMap();
  var timers=new WeakMap();

  function production(el){
    return el && el.tagName==='INPUT' && el.type==='number' && el.classList.contains('actual-input');
  }
  function cloudPush(){
    try{
      if(!window.__acrowV198Sync || !window.__acrowV198Sync.ref || typeof store==='undefined') return;
      window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(e){console.error(e);});
    }catch(e){console.error(e);}
  }
  function bind(el){
    if(!production(el) || el.dataset.v201Live==='1') return;
    el.dataset.v201Live='1';
    lastValues.set(el,el.value);
    el.addEventListener('input',function(){
      var value=el.value;
      if(value===lastValues.get(el)) return;
      lastValues.set(el,value);
      clearTimeout(timers.get(el));
      timers.set(el,setTimeout(function(){
        /* Make the original production handler process every entered value, not only the final blur. */
        try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
        setTimeout(cloudPush,80);
      },180));
    });
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
