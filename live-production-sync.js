/* ACROW Factory 5 — force immediate production cloud sync v2 */
(function(){
'use strict';
function push(){try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){console.error('live production sync failed',e);}}
function stampAndPush(){try{
  if(window.store){store._productionUpdatedAt=Date.now();}
  if(typeof window.saveStore==='function')window.saveStore();
}catch(e){} setTimeout(push,0); setTimeout(push,250); setTimeout(push,800);}
function hook(){
  try{
    if(typeof window.saveStore==='function'&&!window.saveStore.__acrowLiveSync){
      var original=window.saveStore;
      var wrapped=function(){var r=original.apply(this,arguments);setTimeout(push,0);return r;};
      wrapped.__acrowLiveSync=true;
      window.saveStore=wrapped;
    }
  }catch(e){}
  if(window.__acrowLiveProductionListeners)return;
  window.__acrowLiveProductionListeners=true;
  document.addEventListener('input',function(e){
    var t=e.target;
    if(t&&t.classList&&t.classList.contains('actual-input')){stampAndPush();}
  },true);
  document.addEventListener('change',function(e){
    var t=e.target;
    if(t&&t.classList&&t.classList.contains('actual-input')){stampAndPush();}
  },true);
  document.addEventListener('blur',function(e){
    var t=e.target;
    if(t&&t.classList&&t.classList.contains('actual-input')){stampAndPush();}
  },true);
}
function boot(){hook();setTimeout(hook,100);setTimeout(hook,500);setTimeout(hook,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
