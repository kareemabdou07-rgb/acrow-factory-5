/* ACROW Factory 5 — production input stable mode
   Important: do not force focus or reopen the Android keyboard.
   Android controls the keyboard; the app must not fight it. */
(function(){
'use strict';
function boot(){
  var inputs=document.querySelectorAll('.actual-input');
  for(var i=0;i<inputs.length;i++){
    try{
      inputs[i].setAttribute('inputmode','numeric');
      inputs[i].setAttribute('autocomplete','off');
      inputs[i].setAttribute('enterkeyhint','done');
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

/* v246: load the force-camera fault screen. */
function loadFaultScreen(){
  if(window.__acrowFaultScreenLoaded)return;
  window.__acrowFaultScreenLoaded=true;
  var s=document.createElement('script');
  s.src='./fault-log-screen.js?v=246';
  s.async=false;
  document.head.appendChild(s);
  s.onload=function(){
    if(window.__acrowFaultMediaLoaded)return;
    window.__acrowFaultMediaLoaded=true;
    var m=document.createElement('script');
    m.src='./fault-media-details.js?v=246';
    m.async=false;
    document.head.appendChild(m);
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFaultScreen);else loadFaultScreen();

/* Targeted production persistence hotfix: timestamp local edits so Firebase can reject stale remote records. */
(function(){
  function mark(input){
    try{
      var r=typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,String(input.dataset.machine||'')):null;
      if(!r)return;
      r._productionUpdatedAt=Date.now();
      if(typeof saveStore==='function')saveStore();
    }catch(e){}
  }
  document.addEventListener('input',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
  document.addEventListener('change',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
  document.addEventListener('blur',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
})();
})();
