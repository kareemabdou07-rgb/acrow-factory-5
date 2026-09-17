/* ACROW Factory 5 — force immediate production cloud sync */
(function(){
'use strict';
function push(){try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){console.error('live production sync failed',e);}}
function hook(){
  try{
    if(typeof window.saveStore==='function'&&!window.saveStore.__acrowLiveSync){
      var original=window.saveStore;
      var wrapped=function(){var r=original.apply(this,arguments);setTimeout(push,0);return r;};
      wrapped.__acrowLiveSync=true;
      window.saveStore=wrapped;
    }
  }catch(e){}
  document.addEventListener('input',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('actual-input'))setTimeout(push,80);},true);
  document.addEventListener('change',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('actual-input'))setTimeout(push,20);},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
