/* ACROW Factory 5 — v209
   Production input: keep the complete typed value and save each machine independently.
*/
(function(){
  'use strict';
  var timers=new WeakMap();

  function isProd(el){
    return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');
  }
  function cloudSave(){
    try{
      if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase){
        return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
    }catch(e){console.error('v209 cloud',e);}
    return Promise.resolve();
  }
  function markSaved(input,btn){
    if(input) input.classList.add('v209-production-saved');
    if(btn){
      btn.textContent='تم التثبيت';
      btn.classList.add('v209-saved');
      clearTimeout(timers.get(btn));
      timers.set(btn,setTimeout(function(){
        if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v209-saved');}
      },5000));
    }
  }
  function save(input,btn){
    if(!isProd(input)||input.value==='')return;
    if(btn.dataset.busy==='1')return;
    btn.dataset.busy='1';
    var typed=input.value;
    markSaved(input,btn);
    try{document.body.dataset.v198RemotePending='1';}catch(e){}
    /* Let the application's normal blur/change logic commit the full value. */
    try{input.blur();}catch(e){}
    setTimeout(function(){
      try{if(input.value!==typed)input.value=typed;}catch(e){}
      try{if(typeof saveStore==='function')saveStore();}catch(e){}
      setTimeout(function(){
        cloudSave().then(function(){
          try{delete document.body.dataset.v198RemotePending;}catch(e){}
          btn.dataset.busy='';
        }).catch(function(){
          try{delete document.body.dataset.v198RemotePending;}catch(e){}
          btn.dataset.busy='';
        });
      },150);
    },180);
  }
  function makeButton(row,input){
    var old=row.querySelector('.v205-save-btn');
    if(old)old.remove();
    var btn=document.createElement('button');
    btn.type='button';btn.className='v205-save-btn';btn.textContent='تثبيت';btn.title='تثبيت إنتاج هذه الماكينة';
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      /* Resolve the current input at click time, not an old detached element. */
      var current=row.querySelector('input.actual-input[type="number"]');
      if(current)save(current,btn);
    });
    row.appendChild(btn);
  }
  function scan(){
    document.querySelectorAll('input.actual-input[type="number"]').forEach(function(input){
      if(!isProd(input))return;
      var row=input.closest('.mc-row');
      if(!row)return;
      var btn=row.querySelector('.v205-save-btn');
      if(!btn||btn.dataset.v209==='1'){
        if(btn) btn.dataset.v209='1';
        return;
      }
      makeButton(row,input);
      var newBtn=row.querySelector('.v205-save-btn');
      if(newBtn)newBtn.dataset.v209='1';
    });
  }
  var css=document.createElement('style');
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v209-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v209-production-saved{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';
  document.head.appendChild(css);
  function init(){
    scan();
    new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
