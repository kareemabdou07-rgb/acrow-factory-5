/* ACROW Factory 5 — stable daily selector using existing machine list */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):[];}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function add(map,order,m){if(!m)return;var id=sid(m.id||m.number||m.code||m.machine);if(!id)return;var name=String(m.name||m.type||m.machineName||('ماكينة '+id));if(!map[id]){map[id]=Object.assign({},m,{id:id,name:name});order.push(id);}else{if(name)map[id].name=name;for(var k in m)if(m[k]!==undefined&&m[k]!==null)map[id][k]=m[k];}}
function currentMachines(){
 var map={},order=[];
 try{
   /* IMPORTANT: keep the complete machine list already built by the app. */
   if(Array.isArray(window.MACHINES))window.MACHINES.forEach(function(m){add(map,order,m);});
   /* Then overlay the user's current edits without deleting existing machines. */
   if(typeof store!=='undefined'&&Array.isArray(store.machines))store.machines.forEach(function(m){add(map,order,m);});
   else if(typeof store!=='undefined'&&store.machines&&typeof store.machines==='object')Object.keys(store.machines).forEach(function(k){var m=store.machines[k]||{};if(typeof m==='string')m={id:k,name:m};else m=Object.assign({},m,{id:m.id||k});add(map,order,m);});
   if(typeof store!=='undefined'&&store.machineCustom&&typeof store.machineCustom==='object')Object.keys(store.machineCustom).forEach(function(k){var m=store.machineCustom[k]||{};add(map,order,Object.assign({},m,{id:m.id||k}));});
 }catch(e){}
 return order.map(function(id){return map[id];});
}
function syncWindowMachines(){
 var list=currentMachines();
 try{if(Array.isArray(window.MACHINES)){window.MACHINES.splice(0,window.MACHINES.length);list.forEach(function(m){window.MACHINES.push(m);});}}catch(e){}
 return list;
}
function rowId(row){return sid(row&&row.getAttribute('data-machine-id'))||sid(row&&row.querySelector('input')&&row.querySelector('input').getAttribute('data-machine'))||'';}
function syncDom(){
 var box=document.getElementById('machineSelectList');if(!box)return;
 var list=currentMachines();if(!list.length)return;
 var allowed={};list.forEach(function(m){allowed[sid(m.id)]=m;});
 var rows=Array.from(box.querySelectorAll('.fav-checkbox-row[data-machine-id],label[data-machine-id]'));
 /* Do NOT remove rows merely because a temporary store snapshot omitted them. */
 rows.forEach(function(row){var id=rowId(row);if(!id)return;var m=allowed[id];if(!m)return;var cb=row.querySelector('input[type="checkbox"]');if(cb)cb.setAttribute('data-machine',id);var spans=row.querySelectorAll('span');var label=spans.length?spans[spans.length-1]:null;if(label)label.textContent=m.name+' ('+id+')';});
 var have={};Array.from(box.querySelectorAll('[data-machine-id]')).forEach(function(r){var id=rowId(r);if(id)have[id]=1;});
 var anchor=box.querySelector('.fav-group-title');
 list.forEach(function(m){var id=sid(m.id);if(!id||have[id])return;var row=document.createElement('label');row.className='fav-checkbox-row';row.setAttribute('data-machine-id',id);var cb=document.createElement('input');cb.type='checkbox';cb.setAttribute('data-machine',id);var sp=document.createElement('span');sp.textContent=m.name+' ('+id+')';row.appendChild(cb);row.appendChild(sp);if(anchor&&anchor.parentElement)anchor.parentElement.appendChild(row);else box.appendChild(row);});
 var a=selected();box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(id)cb.checked=a.indexOf(id)>=0;});
}
function selectAll(){var list=currentMachines();var a=list.map(function(m){return sid(m.id);}).filter(Boolean);setOverride(a);apply(a);syncDom();}
function clearAll(){setOverride([]);apply([]);syncDom();}
function bind(){
 if(window.__acrowDailyAuthoritativeBound)return;window.__acrowDailyAuthoritativeBound=true;
 document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(!id)return;var a=selected();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setOverride(a);apply(a);e.stopImmediatePropagation();},true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;if(t.id==='selectAllMachinesLink')selectAll();else clearAll();e.preventDefault();e.stopImmediatePropagation();},true);
}
function boot(){bind();syncWindowMachines();syncDom();[100,300,700,1200,2000].forEach(function(t){setTimeout(function(){syncWindowMachines();syncDom();},t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(function(){syncWindowMachines();syncDom();},700);
})();
