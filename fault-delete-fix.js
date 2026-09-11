/* ACROW Factory 5 v68 — repair and delete fault buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV68)return;
window.__acrowFaultRepairDeleteV68=true;
var STYLE_ID='acrow-fault-repair-delete-v68';
function style(){if(document.getElementById(STYLE_ID))return;var s=document.createElement('style');s.id=STYLE_ID;s.textContent='.fault-item{position:relative!important;padding-left:52px!important}.fault-item .f-del{position:absolute!important;left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:36px!important;height:36px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #ff5f6d!important;border-radius:7px!important;background:#3a1c1c!important;color:#ff5f6d!important;font-size:12px!important;z-index:9999!important;cursor:pointer!important;pointer-events:auto!important;}';document.head.appendChild(s)}
function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim()}
function info(btn){var item=btn.closest('.fault-item');if(!item)return null;var r=item.querySelector('.f-reason'),m=item.querySelector('.f-mins');return {item:item,reason:norm(r?r.textContent:''),mins:norm(m?m.textContent:'')}}
function isFault(o){return o&&typeof o==='object'&&!Array.isArray(o)&&(o.reason!=null||o.category!=null||o.description!=null||o.details!=null)&&(o.minutes!=null||o.mins!=null||o.duration!=null||o.start!=null||o.startTime!=null)}
function match(o,x){if(!isFault(o)||!x)return false;var r=norm(o.reason||o.category||o.description||o.details),m=norm(o.minutes!=null?o.minutes:o.mins!=null?o.mins:o.duration);if(x.reason&&r&&r!==x.reason&&r.indexOf(x.reason)<0&&x.reason.indexOf(r)<0)return false;if(x.mins&&m&&x.mins!==m&&x.mins.indexOf(m)<0&&m.indexOf(x.mins)<0)return false;return !!(x.reason&&r)||!!(x.mins&&m)}
function machineId(){var a=['currentFaultMachine','faultMachineId','selectedFaultMachine','selectedMachineId','currentMachine','selectedMachine'];for(var i=0;i<a.length;i++){try{var v=window[a[i]];if(v&&typeof v==='object')v=v.id||v.machineId||v.code||v.machine;if(v!=null&&norm(v))return norm(v)}catch(e){}}return ''}
function eachFaultArray(record,fn){if(!record||typeof record!=='object')return false;var keys=['faults','failures','maintenanceFaults','maintenanceFailures','faultRecords','faultList'];for(var k=0;k<keys.length;k++){var a=record[keys[k]];if(Array.isArray(a)&&fn(a))return true}return false}
function deep(obj,fn,depth){if(!obj||typeof obj!=='object'||depth>7)return false;if(Array.isArray(obj)){if(fn(obj))return true;for(var i=0;i<obj.length;i++)if(deep(obj[i],fn,depth+1))return true;return false}var ks=Object.keys(obj);for(var j=0;j<ks.length;j++)if(deep(obj[ks[j]],fn,depth+1))return true;return false}
function getRecordSafe(){try{if(typeof getRecord==='function'&&typeof dateInput!=='undefined'&&typeof currentShift!=='undefined'){var id=machineId();if(id)return getRecord(dateInput.value,currentShift,id)}}catch(e){}return null}
function save(){try{if(typeof saveStore==='function')saveStore()}catch(e){}}
function redraw(){save();['renderMaintenance','renderFaults','renderFailures','render','renderDashboard','rebuildMachines'].forEach(function(n){try{if(typeof window[n]==='function')window[n]()}catch(e){}})}
function deleteFault(btn){var x=info(btn),removed=false;if(!x)return;var rec=getRecordSafe();if(rec)removed=eachFaultArray(rec,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true}}return false});if(!removed&&window.store)removed=deep(window.store,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true}}return false},0);if(!removed){try{var raw=localStorage.getItem('acrow_factory_5');if(raw){var d=JSON.parse(raw);if(deep(d,function(a){for(var i=0;i<a.length;i++){if(match(a[i],x)){a.splice(i,1);return true}}return false},0)){localStorage.setItem('acrow_factory_5',JSON.stringify(d));removed=true}}}catch(e){}}if(removed){try{x.item.remove()}catch(e){}redraw()}}
function repairFault(btn){var x=info(btn),changed=false;if(!x)return;var now=new Date(),iso=now.toISOString();function repair(o){if(!match(o,x)||o.repaired===true||o.resolved===true)return false;o.repaired=true;o.resolved=true;o.fixed=true;o.status='repaired';o.endTime=o.endTime||iso;o.end=o.end||iso;o.endedAt=o.endedAt||iso;o.repairedAt=iso;o.repairTime=iso;var st=o.startTime||o.start||o.startedAt;if(st){var t=Date.parse(st);if(!isNaN(t)){var mins=Math.max(0,Math.round((now.getTime()-t)/60000));if(o.minutes!=null)o.minutes=mins;if(o.mins!=null)o.mins=mins;if(o.duration!=null)o.duration=mins;if(o.duration==null&&o.minutes==null&&o.mins==null)o.duration=mins}}return true}var rec=getRecordSafe();if(rec)changed=deep(rec,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false},0);if(!changed&&window.store)changed=deep(window.store,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false},0);if(!changed){try{var raw=localStorage.getItem('acrow_factory_5');if(raw){var d=JSON.parse(raw);if(deep(d,function(a){for(var i=0;i<a.length;i++)if(repair(a[i]))return true;return false},0)){localStorage.setItem('acrow_factory_5',JSON.stringify(d));changed=true}}}catch(e){}}if(changed)redraw()}
function click(e){var b=e.target&&e.target.closest?e.target.closest('button,a,.mc-btn'):null;if(!b)return;var item=b.closest&&b.closest('.fault-item');if(!item)return;var t=norm(b.textContent);if(b.classList.contains('f-del')||/^(حذف|حذف العطل|مسح)$/.test(t)){e.preventDefault();e.stopImmediatePropagation();deleteFault(b);return}if(/تم\s*الإصلاح|تم\s*الاصلاح|إصلاح|اصلاح/.test(t)){setTimeout(function(){repairFault(b)},0)}}
function init(){style();document.querySelectorAll('.f-del').forEach(function(b){b.type='button';b.style.pointerEvents='auto'})}
document.addEventListener('click',click,true);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
(function(){
 function machineData(){try{if(!window.store||!Array.isArray(store.machines))return [];var out=[],seen={};store.machines.forEach(function(m){var id=norm(m.number||m.code||m.id||m.machine||'');if(!id||seen[id])return;seen[id]=1;var name=norm(m.name||m.type||m.machineName||id);out.push({id:id,name:name||id,dept:norm(m.dept||'sorting'),deptName:norm(m.deptName||'منطقة الفرز'),target:m.target})});return out}catch(e){return []}}
 function looksLikeMachineSelect(s){var t=norm((s.id||'')+' '+(s.name||'')+' '+(s.className||'')+' '+(s.getAttribute('aria-label')||'')+' '+(s.getAttribute('data-label')||'')).toLowerCase();if(/machine|ماكين|ماكينه|مكن|اختيار|خطة|plan|انتاج|إنتاج/.test(t))return true;return Array.prototype.some.call(s.options||[],function(o){return /^(USR\d+|\d+)$/.test(norm(o.value||o.textContent))})}
 function syncMachineSelectors(){var data=machineData();if(!data.length)return;document.querySelectorAll('select').forEach(function(s){if(!looksLikeMachineSelect(s))return;var existing={};Array.prototype.forEach.call(s.options,function(o){existing[norm(o.value)]=1});data.forEach(function(m){if(existing[m.id])return;var o=document.createElement('option');o.value=m.id;o.textContent=m.id+' — '+m.name;s.appendChild(o);existing[m.id]=1})})}
 function afterRebuild(){try{if(typeof window.rebuildMachines==='function')window.rebuildMachines()}catch(e){}setTimeout(syncMachineSelectors,30);setTimeout(syncMachineSelectors,150);setTimeout(syncMachineSelectors,500);setTimeout(syncMachineSelectors,1000)}
 function boot(){syncMachineSelectors();setTimeout(afterRebuild,700);setTimeout(syncMachineSelectors,1500);setInterval(syncMachineSelectors,2000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();if(window.MutationObserver)new MutationObserver(function(){setTimeout(syncMachineSelectors,20)}).observe(document.documentElement,{childList:true,subtree:true})
})();
/* ACROW: force store-added machines into the actual daily-production selection list */
(function(){
 function getAdded(){try{if(!window.store||!Array.isArray(store.machines))return [];return store.machines.map(function(m){var id=norm(m.number||m.code||m.id||m.machine||'');if(!id)return null;var name=norm(m.name||m.type||m.machineName||id)||id;return {id:id,name:name}}).filter(Boolean)}catch(e){return []}}
 function ensureMachines(){try{if(!Array.isArray(window.MACHINES))return false;var changed=false;getAdded().forEach(function(m){var hit=MACHINES.find(function(x){return norm(x.id)===m.id});if(hit){if(m.name&&(!hit.name||hit.name===m.id))hit.name=m.name;return}MACHINES.push({id:m.id,name:m.name,dept:'sorting',deptName:'منطقة الفرز',target:null});changed=true});return changed}catch(e){return false}}
 function refresh(){if(!ensureMachines())return;try{if(typeof window.renderMachineSelectList==='function')window.renderMachineSelectList()}catch(e){}}
 function boot(){refresh();setTimeout(refresh,300);setTimeout(refresh,800);setTimeout(refresh,1500);setInterval(refresh,2000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot()
})();
/* ACROW: directly add custom machines to the daily-production checkbox modal */
(function(){
 function collect(){
  var out=[],seen={};
  function add(m,key){
   if(!m)return;
   if(typeof m==='string')m={id:m,name:m};
   if(typeof m!=='object')return;
   var id=norm(m.number||m.code||m.id||m.machine||key||'');
   if(!id||seen[id])return;
   var name=norm(m.name||m.type||m.machineName||m.title||id)||id;
   seen[id]=1;out.push({id:id,name:name});
  }
  try{if(window.store){['machines','machineCustom','customMachines'].forEach(function(k){var s=store[k];if(Array.isArray(s))s.forEach(function(v){add(v)});else if(s&&typeof s==='object')Object.keys(s).forEach(function(k){var v=s[k];if(v&&typeof v==='object'&&!v.id&&!v.number&&!v.code)v.id=k;add(v,k)})})}}catch(e){}
  return out;
 }
 function inject(){
  var box=document.getElementById('machineSelectList');if(!box)return;
  var data=collect();if(!data.length)return;
  var existing={};box.querySelectorAll('.fav-checkbox').forEach(function(c){existing[norm(c.getAttribute('data-machine')||c.value)]=1});
  var missing=data.filter(function(m){return !existing[m.id]});if(!missing.length)return;
  var group=document.createElement('div');group.className='fav-machine-custom-group';
  var title=document.createElement('div');title.className='fav-group-title';title.textContent='الماكينات المضافة';group.appendChild(title);
  missing.forEach(function(m){
   var label=document.createElement('label');label.className='fav-checkbox-row';
   var cb=document.createElement('input');cb.type='checkbox';cb.className='fav-checkbox';cb.setAttribute('data-machine',m.id);cb.value=m.id;
   try{if(window.store&&Array.isArray(store.favorites)&&store.favorites.indexOf(m.id)>=0)cb.checked=true}catch(e){}
   label.appendChild(cb);label.appendChild(document.createTextNode(' '+m.id+' — '+m.name));group.appendChild(label);
  });
  box.appendChild(group);
 }
 function boot(){inject();setTimeout(inject,100);setTimeout(inject,300);setTimeout(inject,700);setTimeout(inject,1500);setInterval(inject,2000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 if(window.MutationObserver)new MutationObserver(function(){setTimeout(inject,30)}).observe(document.documentElement,{childList:true,subtree:true});
})();
})();