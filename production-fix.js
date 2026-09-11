/* ACROW Factory 5 — v68: stable production + repair/delete fault buttons + merged machine list */
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

/* Unified machine list: production project + Factory 5 reference project. */
var MERGED_MACHINES=[
 ['1712','منشار RSA'],['982','متقاب/مثقاب'],['961','متقاب'],['263','مثقاب'],['882','مثقاب'],
 ['1522','Ledgers/Ring'],['999','Ledgers/Ring'],['5004','Ledgers/Ring'],['5003','Ledgers/Ring'],['1521','Ledgers/Ring'],['998','Ledgers/Ring'],
 ['997','Ring Vertical'],['996','Ring Vertical'],['5006','Ring Vertical'],
 ['5005','Cup Lock Vertical'],['450','Cup Lock Vertical'],['1524','Cup Lock Vertical'],['1523','Cup Lock Vertical'],
 ['5008','فوله اوتوماتيك'],['402','Hand welding'],['455','Hand welding'],['118','Hand welding'],['116','Hand welding'],['404','Hand welding'],['1502','منطقة الفرز'],
 ['279','مكبس'],['225','مكبس'],['956','مكبس'],['284','مكبس'],['1107','مكبس تخريم'],['1324','مكبس تشكيل'],['1313','مكنه تشكيل'],['1320','مكنه تشكيل'],['147','مكنه تشكيل'],
 ['986','متقاب'],['1306','متقاب'],['963','متقاب'],['1317','متقاب'],['1318','متقاب'],['964','متقاب'],['954','منشار'],['1713','متقاب متعدد'],
 ['112','فريم كوباية'],['114','فريم كوباية'],['477','فارمه يدوي'],['1504','فارمه يدوي'],['712','فارمه يدوي'],['710','فارمه يدوي'],['122','فارمه يدوي'],['454','فارمه يدوي'],['713','فارمه يدوي'],['115','فارمه يدوي'],['117','فارمه يدوي'],['711','فارمه يدوي'],['456','فارمه يدوي'],['1501','ماكينه يدوي'],['120','ماكينه يدوي']
];
var mergedNumbers=MERGED_MACHINES.map(function(x){return String(x[0]);});
function mergeMachineOptions(){
 try{
  document.querySelectorAll('select').forEach(function(sel){
   var txt=(sel.id+' '+sel.name+' '+sel.className+' '+(sel.getAttribute('aria-label')||'')).toLowerCase();
   var looksMachine=/machine|ماكين|ماكينه|مكن|اختيار/.test(txt)||Array.prototype.some.call(sel.options,function(o){return mergedNumbers.indexOf(String(o.value||o.textContent).trim())>=0;});
   if(!looksMachine)return;
   var existing={};Array.prototype.forEach.call(sel.options,function(o){existing[String(o.value||o.textContent).trim()]=true;});
   MERGED_MACHINES.forEach(function(m){if(!existing[m[0]]){var o=document.createElement('option');o.value=m[0];o.textContent=m[0]+' — '+m[1];sel.appendChild(o);}});
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
   var t=(cb.value||cb.dataset.machine||'').trim();if(mergedNumbers.indexOf(t)>=0)cb.dataset.mergedMachine='1';
  });
 }catch(e){console.warn('machine list merge failed',e);}
}
function mergeMachineStore(){
 try{
  if(window.store&&Array.isArray(window.store.machines)){
   var seen={};store.machines.forEach(function(m){seen[String(m.number||m.id||m.machine||'')]=true;});
   MERGED_MACHINES.forEach(function(m){if(!seen[m[0]])store.machines.push({number:m[0],name:m[1],zone:'منطقة 1'});});
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