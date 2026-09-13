/* ACROW Factory 5 — daily selector linked to monthly-plan machines, without touching the production input layout */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):[];}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function add(map,order,m){if(!m)return;var id=sid(m.id||m.number||m.code||m.machine);if(!id)return;var name=String(m.name||m.type||m.machineName||('ماكينة '+id));if(!map[id]){map[id]=Object.assign({},m,{id:id,name:name});order.push(id);}else if(name&&(!map[id].name||map[id].name==='ماكينة '+id))map[id].name=name;}
function addId(map,order,id){id=sid(id);if(!id)return;var m=null;try{if(typeof store!=='undefined'&&store.machineCustom&&store.machineCustom[id])m=Object.assign({},store.machineCustom[id],{id:id});}catch(e){}if(!m)try{if(typeof store!=='undefined'&&Array.isArray(store.machines)){var x=store.machines.find(function(v){return sid(v&&(v.id||v.number||v.code||v.machine))===id;});if(x)m=Object.assign({},x,{id:id});}}catch(e){}add(map,order,m||{id:id,name:'ماكينة '+id});}
function planIds(){var out=[];function addOne(v){if(typeof v==='object'&&v){v=v.id||v.number||v.code||v.machine;}v=sid(v);if(v&&out.indexOf(v)<0)out.push(v);}try{var st=(typeof store!=='undefined'&&store.settings)||{};['planMachineIds','planStatusMachineIds','monthlyPlanMachineIds','monthlyPlanMachines','planMachines'].forEach(function(k){var v=st[k];if(Array.isArray(v))v.forEach(addOne);else if(v&&typeof v==='object')Object.keys(v).forEach(addOne);});}catch(e){}return out;}
function ensurePlanMachines(){try{if(typeof window.MACHINES==='undefined'||!Array.isArray(window.MACHINES))return;var ids=planIds();ids.forEach(function(id){if(window.MACHINES.some(function(m){return sid(m&&m.id)===id;}))return;var obj=null;try{if(store.machineCustom&&store.machineCustom[id])obj=Object.assign({},store.machineCustom[id]);}catch(e){}if(!obj&&Array.isArray(store.machines))obj=store.machines.find(function(m){return sid(m&&(m.id||m.number||m.code||m.machine))===id;});obj=obj||{};var deptId=obj.dept||((typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS[0])?DEPARTMENTS[0].id:'production');var deptName=obj.deptName||((typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS[0])?DEPARTMENTS[0].name:'الإنتاج');window.MACHINES.push(Object.assign({id:id,name:obj.name||obj.type||obj.machineName||('ماكينة '+id),dept:deptId,deptName:deptName,target:null,disabled:false},obj,{id:id,disabled:false}));});}catch(e){}}
function machineList(){
 var map={},order=[];
 try{
   ensurePlanMachines();
   if(Array.isArray(window.MACHINES))window.MACHINES.forEach(function(m){add(map,order,m);});
   if(typeof store!=='undefined'&&Array.isArray(store.machines))store.machines.forEach(function(m){add(map,order,m);});
   if(typeof store!=='undefined'&&store.machines&&typeof store.machines==='object')Object.keys(store.machines).forEach(function(k){var m=store.machines[k]||{};if(typeof m==='string')m={id:k,name:m};else m=Object.assign({},m,{id:m.id||k});add(map,order,m);});
   if(typeof store!=='undefined'&&store.machineCustom&&typeof store.machineCustom==='object')Object.keys(store.machineCustom).forEach(function(k){add(map,order,Object.assign({},store.machineCustom[k]||{},{id:k}));});
   planIds().forEach(function(id){addId(map,order,id);});
 }catch(e){}
 return order.map(function(id){return map[id];});
}
function syncDom(){
 ensurePlanMachines();
 var box=document.getElementById('machineSelectList');if(!box)return;
 var list=machineList();if(!list.length)return;
 var selectedNow=selected();var have={};
 Array.from(box.querySelectorAll('label[data-machine-id],.fav-checkbox-row[data-machine-id]')).forEach(function(row){var id=sid(row.getAttribute('data-machine-id'));if(!id)return;have[id]=1;var cb=row.querySelector('input[type="checkbox"]');if(cb){cb.setAttribute('data-machine',id);cb.checked=selectedNow.indexOf(id)>=0;}});
 var anchor=box.querySelector('.fav-group-title');
 list.forEach(function(m){var id=sid(m.id);if(!id||have[id])return;var row=document.createElement('label');row.className='fav-checkbox-row';row.setAttribute('data-machine-id',id);var cb=document.createElement('input');cb.type='checkbox';cb.setAttribute('data-machine',id);cb.checked=selectedNow.indexOf(id)>=0;var sp=document.createElement('span');sp.textContent=String(m.name||('ماكينة '+id))+' ('+id+')';row.appendChild(cb);row.appendChild(sp);if(anchor&&anchor.parentElement)anchor.parentElement.appendChild(row);else box.appendChild(row);});
}
function syncPlanToDaily(){var ids=planIds();if(!ids.length)return;var a=selected();var changed=false;ids.forEach(function(id){if(a.indexOf(id)<0){a.push(id);changed=true;}});if(changed){setOverride(a);apply(a);}syncDom();try{if(typeof window.render==='function')window.render();}catch(e){}}
function bindPlanSync(){if(window.__acrowPlanDailySyncBound)return;window.__acrowPlanDailySyncBound=true;document.addEventListener('change',function(e){var el=e.target;if(!el)return;if(el.matches&&el.matches('#planMachineSelectList input[type="checkbox"],#planStatusMachineSelect input[type="checkbox"]'))setTimeout(syncPlanToDaily,30);},true);document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#saveMonthlyPlanBtn'):null;if(t){setTimeout(syncPlanToDaily,50);setTimeout(syncPlanToDaily,300);}},true);}
function bind(){
 if(window.__acrowDailyStableBound)return;window.__acrowDailyStableBound=true;
 document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var row=cb.closest('label[data-machine-id]');var id=sid(cb.getAttribute('data-machine')||(row&&row.getAttribute('data-machine-id')));if(!id)return;var a=selected();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setOverride(a);apply(a);setTimeout(syncDom,0);},true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;e.preventDefault();e.stopImmediatePropagation();if(t.id==='clearAllMachinesLink'){setOverride([]);apply([]);syncDom();return;}var a=machineList().map(function(m){return sid(m.id);}).filter(Boolean);setOverride(a);apply(a);syncDom();},true);
}
function boot(){bind();bindPlanSync();syncDom();if(getOverride()===null)syncPlanToDaily();[150,400,800,1400,2200,3500].forEach(function(t){setTimeout(syncDom,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(syncDom,1000);
})();
