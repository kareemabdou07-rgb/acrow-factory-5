/* ACROW Factory 5 — v206 production commit fix
   Type the full number normally. Only the per-machine button commits it.
*/
(function(){
  'use strict';
  function isProd(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function pushCloud(){
    try{
      if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase){
        return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
    }catch(e){console.error('v206 cloud',e);}
    return Promise.resolve();
  }
  function mark(btn){
    btn.textContent='تم التثبيت';
    btn.classList.add('v206-saved');
    setTimeout(function(){if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v206-saved');}},1800);
  }
  function commit(input,btn){
    if(!isProd(input)||input.value==='')return;
    var value=input.value;
    try{
      /* Let the original application handler receive exactly one change event. */
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }catch(e){}
    /* The app may rebuild the machine card after change. Wait for that before reading/saving store. */
    setTimeout(function(){
      try{if(typeof saveStore==='function')saveStore();}catch(e){}
      setTimeout(function(){
        pushCloud().then(function(){mark(btn);}).catch(function(){mark(btn);});
      },180);
    },280);
  }
  function bind(input){
    if(!isProd(input)||input.dataset.v206==='1')return;
    input.dataset.v206='1';
    var row=input.closest('.mc-row');
    if(!row)return;
    var old=row.querySelector('.v205-save-btn');
    if(old)old.remove();
    var btn=document.createElement('button');
    btn.type='button';btn.className='v205-save-btn';btn.textContent='تثبيت';btn.title='تثبيت إنتاج هذه الماكينة';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();commit(input,btn);});
    row.appendChild(btn);
  }
  function scan(){document.querySelectorAll('input.actual-input[type="number"]').forEach(bind);}
  var css=document.createElement('style');css.textContent='.v205-save-btn{flex:0 0 auto;min-width:82px;padding:9px 12px;border:1px solid #7fb9d8;border-radius:8px;background:#b9dff2;color:#123;font-family:Tajawal,sans-serif;font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap}.v205-save-btn.v206-saved{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}';document.head.appendChild(css);
  function init(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();