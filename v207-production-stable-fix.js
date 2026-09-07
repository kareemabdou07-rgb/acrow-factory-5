/* ACROW Factory 5 — v207 production stable commit
   Prevent the live cloud snapshot from racing the machine's own commit.
*/
(function(){
  'use strict';
  function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function cloudSave(){
    try{
      if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase){
        return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
    }catch(e){console.error('v207 cloud',e);}
    return Promise.resolve();
  }
  function bind(input){
    if(!isProd(input)||input.dataset.v207==='1')return;
    input.dataset.v207='1';
    var row=input.closest('.mc-row'); if(!row)return;
    var old=row.querySelector('.v205-save-btn'); if(old)old.remove();
    var btn=document.createElement('button');
    btn.type='button'; btn.className='v205-save-btn'; btn.textContent='تثبيت'; btn.title='تثبيت إنتاج هذه الماكينة';
    btn.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      if(btn.dataset.busy==='1')return;
      btn.dataset.busy='1';
      var typed=input.value;
      if(typed===''){btn.dataset.busy='';return;}
      /* Keep the production field focused while the native app handler commits it.
         This makes v198 defer an incoming old snapshot during the short commit window. */
      try{input.focus();}catch(x){}
      try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(x){}
      setTimeout(function(){
        try{if(typeof saveStore==='function')saveStore();}catch(x){}
        setTimeout(function(){
          cloudSave().then(function(){
            btn.textContent='تم التثبيت'; btn.classList.add('v207-saved');
            setTimeout(function(){
              if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v207-saved');btn.dataset.busy='';}
            },1800);
          }).catch(function(){btn.dataset.busy='';});
        },220);
      },350);
    });
    row.appendChild(btn);
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  var css=document.createElement('style');
  css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v207-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}';
  document.head.appendChild(css);
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
