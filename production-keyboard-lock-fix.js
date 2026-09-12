/* ACROW Factory 5 — mobile production keyboard/focus stability fix */
(function(){
'use strict';
var lockedMachine='';
var lockedValue='';
var lockedInput=null;
var restoring=false;
var STYLE_ID='acrow-production-keyboard-lock-v1';
function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;
 s.textContent=`
.actual-input{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;}
.actual-input:focus{scroll-margin-bottom:220px!important;}
`;
 document.head.appendChild(s);
}
function isProductionInput(el){
 return !!(el&&el.closest&&el.closest('.actual-input'));
}
function getInput(machine){
 if(!machine)return null;
 var all=document.querySelectorAll('.actual-input');
 for(var i=0;i<all.length;i++){
  if(String(all[i].dataset.machine||'').trim()===machine)return all[i];
 }
 return null;
}
function focusInput(input){
 if(!input||restoring)return;
 restoring=true;
 try{
  if(lockedValue!=='' && input.value!==lockedValue)input.value=lockedValue;
  input.focus({preventScroll:true});
  var p=input.value.length;
  try{input.setSelectionRange(p,p);}catch(e){}
 }catch(e){}
 setTimeout(function(){restoring=false;},80);
}
function remember(input){
 if(!isProductionInput(input))return;
 lockedInput=input;
 lockedMachine=String(input.dataset.machine||'').trim();
 lockedValue=String(input.value||'');
 try{input.setAttribute('inputmode','numeric');input.setAttribute('autocomplete','off');input.setAttribute('enterkeyhint','done');}catch(e){}
}
function keepFocus(){
 if(!lockedMachine||restoring)return;
 var current=getInput(lockedMachine);
 if(!current)return;
 if(current!==lockedInput || document.activeElement!==current){
  if(String(current.value||'')!==lockedValue)current.value=lockedValue;
  lockedInput=current;
  setTimeout(function(){
   if(lockedMachine && document.activeElement!==getInput(lockedMachine))focusInput(getInput(lockedMachine));
  },0);
 }
}
function boot(){
 addStyle();
 document.addEventListener('focusin',function(e){
  if(isProductionInput(e.target)){
   remember(e.target);
   setTimeout(function(){focusInput(e.target);},0);
  }
 },true);
 document.addEventListener('input',function(e){
  if(isProductionInput(e.target)){
   remember(e.target);
   lockedValue=String(e.target.value||'');
  }
 },true);
 document.addEventListener('change',function(e){
  if(isProductionInput(e.target)){
   remember(e.target);
   lockedValue=String(e.target.value||'');
  }
 },true);
 document.addEventListener('blur',function(e){
  if(!isProductionInput(e.target)||restoring)return;
  remember(e.target);
  setTimeout(keepFocus,40);
 },true);
 if(window.MutationObserver){
  var ob=new MutationObserver(function(){
   if(lockedMachine)setTimeout(keepFocus,0);
  });
  ob.observe(document.body,{childList:true,subtree:true});
 }
 window.addEventListener('resize',function(){
  if(lockedMachine)setTimeout(keepFocus,50);
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
