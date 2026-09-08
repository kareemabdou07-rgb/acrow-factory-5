/* ACROW Factory 5 — production green + hard password guard v6 */
(function(){
'use strict';
var STYLE_ID='acrow-production-green-v6';
function setupStyle(){
 if(document.getElementById(STYLE_ID)) return;
 var s=document.createElement('style'); s.id=STYLE_ID;
 s.textContent='input.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:none!important;} .machine-card.acrow-production-done{background:linear-gradient(135deg,#123d2b,#102d22)!important;border-color:#159957!important;box-shadow:0 0 0 2px rgba(21,153,87,.18),inset 0 0 18px rgba(21,153,87,.08)!important;} .machine-card.acrow-production-done .mc-name{color:#b9f3d1!important;}';
 document.head.appendChild(s);
}
function disableGoogleTranslate(){try{document.documentElement.classList.add('notranslate');document.body.classList.add('notranslate');if(!document.querySelector('meta[name="google"]')){var m=document.createElement('meta');m.name='google';m.content='notranslate';document.head.appendChild(m);}}catch(e){}}
function paint(input){if(!input)return;var has=String(input.value||'').trim()!=='';input.classList.toggle('acrow-fixed',has);var card=input.closest('.machine-card');if(card)card.classList.toggle('acrow-production-done',has);}
function paintAll(){setupStyle();disableGoogleTranslate();document.querySelectorAll('input.actual-input').forEach(paint);}
function saveInput(input){try{var id=String(input.dataset.machine||'').trim();if(!id||typeof getRecord!=='function'||typeof dateInput==='undefined')return;var r=getRecord(dateInput.value,currentShift,id);r.actual=input.value===''?null:Number(input.value);r.productionFixed=String(input.value||'').trim()!=='';if(typeof saveStore==='function')saveStore();}catch(e){}}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;if(!input)return;paint(input);saveInput(input);try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(x){}try{if(typeof renderReport==='function')renderReport();}catch(x){}},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;if(input){paint(input);saveInput(input);}},true);

var PASSWORD='55555';
var IDS=['planStatusBtn','maintenanceBtn','adminMenuBtn','jumpToAnalysisBtn'];
function passwordOK(){var p=window.prompt('أدخل كلمة المرور');if(p===null)return false;if(String(p)!==PASSWORD){window.alert('كلمة المرور غير صحيحة');return false;}return true;}
function openById(id,el){
 if(!passwordOK())return;
 if(id==='planStatusBtn'&&typeof window.openMonthlyPlan==='function'){window.openMonthlyPlan();return;}
 if(id==='maintenanceBtn'&&typeof window.openMaintenanceView==='function'){window.openMaintenanceView();return;}
 if(id==='adminMenuBtn'&&typeof window.openAdminModal==='function'){window.openAdminModal();return;}
 if(id==='jumpToAnalysisBtn'){var sec=document.getElementById('analysisSection');if(sec){sec.style.display='';sec.scrollIntoView({behavior:'smooth',block:'start'});}try{if(typeof renderReport==='function')renderReport();}catch(e){}}
}
function installGuards(){
 IDS.forEach(function(id){
  var el=document.getElementById(id); if(!el||el.dataset.acrowGuard==='1')return;
  el.dataset.acrowGuard='1';
  var old=el.onclick;
  el.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}openById(id,el);return false;};
  if(old) el.dataset.acrowHadOld='1';
 });
}
function captureGuard(e){var el=e.target&&e.target.closest?e.target.closest('#planStatusBtn,#maintenanceBtn,#adminMenuBtn,#jumpToAnalysisBtn'):null;if(!el)return;e.preventDefault();e.stopImmediatePropagation();openById(el.id,el);}
function start(){setupStyle();disableGoogleTranslate();paintAll();installGuards();document.addEventListener('click',captureGuard,true);var o=new MutationObserver(function(){paintAll();installGuards();});o.observe(document.body,{childList:true,subtree:true});setTimeout(installGuards,300);setTimeout(installGuards,1000);setTimeout(installGuards,2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
