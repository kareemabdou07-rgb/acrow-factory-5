/* ACROW Factory 5 v70 — exact first-touch repair/delete for fault list */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV70)return;
window.__acrowFaultRepairDeleteV70=true;
var lastAction=0;
var STYLE_ID='acrow-fault-repair-delete-v70';
function style(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
    .fault-item{position:relative!important;}
    .fault-item .f-del{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;z-index:999999!important;}
    .fault-item [data-repair-fault]{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;z-index:999999!important;}
  `;
  document.head.appendChild(s);
}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function refresh(){
  try{if(typeof renderFaultList==='function')renderFaultList();}catch(e){}
  try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();}catch(e){}
}
function currentFaultRecord(){
  try{
    if(typeof getRecord==='function' && typeof dateInput!=='undefined' && typeof currentShift!=='undefined' && typeof activeMachineId!=='undefined' && activeMachineId){
      return getRecord(dateInput.value,currentShift,String(activeMachineId));
    }
  }catch(e){}
  return null;
}
function finishRepair(btn){
  var rec=currentFaultRecord();
  if(!rec || !Array.isArray(rec.faults)) return false;
  var idx=Number(btn.getAttribute('data-repair-fault'));
  if(!Number.isInteger(idx) || !rec.faults[idx]) return false;
  var fault=rec.faults[idx];
  if(fault.endTime || fault.repaired || fault.resolved || fault.fixed) return true;
  var end=typeof nowTimeHHMM==='function' ? nowTimeHHMM() : new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  fault.endTime=end;
  if(typeof calcMinutesBetween==='function') fault.mins=calcMinutesBetween(fault.startTime,end)||0;
  else fault.mins=Number(fault.mins)||0;
  fault.repairedAt=end;
  fault.resolved=true;
  fault.repaired=true;
  fault.fixed=true;
  fault.status='repaired';
  save();
  refresh();
  return true;
}
function deleteFault(btn){
  var rec=currentFaultRecord();
  if(!rec || !Array.isArray(rec.faults)) return false;
  var idx=Number(btn.getAttribute('data-idx'));
  if(!Number.isInteger(idx) || !rec.faults[idx]) return false;
  rec.faults.splice(idx,1);
  save();
  refresh();
  return true;
}
function buttonType(btn){
  if(!btn) return '';
  if(btn.classList.contains('f-del')) return 'delete';
  if(btn.hasAttribute('data-repair-fault')) return 'repair';
  return '';
}
function handle(e){
  var btn=e.target&&e.target.closest?e.target.closest('#faultList .f-del,#faultList [data-repair-fault]'):null;
  if(!btn)return;
  var type=buttonType(btn);if(!type)return;
  var now=Date.now();
  if(now-lastAction<700){e.preventDefault();e.stopImmediatePropagation();return;}
  var ok=type==='delete'?deleteFault(btn):finishRepair(btn);
  if(!ok)return; // IMPORTANT: let the original app handler work if our exact target was not found.
  lastAction=now;
  e.preventDefault();
  e.stopPropagation();
  if(e.stopImmediatePropagation)e.stopImmediatePropagation();
}
function init(){
  style();
  document.querySelectorAll('#faultList .f-del').forEach(function(b){b.type='button';});
  document.querySelectorAll('#faultList [data-repair-fault]').forEach(function(b){b.type='button';});
}
document.addEventListener('pointerdown',handle,true);
document.addEventListener('touchstart',handle,true);
document.addEventListener('click',handle,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
})();