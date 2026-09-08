/* ACROW Factory 5 — production entry color fix v4 */
(function(){
'use strict';
var STYLE_ID='acrow-production-green-v4';
function addStyle(){
 if(document.getElementById(STYLE_ID)) return;
 var s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent='.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:none!important;}';
 document.head.appendChild(s);
}
function paint(input){
 if(!input) return;
 var has=String(input.value||'').trim()!=='';
 input.classList.toggle('acrow-fixed',has);
}
function paintAll(){
 addStyle();
 document.querySelectorAll('input.actual-input').forEach(paint);
}
function saveInput(input){
 try{
  var id=String(input.dataset.machine||'').trim();
  if(!id || typeof getRecord!=='function' || typeof dateInput==='undefined') return;
  var r=getRecord(dateInput.value,currentShift,id);
  r.actual=input.value===''?null:Number(input.value);
  if(r.actual!==null && Number.isFinite(r.actual)) r.productionFixed=true;
  else r.productionFixed=false;
  if(typeof saveStore==='function') saveStore();
 }catch(e){}
}
document.addEventListener('input',function(e){
 var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;
 if(!input) return;
 paint(input);
 saveInput(input);
 try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(x){}
 try{if(typeof renderReport==='function')renderReport();}catch(x){}
},true);
document.addEventListener('change',function(e){
 var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;
 if(input){paint(input);saveInput(input);}
},true);
var observer=new MutationObserver(function(){paintAll();});
function start(){
 addStyle();
 paintAll();
 observer.observe(document.body,{childList:true,subtree:true});
 setTimeout(paintAll,200);
 setTimeout(paintAll,700);
 setTimeout(paintAll,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
