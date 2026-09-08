/* ACROW Factory 5 — production entry green v5 + protected sections */
(function(){
'use strict';
var STYLE_ID='acrow-production-green-v5';
function setupStyle(){
 if(document.getElementById(STYLE_ID)) return;
 var s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent='input.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:none!important;} .machine-card.acrow-production-done{background:linear-gradient(135deg,#123d2b,#102d22)!important;border-color:#159957!important;box-shadow:0 0 0 2px rgba(21,153,87,.18),inset 0 0 18px rgba(21,153,87,.08)!important;} .machine-card.acrow-production-done .mc-name{color:#b9f3d1!important;}';
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
 var card=input.closest('.machine-card');
 if(card) card.classList.toggle('acrow-production-done',has);
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

/* One password for the protected management areas. */
var PROTECTED_PASSWORD='55555';
var PROTECTED_IDS={planStatusBtn:1,adminMenuBtn:1,maintenanceBtn:1,jumpToAnalysisBtn:1};
function askPassword(){
 var value=window.prompt('أدخل كلمة المرور');
 if(value===null)return false;
 if(String(value)!==PROTECTED_PASSWORD){window.alert('كلمة المرور غير صحيحة');return false;}
 return true;
}
function runProtected(id,button){
 if(!askPassword())return;
 if(id==='planStatusBtn'){
  if(typeof window.openMonthlyPlan==='function')window.openMonthlyPlan();
  else if(button&&typeof button.onclick==='function')button.onclick();
 }else if(id==='maintenanceBtn'){
  if(typeof window.openMaintenanceView==='function')window.openMaintenanceView();
 }else if(id==='adminMenuBtn'){
  if(typeof window.openAdminModal==='function')window.openAdminModal();
 }else if(id==='jumpToAnalysisBtn'){
  var sec=document.getElementById('analysisSection');
  if(sec){sec.style.display='';sec.scrollIntoView({behavior:'smooth',block:'start'});}
  try{if(typeof renderReport==='function')renderReport();}catch(e){}
 }
}
function bindPasswordGuard(){
 if(document.documentElement.dataset.acrowPasswordGuard==='1')return;
 document.documentElement.dataset.acrowPasswordGuard='1';
 document.addEventListener('click',function(e){
  var el=e.target&&e.target.closest?e.target.closest('#planStatusBtn,#adminMenuBtn,#maintenanceBtn,#jumpToAnalysisBtn'):null;
  if(!el)return;
  var id=el.id;
  if(!PROTECTED_IDS[id])return;
  e.preventDefault();
  e.stopImmediatePropagation();
  runProtected(id,el);
 },true);
}
var observer=new MutationObserver(function(){paintAll();bindPasswordGuard();});
function start(){setupStyle();disableGoogleTranslate();paintAll();bindPasswordGuard();observer.observe(document.body,{childList:true,subtree:true});setTimeout(paintAll,200);setTimeout(paintAll,700);setTimeout(paintAll,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
