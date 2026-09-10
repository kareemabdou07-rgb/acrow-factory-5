/* ACROW Factory 5 v66 — working fault delete + new button position */
(function(){
'use strict';
if(window.__acrowFaultDeleteFixActive)return;
window.__acrowFaultDeleteFixActive=true;
var STYLE_ID='acrow-fault-delete-fix-v66';
function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.fault-item{position:relative!important;padding-left:52px!important;}
.fault-item .f-del{position:absolute!important;left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:36px!important;height:36px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #ff5f6d!important;border-radius:7px!important;background:#3a1c1c!important;color:#ff5f6d!important;font-size:12px!important;z-index:20!important;cursor:pointer!important;}
.fault-item .f-del:hover{background:#ff5f6d!important;color:#111!important;}
`;
 document.head.appendChild(s);
}
function txt(el,sel){var n=el.querySelector(sel);return n?String(n.textContent||'').replace(/\s+/g,' ').trim():'';}
function faultText(btn){var item=btn.closest('.fault-item');return item?{reason:txt(item,'.f-reason'),mins:txt(item,'.f-mins'),all:String(item.textContent||'').replace(/\s+/g,' ').trim()}:null;}
function isFaultObject(o){return o&&typeof o==='object'&&!Array.isArray(o)&&(Object.prototype.hasOwnProperty.call(o,'reason')||Object.prototype.hasOwnProperty.call(o,'category')||Object.prototype.hasOwnProperty.call(o,'description')||Object.prototype.hasOwnProperty.call(o,'details'))&&(Object.prototype.hasOwnProperty.call(o,'start')||Object.prototype.hasOwnProperty.call(o,'startTime')||Object.prototype.hasOwnProperty.call(o,'minutes')||Object.prototype.hasOwnProperty.call(o,'mins')||Object.prototype.hasOwnProperty.call(o,'duration'));}
function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
function matchFault(o,info){
 if(!isFaultObject(o)||!info)return false;
 var reason=norm(o.reason||o.category||o.description||o.details);
 var mins=norm(o.minutes!=null?o.minutes:o.mins!=null?o.mins:o.duration);
 if(info.reason&&reason&&reason!==info.reason&&reason.indexOf(info.reason)<0&&info.reason.indexOf(reason)<0)return false;
 if(info.mins&&mins&&info.mins!==mins&&info.mins.indexOf(mins)<0&&mins.indexOf(info.mins)<0)return false;
 return !!(info.reason&&reason)||!!(info.mins&&mins);
}
function machineHint(){
 var names=['currentFaultMachine','faultMachineId','selectedFaultMachine','selectedMachineId','currentMachine','selectedMachine'];
 for(var i=0;i<names.length;i++){try{if(window[names[i]]!=null){var v=window[names[i]];if(typeof v==='object')v=v.id||v.machine||v.code||v.machineId; if(v!=null&&String(v).trim())return String(v).trim();}}catch(e){}}
 return '';
}
function removeFromRecord(record,info,index){
 if(!record||typeof record!=='object')return false;
 var keys=['faults','failures','maintenanceFaults','maintenanceFailures','faultRecords','faultList'];
 for(var k=0;k<keys.length;k++){
  var a=record[keys[k]];
  if(!Array.isArray(a))continue;
  var pos=-1;
  for(var i=0;i<a.length;i++){if(matchFault(a[i],info)){pos=i;break;}}
  if(pos<0&&index>=0&&index<a.length&&isFaultObject(a[index]))pos=index;
  if(pos>=0){a.splice(pos,1);return true;}
 }
 return false;
}
function deepRemove(obj,info,depth){
 if(!obj||typeof obj!=='object'||depth>5)return false;
 if(Array.isArray(obj)){
  for(var i=0;i<obj.length;i++){
   if(matchFault(obj[i],info)){obj.splice(i,1);return true;}
  }
  for(var j=0;j<obj.length;j++)if(deepRemove(obj[j],info,depth+1))return true;
  return false;
 }
 var keys=Object.keys(obj);
 for(var k=0;k<keys.length;k++){
  var v=obj[keys[k]];
  if(Array.isArray(v)&&/fault|failure|maintenance/i.test(keys[k])){
   for(var i=0;i<v.length;i++)if(matchFault(v[i],info)){v.splice(i,1);return true;}
  }
 }
 for(var q=0;q<keys.length;q++)if(deepRemove(obj[keys[q]],info,depth+1))return true;
 return false;
}
function rerender(){
 try{if(typeof saveStore==='function')saveStore();}catch(e){}
 try{if(typeof renderMaintenance==='function')renderMaintenance();}catch(e){}
 try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}
 try{if(typeof render==='function')render();}catch(e){}
 try{if(typeof renderDashboard==='function')renderDashboard();}catch(e){}
}
function deleteFault(btn){
 var info=faultText(btn);if(!info)return;
 var list=btn.closest('.fault-list');
 var index=list?Array.prototype.indexOf.call(list.querySelectorAll('.fault-item'),btn.closest('.fault-item')):-1;
 var id=machineHint(),removed=false;
 try{
  if(typeof getRecord==='function'&&typeof dateInput!=='undefined'&&id){
   var r=getRecord(dateInput.value,currentShift,id);removed=removeFromRecord(r,info,index);
  }
 }catch(e){}
 if(!removed){try{if(window.store&&store.records)removed=deepRemove(store.records,info,0);}catch(e){}}
 if(!removed){try{if(window.store)removed=deepRemove(window.store,info,0);}catch(e){}}
 if(!removed){
  var candidates=['deleteFault','removeFault','deleteFailure','removeFailure','deleteMaintenanceFault','removeMaintenanceFault'];
  for(var i=0;i<candidates.length;i++){
   try{if(typeof window[candidates[i]]==='function'&&window[candidates[i]]!==deleteFault){window[candidates[i]](index);removed=true;break;}}catch(e){}
  }
 }
 if(removed){
  try{btn.closest('.fault-item').remove();}catch(e){}
  rerender();
 }
}
function decorate(){addStyle();document.querySelectorAll('.f-del').forEach(function(b){b.type='button';b.setAttribute('aria-label','حذف العطل');});}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.f-del'):null;if(!b)return;e.preventDefault();e.stopPropagation();deleteFault(b);},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});
})();
