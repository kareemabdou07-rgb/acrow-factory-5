/* ACROW Factory 5 — v210
   Keep the existing v208 interface. Only fix production entry so the exact typed value is committed once.
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
    }catch(e){}
    return Promise.resolve();
  }
  function mark(input,btn){
    input.classList.add('v210-production-saved');
    btn.textContent='تم التثبيت'; btn.classList.add('v210-saved');
    clearTimeout(timers.get(btn));
    timers.set(btn,setTimeout(function(){if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v210-saved');}},5000));
  }
  function bind(input){
    if(!isProd(input)||input.dataset.v210==='1')return;
    input.dataset.v210='1';
    input.addEventListener('input',function(){input.classList.remove('v210-production-saved');});
    var row=input.closest('.mc-row'); if(!row)return;
    var old=row.querySelector('.v205-save-btn'); if(old)old.remove();
    var btn=document.createElement('button');
    btn.type='button'; btn.className='v205-save-btn'; btn.textContent='تثبيت'; btn.title='تثبيت إنتاج هذه الماكينة';
    btn.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      if(btn.dataset.busy==='1')return;
      var current=row.querySelector('input.actual-input[type="number"]');
      if(!current||current.value==='')return;
      var typed=current.value;
      btn.dataset.busy='1';
      /* Keep the exact value visible immediately; do not generate change events while saving. */
      current.classList.add('v210-production-saved');
      try{document.body.dataset.v198RemotePending='1';}catch(x){}
      /* The original application commits the production value on blur. */
      try{current.blur();}catch(x){}
      setTimeout(function(){
        /* If the card was rebuilt, use its current production input and restore the exact typed value. */
        var fresh=row.querySelector('input.actual-input[type="number"]')||current;
        try{fresh.value=typed;}catch(x){}
        try{if(typeof saveStore==='function')saveStore();}catch(x){}
        setTimeout(function(){
          cloudSave().then(function(){
            try{delete document.body.dataset.v198RemotePending;}catch(x){}
            mark(fresh,btn); btn.dataset.busy='';
          }).catch(function(){btn.dataset.busy='';});
        },150);
      },180);
    });
    row.appendChild(btn);
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  var css=document.createElement('style');
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v210-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v210-production-saved{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';
  document.head.appendChild(css);
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
