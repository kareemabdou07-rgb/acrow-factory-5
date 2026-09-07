/* ACROW Factory 5 — v210
   Keep the existing تثبيت button and preserve the complete typed production value.
*/
(function(){
  'use strict';
  var timers=new WeakMap();
  function prod(el){return el&&el.tagName==='INPUT'&&el.type==='number'&&el.classList.contains('actual-input');}
  function cloud(){try{if(window.__acrowV198Sync&&window.__acrowV198Sync.ref&&typeof store!=='undefined'&&window.firebase)return window.__acrowV198Sync.ref.set({data:store,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}return Promise.resolve();}
  function saved(input,btn){
    input.classList.add('v210-saved-input');
    btn.textContent='تم التثبيت'; btn.classList.add('v210-saved-btn');
    clearTimeout(timers.get(btn));
    timers.set(btn,setTimeout(function(){if(btn&&btn.isConnected){btn.textContent='تثبيت';btn.classList.remove('v210-saved-btn');}},5000));
  }
  function handle(btn){
    if(btn.dataset.v210Busy==='1')return;
    var row=btn.closest('.mc-row'); if(!row)return;
    var input=row.querySelector('input.actual-input[type="number"]'); if(!input||input.value==='')return;
    var value=input.value; btn.dataset.v210Busy='1';
    try{document.body.dataset.v198RemotePending='1';}catch(e){}
    saved(input,btn);
    /* Do not dispatch change while typing. Commit only the complete value on تثبيت. */
    try{input.blur();}catch(e){}
    setTimeout(function(){
      try{input.value=value;}catch(e){}
      try{if(typeof saveStore==='function')saveStore();}catch(e){}
      setTimeout(function(){cloud().then(function(){try{delete document.body.dataset.v198RemotePending;}catch(e){}btn.dataset.v210Busy='';}).catch(function(){try{delete document.body.dataset.v198RemotePending;}catch(e){}btn.dataset.v210Busy='';});},120);
    },180);
  }
  function bind(){
    document.querySelectorAll('.mc-row input.actual-input[type="number"]').forEach(function(input){
      var row=input.closest('.mc-row'); if(!row)return;
      var btn=row.querySelector('.v205-save-btn');
      if(!btn)return;
      if(btn.dataset.v210Bound==='1')return;
      btn.dataset.v210Bound='1';
      btn.textContent='تثبيت';
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();handle(btn);});
    });
  }
  var css=document.createElement('style');
  css.textContent='.v205-save-btn.v210-saved-btn{background:#25e58f!important;color:#073b24!important;border-color:#16a34a!important}.mc-row input.v210-saved-input{background:#16352a!important;border-color:#25e58f!important;color:#25e58f!important;box-shadow:0 0 0 2px rgba(37,229,143,.18),inset 0 0 10px rgba(37,229,143,.08)!important}';
  document.head.appendChild(css);
  function init(){bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
