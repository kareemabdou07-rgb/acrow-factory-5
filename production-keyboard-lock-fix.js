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
})();
