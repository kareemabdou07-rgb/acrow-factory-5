/* ACROW Factory 5 — v204 all-machines live sync */
(function(){
  'use strict';
  var timer=null, last='';
  function prod(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function push(){
    try{
      if(!window.__acrowV198Sync||!window.__acrowV198Sync.ref||typeof store==='undefined')return;
      var data=JSON.stringify(store||{});
      if(data===last)return;
      last=data;
      window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(e){console.error(e);});
    }catch(e){console.error(e);}
  }
  function bind(el){
    if(!prod(el)||el.dataset.v204==='1')return;
    el.dataset.v204='1';
    el.addEventListener('input',function(){
      clearTimeout(timer);
      timer=setTimeout(push,300);
    });
    el.addEventListener('blur',function(){clearTimeout(timer);push();});
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
