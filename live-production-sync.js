/* ACROW Factory 5 — force immediate production cloud sync v3 */
(function(){
'use strict';
var lastKey='', lastValue='';
function push(){try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function syncInput(t){
  try{
    if(!t||!t.classList||!t.classList.contains('actual-input'))return;
    var value=String(t.value==null?'':t.value);
    var id=String(t.dataset&&t.dataset.machine||'').trim();
    var date=(typeof dateInput!=='undefined'&&dateInput)?String(dateInput.value||''):'';
    var shift=(typeof currentShift!=='undefined')?String(currentShift||''):'';
    var key=date+'|'+shift+'|'+id;
    if(key===lastKey&&value===lastValue)return;
    lastKey=key; lastValue=value;
    if(typeof getRecord==='function'&&typeof dateInput!=='undefined'&&id){
      var r=getRecord(date,id);
      if(!r&&typeof currentShift!=='undefined')r=getRecord(date,currentShift,id);
      if(r){r.actual=value===''?null:Number(value);r.productionFixed=value!=='';r._productionUpdatedAt=Date.now();}
    }
    if(typeof window.saveStore==='function')window.saveStore();
    push();setTimeout(push,120);setTimeout(push,400);setTimeout(push,900);
  }catch(e){}
}
function activeTick(){
  try{var t=document.activeElement;if(t&&t.classList&&t.classList.contains('actual-input'))syncInput(t);}catch(e){}
}
function hook(){
  if(window.__acrowLiveProductionV3)return;
  window.__acrowLiveProductionV3=true;
  document.addEventListener('change',function(e){syncInput(e.target);},true);
  document.addEventListener('blur',function(e){syncInput(e.target);},true);
  setInterval(activeTick,100);
}
function boot(){hook();setTimeout(hook,200);setTimeout(hook,1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
