/* ACROW Factory 5 — monthly plan machine selection lock */
(function(){
  'use strict';
  var KEY='planMachineIds', LOCK='planMachineIdsLocked';
  function ready(){return window.store && store.settings && typeof window.saveStore==='function';}
  function idsFrom(v){return Array.isArray(v)?v.map(String):[];}
  function same(a,b){a=idsFrom(a).sort();b=idsFrom(b).sort();return a.length===b.length&&a.every(function(x,i){return x===b[i];});}
  function saved(){
    if(!ready())return [];
    if(Array.isArray(store.settings[LOCK])) return idsFrom(store.settings[LOCK]);
    if(Array.isArray(store.settings[KEY])) return idsFrom(store.settings[KEY]);
    return [];
  }
  function restore(){
    if(!ready())return;
    var s=saved();
    if(!Array.isArray(store.settings[LOCK])){
      store.settings[LOCK]=s.slice();
      store.settings.planMachineIdsConfigured=true;
      saveStore();
    }else if(!same(store.settings[KEY],s)){
      store.settings[KEY]=s.slice();
      store.settings.planMachineIdsConfigured=true;
      saveStore();
    }
  }
  function manualSave(ids){
    if(!ready())return;
    ids=Array.from(new Set(idsFrom(ids)));
    store.settings[KEY]=ids.slice();
    store.settings[LOCK]=ids.slice();
    store.settings.planMachineIdsConfigured=true;
    saveStore();
  }
  function bindRoot(id, marker){
    var root=document.getElementById(id);
    if(!root||root.dataset[marker])return;
    root.dataset[marker]='1';
    root.addEventListener('change',function(e){
      var cb=e.target;
      if(!cb||cb.tagName!=='INPUT'||cb.type!=='checkbox')return;
      var current=saved();
      var set=new Set(current.map(String));
      var value=String(cb.value||cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id')||'').trim();
      if(!value)return;
      if(cb.checked)set.add(value);else set.delete(value);
      manualSave(Array.from(set));
    },true);
  }
  function boot(){
    if(!ready()){setTimeout(boot,300);return;}
    restore();
    bindRoot('planMachineSelectList','acrowPlanLockBound');
    bindRoot('planStatusMachineSelect','acrowPlanStatusLockBound');
    /* Protect the saved monthly selection from date/day rerenders or other automatic code. */
    setInterval(function(){
      if(!ready())return;
      var s=saved();
      if(!same(store.settings[KEY],s)){
        store.settings[KEY]=s.slice();
        try{saveStore();}catch(e){}
      }
      bindRoot('planMachineSelectList','acrowPlanLockBound');
      bindRoot('planStatusMachineSelect','acrowPlanStatusLockBound');
    },1000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
