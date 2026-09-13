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

/* v239: load the dedicated fault screen and reliable media-details viewer. */
function loadFaultScreen(){
  if(window.__acrowFaultScreenLoaded)return;
  window.__acrowFaultScreenLoaded=true;
  var s=document.createElement('script');
  s.src='./fault-log-screen.js?v=239';
  s.async=false;
  document.head.appendChild(s);
  s.onload=function(){
    if(window.__acrowFaultMediaLoaded)return;
    window.__acrowFaultMediaLoaded=true;
    var m=document.createElement('script');
    m.src='./fault-media-details.js?v=239';
    m.async=false;
    document.head.appendChild(m);
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFaultScreen);else loadFaultScreen();
})();
