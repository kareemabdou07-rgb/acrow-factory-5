/* ACROW Factory 5 — v211
   Only fix: the exact value typed in production is committed on the first press of تثبيت.
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
    input.classList.add('v211-production-saved');
    btn.textContent='تم التثبيت'; btn.classList.add('v211-saved');
    clearTimeout(timers.get(btn));
    timers.set(btn,setTimeout(function(){if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v211-saved');}},5000));
  }
  function bind(input){
    if(!isProd(input)||input.dataset.v211==='1')return;
    var row=input.closest('.mc-row'); if(!row)return;
    input.dataset.v211='1';
    input.addEventListener('input',function(){input.classList.remove('v211-production-saved');});
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
      /* Commit the exact typed value directly to the app store before any blur/re-render can replace it. */
      try{
        if(typeof store!=='undefined' && store){
          var machineId=current.getAttribute('data-machine-id')||current.dataset.machineId||row.getAttribute('data-machine-id')||row.dataset.machineId;
          var idx=current.getAttribute('data-index')||current.dataset.index||row.getAttribute('data-index')||row.dataset.index;
          var machines=store.machines||store.machineData||store.production||null;
          if(Array.isArray(machines)){
            var target=null;
            if(machineId!=null) target=machines.find(function(m){return String(m.id)===String(machineId)||String(m.machineId)===String(machineId);});
            if(!target && idx!=null && machines[idx]) target=machines[idx];
            if(!target){
              var name=(row.querySelector('.mc-name,.machine-name,h3,h4')||{}).textContent||'';
              target=machines.find(function(m){return String(m.name||m.machine||'').trim()===String(name).trim();});
            }
            if(target){
              target.actual=Number(typed);
              target.production=Number(typed);
              target.produced=Number(typed);
            }
          }
        }
      }catch(x){}
      try{current.value=typed;}catch(x){}
      try{if(typeof saveStore==='function')saveStore();}catch(x){}
      try{document.body.dataset.v198RemotePending='1';}catch(x){}
      cloudSave().then(function(){
        try{delete document.body.dataset.v198RemotePending;}catch(x){}
        mark(current,btn); btn.dataset.busy='';
      }).catch(function(){btn.dataset.busy='';});
    });
    row.appendChild(btn);
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  var css=document.createElement('style');
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v211-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v211-production-saved{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';
  document.head.appendChild(css);
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
