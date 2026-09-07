/* ACROW Factory 5 — v205 production save button
   Adds a per-machine "تثبيت" button. It never rerenders while typing.
*/
(function(){
  'use strict';
  function isProductionInput(el){
    return el && el.tagName==='INPUT' && el.type==='number' && el.classList.contains('actual-input');
  }
  function cloudSave(){
    try{
      if(window.__acrowV198Sync && window.__acrowV198Sync.ref && typeof store!=='undefined' && window.firebase){
        return window.__acrowV198Sync.ref.set({
          data: store,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }catch(e){ console.error('v205 cloud save',e); }
    return Promise.resolve();
  }
  function markSaved(btn){
    btn.textContent='تم التثبيت';
    btn.classList.add('v205-saved');
    setTimeout(function(){
      if(btn && btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v205-saved');}
    },1600);
  }
  function saveOne(input,btn){
    try{
      if(typeof saveStore==='function') saveStore();
      cloudSave().then(function(){ markSaved(btn); }).catch(function(){ markSaved(btn); });
    }catch(e){ console.error('v205 save',e); markSaved(btn); }
  }
  function bind(input){
    if(!isProductionInput(input) || input.dataset.v205Bound==='1') return;
    input.dataset.v205Bound='1';
    var row=input.closest('.mc-row');
    if(!row) return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='v205-save-btn';
    btn.textContent='تثبيت';
    btn.title='تثبيت إنتاج هذه الماكينة ومزامنته فوراً';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      saveOne(input,btn);
    });
    row.appendChild(btn);
  }
  function scan(){ document.querySelectorAll('input.actual-input[type="number"]').forEach(bind); }
  function init(){
    scan();
    new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  }
  var css=document.createElement('style');
  css.id='v205-production-save-button-css';
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn:active{transform:translateY(1px)}.v205-save-btn.v205-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row:has(.actual-input){align-items:center}.mc-row:has(.actual-input) .actual-input{min-width:0}';
  document.head.appendChild(css);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
