/* ACROW Factory 5 — mobile production keyboard hard lock v2 */
(function(){
'use strict';
var machine='';
var value='';
var restoring=false;
var STYLE_ID='acrow-production-keyboard-hard-lock-v2';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;
 s.textContent='.actual-input{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;}'+'.actual-input:focus{scroll-margin-bottom:260px!important;}body.acrow-prod-keyboard-lock{overflow-anchor:none!important;}';
 document.head.appendChild(s);
}
function inputFor(){
 if(!machine)return null;
 var a=document.querySelectorAll('.actual-input');
 for(var i=0;i<a.length;i++)if(String(a[i].dataset.machine||'').trim()===machine)return a[i];
 return null;
}
function focus(el){
 if(!el||restoring)return;
 restoring=true;
 try{
  if(String(el.value||'')!==value)el.value=value;
  el.focus({preventScroll:true});
  var p=String(el.value||'').length;
  try{el.setSelectionRange(p,p);}catch(e){}
 }catch(e){}
 setTimeout(function(){restoring=false;},30);
}
function keep(){
 if(!machine||restoring)return;
 var el=inputFor();
 if(!el)return;
 if(String(el.value||'')!==value)el.value=value;
 if(document.activeElement!==el)focus(el);
}
function burst(){
 if(!machine)return;
 [0,30,80,150,250,400,650,900,1300,1800].forEach(function(ms){setTimeout(function(){keep();},ms);});
}
function remember(el){
 if(!el||!el.closest||!el.closest('.actual-input'))return;
 machine=String(el.dataset.machine||'').trim();
 value=String(el.value||'');
 document.body.classList.add('acrow-prod-keyboard-lock');
 try{el.setAttribute('inputmode','numeric');el.setAttribute('autocomplete','off');el.setAttribute('enterkeyhint','done');}catch(e){}
}
function boot(){
 style();
 document.addEventListener('focusin',function(e){var el=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!el)return;remember(el);burst();},true);
 document.addEventListener('input',function(e){var el=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!el)return;remember(el);value=String(el.value||'');burst();},true);
 document.addEventListener('change',function(e){var el=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!el)return;remember(el);value=String(el.value||'');burst();},true);
 document.addEventListener('blur',function(e){var el=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!el||restoring)return;remember(el);burst();},true);
 if(window.MutationObserver)new MutationObserver(function(){if(machine)burst();}).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('resize',function(){if(machine)burst();},true);
 if(window.visualViewport)window.visualViewport.addEventListener('resize',function(){if(machine)burst();},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
