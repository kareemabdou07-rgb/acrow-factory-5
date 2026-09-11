/* ACROW Factory 5 — Merged Strong v1
   Production + Factory 5 reference machine master.
   Stability-first: this layer augments the existing production app; it does not replace Firebase, reports or calculations.
*/
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v65';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;background-image:none!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;transition:none!important;}
.actual-input.acrow-fixed,.actual-input.acrow-fixed:focus,.actual-input[data-production-done="1"]{background:#b9f3d1!important;background-image:none!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:inset 0 0 0 9999px #b9f3d1!important;}
.mc-row,.acrow-production-row{display:grid!important;grid-template-columns:58px 160px!important;align-items:center!important;column-gap:8px!important;width:100%!important;box-sizing:border-box!important;}
.mc-row>label,.acrow-production-row>label{grid-column:1!important;width:58px!important;min-width:58px!important;max-width:58px!important;flex:none!important;position:static!important;box-sizing:border-box!important;}
.mc-row>.actual-input,.mc-row>.mc-target-fixed,.acrow-production-row>.actual-input,.acrow-production-row>.mc-target-fixed{grid-column:2!important;width:160px!important;min-width:160px!important;max-width:160px!important;flex:none!important;box-sizing:border-box!important;}
.acrow-production-row .actual-input{height:70px!important;min-height:70px!important;max-height:70px!important;font-size:28px!important;text-align:center!important;font-weight:800!important;padding:6px!important;}
.mc-row .mc-target-fixed{height:70px!important;min-height:70px!important;max-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}
.mc-row .mc-target-fixed small{white-space:nowrap!important;}
.mc-bottom{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;gap:8px!important;width:100%!important;}
.mc-bottom>.mc-btn.has-faults{width:110px!important;min-width:110px!important;max-width:110px!important;flex:none!important;box-sizing:border-box!important;overflow:hidden!important;white-space:nowrap!important;}
.acrow-production-row.acrow-production-done{background:#b9f3d1!important;border:3px solid #159957!important;border-radius:10px!important;padding:0!important;box-shadow:none!important;}
.acrow-production-row.acrow-production-done .production-label{color:#063b22!important;}
.acrow-production-row.acrow-production-done .actual-input{background:#b9f3d1!important;background-image:none!important;border-color:#159957!important;color:#063b22!important;}
.acrow-production-row .production-fix-btn-v2{display:none!important;}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function paint(input,r){var has=String(input.value||'').trim()!=='';var row=input.closest('.mc-row')||input.parentElement;input.classList.toggle('acrow-fixed',has);input.setAttribute('data-production-done',has?'1':'0');if(row){row.classList.add('acrow-production-row');row.classList.toggle('acrow-production-done',has);}input.style.setProperty('background',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-color',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-image','none','important');input.style.setProperty('border-color',has?'#159957':'#e0ad00','important');input.style.setProperty('color',has?'#063b22':'#4a3900','important');if(has)input.style.setProperty('box-shadow','inset 0 0 0 9999px #b9f3d1','important');else input.style.setProperty('box-shadow','none','important');if(r)r.productionFixed=has;}
function decorate(root){style();(root||document).querySelectorAll('.actual-input').forEach(function(input){paint(input,rec(String(input.dataset.machine||'').trim()));});}

/* One master list: every machine found in the production app + Factory 5 reference app.
   Fields are: number, name/stage, zone, section. The production app keeps its own targets/records. */
var MERGED_MACHINES=[
 ['1712','منشار RSA','منطقة 1','تجهيزات منطقة 1'],['982','متقاب/مثقاب','منطقة 1','تجهيزات منطقة 1'],['961','متقاب','منطقة 1','تجهيزات منطقة 1'],['263','مثقاب','منطقة 1','تجهيزات منطقة 1'],['882','مثقاب','منطقة 1','تجهيزات منطقة 1'],
 ['1522','Ledgers/Ring','منطقة 1','لحام منطقة 1'],['999','Ledgers/Ring','منطقة 1','لحام منطقة 1'],['5004','Ledgers/Ring','منطقة 1','لحام منطقة 1'],['5003','Ledgers/Ring','منطقة 1','لحام منطقة 1'],['1521','Ledgers/Ring','منطقة 1','لحام منطقة 1'],['998','Ledgers/Ring','منطقة 1','لحام منطقة 1'],
 ['997','Ring Vertical','منطقة 1','لحام منطقة 1'],['996','Ring Vertical','منطقة 1','لحام منطقة 1'],['5006','Ring Vertical','منطقة 1','لحام منطقة 1'],
 ['5005','Cup Lock Vertical','منطقة 1','لحام منطقة 1'],['450','Cup Lock Vertical','منطقة 1','لحام منطقة 1'],['1524','Cup Lock Vertical','منطقة 1','لحام منطقة 1'],['1523','Cup Lock Vertical','منطقة 1','لحام منطقة 1'],
 ['5008','فوله اوتوماتيك','منطقة 1','لحام منطقة 1'],['116','فوله يدوي','منطقة 1','لحام منطقة 1'],['404','فوله يدوي','منطقة 1','لحام منطقة 1'],['118','فوله يدوي','منطقة 1','لحام منطقة 1'],['455','فوله يدوي','منطقة 1','لحام منطقة 1'],['402','فوله يدوي','منطقة 1','لحام منطقة 1'],['1502','منطقة الفرز','منطقة 1','لحام منطقة 1'],
 ['279','مكبس','منطقة 2','تجهيزات منطقة 2'],['225','مكبس','منطقة 2','تجهيزات منطقة 2'],['956','مكبس','منطقة 2','تجهيزات منطقة 2'],['284','مكبس','منطقة 2','تجهيزات منطقة 2'],['1107','مكبس تخريم','منطقة 2','تجهيزات منطقة 2'],['1324','مكبس تشكيل','منطقة 2','تجهيزات منطقة 2'],['1313','ماكينة تشكيل','منطقة 2','تجهيزات منطقة 2'],['1320','ماكينة تشكيل','منطقة 2','تجهيزات منطقة 2'],['147','ماكينة تشكيل','منطقة 2','تجهيزات منطقة 2'],
 ['986','متقاب','منطقة 2','تجهيزات منطقة 2'],['1306','متقاب','منطقة 2','تجهيزات منطقة 2'],['963','متقاب','منطقة 2','تجهيزات منطقة 2'],['1317','متقاب','منطقة 2','تجهيزات منطقة 2'],['1318','متقاب','منطقة 2','تجهيزات منطقة 2'],['964','متقاب','منطقة 2','تجهيزات منطقة 2'],['954','منشار','منطقة 2','تجهيزات منطقة 2'],['1713','متقاب متعدد','منطقة 2','تجهيزات منطقة 2'],
 ['112','فريم كوباية','منطقة 2','لحام منطقة 2'],['114','فريم كوباية','منطقة 2','لحام منطقة 2'],['477','فارمه يدوي','منطقة 2','لحام منطقة 2'],['1504','فارمه يدوي','منطقة 2','لحام منطقة 2'],['712','فارمه يدوي','منطقة 2','لحام منطقة 2'],['710','فارمه يدوي','منطقة 2','لحام منطقة 2'],['122','فارمه يدوي','منطقة 2','لحام منطقة 2'],['454','فارمه يدوي','منطقة 2','لحام منطقة 2'],['713','فارمه يدوي','منطقة 2','لحام منطقة 2'],['115','فارمه يدوي','منطقة 2','لحام منطقة 2'],['117','فارمه يدوي','منطقة 2','لحام منطقة 2'],['711','فارمه يدوي','منطقة 2','لحام منطقة 2'],['456','فارمه يدوي','منطقة 2','لحام منطقة 2'],['1501','ماكينة يدوي','منطقة 2','لحام منطقة 2'],['120','ماكينة يدوي','منطقة 2','لحام منطقة 2']
];
var mergedNumbers=MERGED_MACHINES.map(function(x){return String(x[0]);});
var machineMap={};MERGED_MACHINES.forEach(function(m){machineMap[m[0]]={number:m[0],name:m[1],zone:m[2],section:m[3],stage:m[1]};});
window.ACROW_MERGED_MACHINE_MASTER=machineMap;
window.ACROW_MERGED_MACHINE_LIST=MERGED_MACHINES;

function mergeMachineOptions(){
 try{
  document.querySelectorAll('select').forEach(function(sel){
   var txt=(sel.id+' '+sel.name+' '+sel.className+' '+(sel.getAttribute('aria-label')||'')).toLowerCase();
   var looksMachine=/machine|ماكين|ماكينه|مكن|اختيار/.test(txt)||Array.prototype.some.call(sel.options,function(o){return mergedNumbers.indexOf(String(o.value||o.textContent).trim())>=0;});
   if(!looksMachine)return;
   var existing={};Array.prototype.forEach.call(sel.options,function(o){existing[String(o.value||o.textContent).trim()]=true;});
   MERGED_MACHINES.forEach(function(m){if(!existing[m[0]]){var o=document.createElement('option');o.value=m[0];o.textContent=m[0]+' — '+m[1]+' — '+m[2];sel.appendChild(o);}});
  });
 }catch(e){console.warn('machine list merge failed',e);}
}
function mergeMachineStore(){
 try{
  if(window.store&&Array.isArray(window.store.machines)){
   var seen={};store.machines.forEach(function(m){seen[String(m.number||m.id||m.machine||'')]=m;});
   MERGED_MACHINES.forEach(function(m){
    var old=seen[m[0]];
    if(old){old.name=old.name||m[1];old.zone=m[2];old.section=m[3];old.stage=old.stage||m[1];}
    else store.machines.push({number:m[0],name:m[1],zone:m[2],section:m[3],stage:m[1]});
   });
   try{if(typeof saveStore==='function')saveStore();}catch(e){}
  }
 }catch(e){console.warn('machine store merge failed',e);}
}
function decorateMerged(){mergeMachineStore();mergeMachineOptions();decorate();}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;e.stopImmediatePropagation();var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';}paint(input,r);},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);mergeMachineOptions();},true);
document.addEventListener('blur',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
function watch(){if(!window.MutationObserver)return;var ob=new MutationObserver(function(list){list.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){decorate(n);mergeMachineOptions();}});});});ob.observe(document.body,{childList:true,subtree:true});}
function start(){style();decorateMerged();watch();setTimeout(decorateMerged,500);setTimeout(decorateMerged,1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
(function loadFaultRepairDeleteFix(){if(window.__acrowFaultRepairDeleteV68Loaded)return;window.__acrowFaultRepairDeleteV68Loaded=true;var s=document.createElement('script');s.src='fault-delete-fix.js?v=68';s.async=false;document.head.appendChild(s);})();
})();