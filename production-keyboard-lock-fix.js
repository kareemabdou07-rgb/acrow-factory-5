/* ACROW Factory 5 — mobile production keyboard stable lock v3 */
(function(){
'use strict';
var machine='';
var value='';
var STYLE_ID='acrow-production-keyboard-stable-v3';
var recovering=false;
var recoveryTimer=0;
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;
 s.textContent='.actual-input{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;-webkit-user-select:text!important;user-select:text!important;}'+'.actual-input:focus{scroll-margin-bottom:220px!important;}';
 document.head.appendChild(s);
}
function isInput(el){return !!(el&&el.classList&&el.classList.contains('actual-input'));}
function findInput(){
 if(!machine)return null;
 var a=document.querySelectorAll('.actual-input');
 for(var i=0;i<a.length;i++)if(String(a[i].dataset.machine||'').trim()===machine)return a[i];
 return null;
}
function restoreOnce(){
 if(recovering||!machine)return;
 var active=document.activeElement;
 if(isInput(active))return;
 var el=findInput();
 if(!el)return;
 recovering=true;
 try{
  if(String(el.value||'')!==value)el.value=value;
  el.focus({preventScroll:true});
  var p=String(el.value||'').length;
  try{el.setSelectionRange(p,p);}catch(e){}
 }catch(e){}
 setTimeout(function(){recovering=false;},120);
}
function remember(el){
 if(!isInput(el))return;
 machine=String(el.dataset.machine||'').trim();
 value=String(el.value||'');
 try{
  el.setAttribute('inputmode','numeric');
  el.setAttribute('autocomplete','off');
  el.setAttribute('enterkeyhint','done');
 }catch(e){}
}
function boot(){
 style();
 document.addEventListener('focusin',function(e){
  var el=e.target;
  if(!isInput(el))return;
  remember(el);
 },true);
 document.addEventListener('input',function(e){
  var el=e.target;
  if(!isInput(el))return;
  remember(el);
 },true);
 document.addEventListener('change',function(e){
  var el=e.target;
  if(!isInput(el))return;
  remember(el);
 },true);
 /* Do NOT refocus on blur or viewport resize: that causes Android keyboards to flicker. */
 if(window.MutationObserver){
  new MutationObserver(function(){
   if(!machine||recovering)return;
   if(isInput(document.activeElement))return;
   clearTimeout(recoveryTimer);
   recoveryTimer=setTimeout(restoreOnce,180);
  }).observe(document.body,{childList:true,subtree:true});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
