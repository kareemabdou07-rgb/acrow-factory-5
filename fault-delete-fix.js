/* ACROW Factory 5 v69 — first-touch repair and delete fault buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV69)return;
window.__acrowFaultRepairDeleteV69=true;
var STYLE_ID='acrow-fault-repair-delete-v69';
var lastAction=0;
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.fault-item{position:relative!important;padding-left:52px!important;}
.fault-item .f-del{position:absolute!important;left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:36px!important;height:36px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #ff5f6d!important;border-radius:7px!important;background:#3a1c1c!important;color:#ff5f6d!important;font-size:12px!important;z-index:99999!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important;}
.fault-item button,.fault-item a{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;}
`;
 document.head.appendChild(s);
}
function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
function faultBox(btn){return btn.closest('.fault-item,.fault-row,.failure-item,.maintenance-fault,.fault-card,[data-fault-id]')||btn.parentElement;}
function info(btn){var item=faultBox(btn);if(!item)return null;var r=item.querySelector('.f-reason'),m=item.querySelector('.f-mins');var id=item.getAttribute('data-fault-id')||item.dataset&&item.dataset.faultId||'';return {item:item,reason:norm(r?r.textContent:''),mins:norm(m?m.textContent:''),id:norm(id)};}
function isFault(o){return o&&typeof o==='object'&&!Array.isArray(o)&&(o.reason!=null||o.category!=null||o.description!=null||o.details!=null)&&(o.minutes!=null||o.mins!=null||o.duration!=null||o.start!=null||o.startTime!=null||o.startedAt!=null);}
function match(o,x){if(!isFault(o)||!x)return false;var id=norm(o.id||o.faultId||o.recordId||o.key);if(x.id&&id&&x.id===id)return true;var r=norm(o.reason||o.category||o.description||o.details||o.name||o.title),m=norm(o.minutes!=null?o.minutes:o.mins!=null?o.mins:o.duration);if(x.reason&&r&&r!==x.reason&&r.indexOf(x.reason)<0&&x.reason.indexOf(r)<0)return false;if(x.mins&&m&&x.mins!==m&&x.mins.indexOf(m)<0&&m.indexOf(x.mins)<0)return false;return !!((x.reason&&r)||(x.mins&&m));}
function machineId(){var a=['currentFaultMachine','faultMachineId','selectedFaultMachine','selectedMachineId','currentMachine','selectedMachine'];for(var i=0;i<a.length;i++){try{var v=window[a[i]];if(v&&typeof v==='object')v=v.id||v.machineId||v.code||v.machine;if(v!=null&&norm(v))return norm(v);}catch(e){}}return '';}
function eachFaultArray(record,fn){if(!record||typeof record!=='object')return false;var keys=['faults','failures','maintenanceFaults','maintenanceFailures','faultRecords','faultList'];for(var k=0;k<keys.length;k++){var a=record[keys[k]];if(Array.isArray(a)&&fn(a))return true;}return false;}
function deep(obj,fn,depth){if(!obj||typeof obj!=='object'||depth>8)return false;if(Array.isArray(obj)){if(fn(obj))return true;for(var i=0;i<obj.length;i++)if(deep(obj[i],fn,depth+1))return true;return false;}var ks=Object.keys(obj);for(var j=0;j<ks.length;j++)if(deep(obj[ks[j]],fn,depth+1))return true;return false;}
function getRecordSafe(){try{if(typeof getRecord==='function'&&typeof dateInput!=='undefined'&&typeof currentShift!=='undefined'){var id=machineId();if(id)return getRecord(dateInput.value,currentShift,id);}}catch(e){}return null;}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function redraw(){save();['renderMaintenance','renderFaults','renderFailures','render','renderDashboard','rebuildMachines'].forEach(function(n){try{if(typeof window[n]==='function')window[n]();}catch(e){}});}
function deleteFault(btn){var x=info(btn),removed=false;if(!x)return false;var rec=getRecordSafe();if(rec)removed=eachFaultArray(rec,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true;}}return false;});if(!removed&&window.store)removed=deep(window.store,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true;}}return false;},0);if(!removed){try{var raw=localStorage.getItem('acrow_factory_5');if(raw){var d=JSON.parse(raw);if(deep(d,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true;}}return false;},0)){localStorage.setItem('acrow_factory_5',JSON.stringify(d));removed=true;}}}catch(e){}}if(removed){try{x.item.remove();}catch(e){}redraw();}return removed;}
function repairFault(btn){var x=info(btn),changed=false;if(!x)return false;var now=new Date(),iso=now.toISOString();function repair(o){if(!match(o,x)||o.repaired===true||o.resolved===true)return false;o.repaired=true;o.resolved=true;o.fixed=true;o.status='repaired';o.endTime=o.endTime||iso;o.end=o.end||iso;o.endedAt=o.endedAt||iso;o.repairedAt=iso;o.repairTime=iso;var st=o.startTime||o.start||o.startedAt;if(st){var t=Date.parse(st);if(!isNaN(t)){var mins=Math.max(0,Math.round((now.getTime()-t)/60000));if(o.minutes!=null)o.minutes=mins;if(o.mins!=null)o.mins=mins;if(o.duration!=null)o.duration=mins;if(o.duration==null&&o.minutes==null&&o.mins==null)o.duration=mins;}}return true;}
var rec=getRecordSafe();if(rec)changed=deep(rec,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false;},0);if(!changed&&window.store)changed=deep(window.store,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false;},0);if(!changed){try{var raw=localStorage.getItem('acrow_factory_5');if(raw){var d=JSON.parse(raw);if(deep(d,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false;},0)){localStorage.setItem('acrow_factory_5',JSON.stringify(d));changed=true;}}}catch(e){}}if(changed)redraw();return changed;}
function buttonType(b){var t=norm(b.textContent);if(b.classList.contains('f-del')||/^(حذف|حذف العطل|مسح)$/.test(t))return 'delete';if(/تم\s*الإصلاح|تم\s*الاصلاح|إصلاح|اصلاح/.test(t))return 'repair';return '';}
function handle(e){var b=e.target&&e.target.closest?e.target.closest('button,a,.mc-btn'):null;if(!b)return;var type=buttonType(b);if(!type)return;var now=Date.now();if(now-lastAction<650)return;lastAction=now;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(type==='delete')deleteFault(b);else repairFault(b);}
function init(){style();document.querySelectorAll('.f-del').forEach(function(b){b.type='button';b.style.pointerEvents='auto';b.style.touchAction='manipulation';});}
document.addEventListener('pointerdown',handle,true);
document.addEventListener('touchstart',handle,true);
document.addEventListener('click',handle,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
})();