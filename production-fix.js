/* ACROW Factory 5 — production entry green v5 */
(function(){
'use strict';
var STYLE_ID='acrow-production-green-v5';
function setupStyle(){
 if(document.getElementById(STYLE_ID)) return;
 var s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent='input.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:none!important;}';
 document.head.appendChild(s);
}
function disableGoogleTranslate(){
 try{
  document.documentElement.classList.add('notranslate');
  document.body.classList.add('notranslate');
  if(!document.querySelector('meta[name="google"]')){
   var m=document.createElement('meta');m.name='google';m.content='notranslate';document.head.appendChild(m);
  }
 }catch(e){}
}
function paint(input){
 if(!input)return;
 var has=String(input.value||'').trim()!=='';
 input.classList.toggle('acrow-fixed',has);
 if(has){
  input.style.setProperty('background','#b9f3d1','important');
  input.style.setProperty('border','3px solid #159957','important');
  input.style.setProperty('color','#063b22','important');
 }else{
  input.style.removeProperty('background');
  input.style.removeProperty('border');
  input.style.removeProperty('color');
 }
}
function paintAll(){setupStyle();disableGoogleTranslate();document.querySelectorAll('input.actual-input').forEach(paint);}
function saveInput(input){
 try{
  var id=String(input.dataset.machine||'').trim();
  if(!id||typeof getRecord!=='function'||typeof dateInput==='undefined')return;
  var r=getRecord(dateInput.value,currentShift,id);
  r.actual=input.value===''?null:Number(input.value);
  r.productionFixed=String(input.value||'').trim()!=='';
  if(typeof saveStore==='function')saveStore();
 }catch(e){}
}
document.addEventListener('input',function(e){
 var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;
 if(!input)return;
 paint(input);saveInput(input);
 try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(x){}
 try{if(typeof renderReport==='function')renderReport();}catch(x){}
},true);
document.addEventListener('change',function(e){
 var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;
 if(input){paint(input);saveInput(input);}
},true);
var observer=new MutationObserver(function(){paintAll();});
function start(){setupStyle();disableGoogleTranslate();paintAll();observer.observe(document.body,{childList:true,subtree:true});setTimeout(paintAll,200);setTimeout(paintAll,700);setTimeout(paintAll,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
