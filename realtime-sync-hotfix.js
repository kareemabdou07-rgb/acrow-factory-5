/* ACROW Factory 5 — realtime sync hotfix 2026-09-22
   Forces local changes to the existing Firebase realtime layer immediately.
   Does not rebuild or rerender the UI. */
(function(){
'use strict';
var lastHash='';
function cloud(){try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){console.error('Realtime cloud push failed',e);}}
function localHash(){try{
  var s=(typeof window.store!=='undefined'&&window.store)?window.store:null;
  return s?JSON.stringify(s):'';
}catch(e){return '';}}
function pushChanged(){
  var h=localHash();
  if(!h||h===lastHash)return;
  lastHash=h;
  cloud();
}
function productionInput(e){
  try{
    var t=e&&e.target;
    if(!t||!t.classList||!t.classList.contains('actual-input'))return;
    var id=String(t.dataset&&t.dataset.machine||'').trim();
    if(!id||typeof getRecord!=='function'||typeof dateInput==='undefined')return;
    var r=getRecord(dateInput.value,currentShift,id);
    if(r){
      r.actual=t.value===''?null:Number(t.value);
      r.productionFixed=t.value!=='';
      r._productionUpdatedAt=Date.now();
      try{if(typeof saveStore==='function')saveStore();}catch(x){}
    }
    lastHash='';
    cloud();
  }catch(err){console.error('Realtime production sync error',err);}
}
function boot(){
  document.addEventListener('input',productionInput,true);
  document.addEventListener('change',productionInput,true);
  document.addEventListener('blur',productionInput,true);
  setInterval(pushChanged,250);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')pushChanged();});
  setTimeout(function(){lastHash=localHash();},1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
