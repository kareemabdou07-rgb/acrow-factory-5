/* ACROW Factory 5 — v208
   Production: commit immediately on تثبيت, keep the typed value, and mark the field green.
*/
(function(){
  'use strict';
  var timers=new WeakMap();
  function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function cloudSave(){
    try{
      if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase){
        return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
    }catch(e){console.error('v208 cloud',e);}
    return Promise.resolve();
  }
  function markSaved(input,btn){
    input.classList.add('v208-production-saved');
    btn.textContent='تم التثبيت';
    btn.classList.add('v208-saved');
    clearTimeout(timers.get(btn));
    timers.set(btn,setTimeout(function(){
      if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v208-saved');}
    },5000));
  }
  function bind(input){
    if(!isProd(input)||input.dataset.v208==='1')return;
    input.dataset.v208='1';
    input.addEventListener('input',function(){
      input.classList.remove('v208-production-saved');
    });
    var row=input.closest('.mc-row'); if(!row)return;
    var old=row.querySelector('.v205-save-btn'); if(old)old.remove();
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='v205-save-btn';
    btn.textContent='تثبيت';
    btn.title='تثبيت إنتاج هذه الماكينة';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      if(btn.dataset.busy==='1')return;
      var typed=input.value;
      if(typed==='')return;
      btn.dataset.busy='1';
      /* Prevent v198 from immediately repainting the card from an older snapshot. */
      try{document.body.dataset.v198RemotePending='1';}catch(x){}
      /* The original app commits production when the field loses focus. */
      try{input.blur();}catch(x){}
      /* If the browser did not emit change, give the original handler one clean change event. */
      setTimeout(function(){
        try{
          if(input.value!==typed) input.value=typed;
          input.dispatchEvent(new Event('change',{bubbles:true}));
        }catch(x){}
        setTimeout(function(){
          try{if(typeof saveStore==='function')saveStore();}catch(x){}
          cloudSave().then(function(){
            delete document.body.dataset.v198RemotePending;
            markSaved(input,btn);
            btn.dataset.busy='';
          }).catch(function(){
            delete document.body.dataset.v198RemotePending;
            btn.dataset.busy='';
          });
        },120);
      },80);
    });
    row.appendChild(btn);
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  var css=document.createElement('style');
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v208-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v208-production-saved{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';
  document.head.appendChild(css);
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
