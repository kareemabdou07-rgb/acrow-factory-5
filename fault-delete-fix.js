/* ACROW Factory 5 v68 — repair and delete fault buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV68)return;
window.__acrowFaultRepairDeleteV68=true;
var STYLE_ID='acrow-fault-repair-delete-v68';
function style(){if(document.getElementById(STYLE_ID))return;var s=document.createElement('style');s.id=STYLE_ID;s.textContent='.fault-item{position:relative!important;padding-left:52px!important}.fault-item .f-del{position:absolute!important;left:8px!important;top:50%;transform:translateY(-50%)!important;width:36px!important;height:36px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid #ff5f6d!important;border-radius:7px!important;background:#3a1c1c!important;color:#ff5f6d!important;font-size:12px!important;z-index:9999!important;cursor:pointer!important;pointer-events:auto!important;}';document.head.appendChild(s)}
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
})();

(function(){
'use strict';
function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim()}
function add(out,seen,m,key){if(m==null)return;if(typeof m==='string'||typeof m==='number')m={id:String(m),name:String(m)};if(typeof m!=='object')return;var id=clean(m.number||m.code||m.id||m.machine||key||'');if(!id||seen[id])return;var name=clean(m.name||m.type||m.machineName||m.title||id)||id;seen[id]=1;out.push({id:id,name:name})}
function collect(){var out=[],seen={};try{if(window.store){['machines','machineCustom','customMachines'].forEach(function(k){var v=store[k];if(Array.isArray(v))v.forEach(function(m){add(out,seen,m)});else if(v&&typeof v==='object')Object.keys(v).forEach(function(k2){add(out,seen,v[k2],k2)})})}}catch(e){}return out}
function syncGlobal(){var data=collect();if(!data.length)return;try{if(Array.isArray(window.MACHINES))data.forEach(function(m){var found=MACHINES.some(function(x){return clean(x&&x.id)===m.id});if(!found)MACHINES.push({id:m.id,name:m.name,dept:'sorting',deptName:'منطقة الفرز',target:null})})}catch(e){}}
function inject(){syncGlobal();var box=document.getElementById('machineSelectList');if(!box)return;var data=collect();if(!data.length)return;var existing={};box.querySelectorAll('.fav-checkbox').forEach(function(c){existing[clean(c.getAttribute('data-machine')||c.value)]=1});var missing=data.filter(function(m){return !existing[m.id]});if(!missing.length)return;var group=box.querySelector('.acrow-custom-machines-group');if(!group){group=document.createElement('div');group.className='acrow-custom-machines-group';var title=document.createElement('div');title.className='fav-group-title';title.textContent='الماكينات المضافة';group.appendChild(title);box.appendChild(group)}missing.forEach(function(m){var label=document.createElement('label');label.className='fav-checkbox-row';var cb=document.createElement('input');cb.type='checkbox';cb.className='fav-checkbox';cb.setAttribute('data-machine',m.id);cb.value=m.id;try{if(window.store&&Array.isArray(store.favorites)&&store.favorites.indexOf(m.id)>=0)cb.checked=true}catch(e){}label.appendChild(cb);label.appendChild(document.createTextNode(' '+m.id+' — '+m.name));group.appendChild(label)})}
function boot(){inject();setTimeout(inject,100);setTimeout(inject,300);setTimeout(inject,700);setTimeout(inject,1500);setTimeout(inject,3000);setInterval(inject,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();if(window.MutationObserver)new MutationObserver(function(){setTimeout(inject,40)}).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ACROW FIX: mirror machines visible in the monthly-plan selector into the daily-production chooser. */
(function(){
'use strict';
function txt(v){return String(v==null?'':v).replace(/\s+/g,' ').trim()}
function machineishText(s){return /ماكين|مكن|منشار|مثقاب|متقاب|مكبس|فارمه|فريم|لحام|تشكيل|تلسكوب|شور\s*بريس|Ring|Cup|Ledger|RSA/i.test(txt(s))}
function readPlanMachines(){
 var out=[],seen={};
 function add(id,name){id=txt(id);name=txt(name)||id;if(!id||seen[id])return;seen[id]=1;out.push({id:id,name:name})}
 try{
  document.querySelectorAll('select').forEach(function(sel){
   var meta=txt(sel.id+' '+sel.name+' '+sel.className+' '+sel.getAttribute('aria-label')+' '+sel.getAttribute('data-label'));
   if(!/خطة|plan|شهري|monthly/i.test(meta))return;
   Array.prototype.forEach.call(sel.options,function(o){var id=txt(o.value||o.getAttribute('data-machine')||o.textContent);var name=txt(o.textContent);if(id&&!/^اخت|اختر|select/i.test(name))add(id,name)});
  });
  document.querySelectorAll('input[type=checkbox],input[type=radio]').forEach(function(inp){
   var p=inp.closest('label,div');var meta=txt((inp.id||'')+' '+(inp.name||'')+' '+(inp.className||'')+' '+(p?p.textContent:''));
   if(!/خطة|plan|شهري|monthly/i.test(meta))return;
   var id=txt(inp.getAttribute('data-machine')||inp.value);var name=txt(p?p.textContent:'')||id;if(id)add(id,name);
  });
 }catch(e){}
 try{
  if(window.store){
   ['monthlyPlan','monthlyPlans','monthlyPlanMachines','planMachines','monthlyPlanData'].forEach(function(k){var v=store[k];if(Array.isArray(v))v.forEach(function(m){if(typeof m==='object')add(m.id||m.machineId||m.number||m.code,m.name||m.machineName||m.type);else add(m,machineishText(m)?m:'')});else if(v&&typeof v==='object'){Object.keys(v).forEach(function(k2){var m=v[k2];if(typeof m==='object')add(m.id||m.machineId||m.number||m.code||k2,m.name||m.machineName||m.type||k2);else add(k2,m)})}})
  }
 }catch(e){}
 return out;
}
function mergeIntoDaily(){
 var data=readPlanMachines();if(!data.length)return;
 try{if(Array.isArray(window.MACHINES))data.forEach(function(m){if(!MACHINES.some(function(x){return txt(x&&x.id)===m.id}))MACHINES.push({id:m.id,name:m.name,dept:'sorting',deptName:'منطقة الفرز',target:null})})}catch(e){}
 var box=document.getElementById('machineSelectList');if(!box)return;
 var existing={};box.querySelectorAll('.fav-checkbox').forEach(function(c){existing[txt(c.getAttribute('data-machine')||c.value)]=1});
 var group=box.querySelector('.acrow-plan-machines-group');
 if(!group){group=document.createElement('div');group.className='acrow-plan-machines-group';var title=document.createElement('div');title.className='fav-group-title';title.textContent='الماكينات المضافة';group.appendChild(title);box.appendChild(group)}
 data.forEach(function(m){if(existing[m.id])return;var label=document.createElement('label');label.className='fav-checkbox-row';var cb=document.createElement('input');cb.type='checkbox';cb.className='fav-checkbox';cb.setAttribute('data-machine',m.id);cb.value=m.id;label.appendChild(cb);label.appendChild(document.createTextNode(' '+m.id+' — '+m.name));group.appendChild(label);existing[m.id]=1})
}
function boot(){mergeIntoDaily();setTimeout(mergeIntoDaily,200);setTimeout(mergeIntoDaily,700);setTimeout(mergeIntoDaily,1500);setInterval(mergeIntoDaily,2000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){setTimeout(mergeIntoDaily,60)}).observe(document.documentElement,{childList:true,subtree:true});
})();