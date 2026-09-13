/* ACROW Factory 5 — daily selector stability fix
   IMPORTANT: never replace or clear window.MACHINES. The main app owns the complete list. */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):[];}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function machineList(){
 var list=[];
 try{
   if(Array.isArray(window.MACHINES)) list=window.MACHINES.slice();
   if(!list.length&&typeof store!=='undefined'&&Array.isArray(store.machines)) list=store.machines.slice();
 }catch(e){}
 return list.filter(function(m){return m&&sid(m.id||m.number||m.code||m.machine);});
}
function syncDom(){
 var box=document.getElementById('machineSelectList');if(!box)return;
 var list=machineList();if(!list.length)return;
 var selectedNow=selected();
 var rows=Array.from(box.querySelectorAll('label[data-machine-id],.fav-checkbox-row[data-machine-id]'));
 rows.forEach(function(row){
   var id=sid(row.getAttribute('data-machine-id'));if(!id)return;
   var cb=row.querySelector('input[type="checkbox"]');if(cb){cb.setAttribute('data-machine',id);cb.checked=selectedNow.indexOf(id)>=0;}
 });
}
function bind(){
 if(window.__acrowDailyStableBound)return;window.__acrowDailyStableBound=true;
 document.addEventListener('change',function(e){
   var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;
   var row=cb.closest('label[data-machine-id]');var id=sid(cb.getAttribute('data-machine')||(row&&row.getAttribute('data-machine-id')));if(!id)return;
   var a=selected();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});
   setOverride(a);apply(a);setTimeout(syncDom,0);
 },true);
 document.addEventListener('click',function(e){
   var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;
   e.preventDefault();e.stopImmediatePropagation();
   if(t.id==='clearAllMachinesLink'){setOverride([]);apply([]);syncDom();return;}
   var a=machineList().map(function(m){return sid(m.id||m.number||m.code||m.machine);}).filter(Boolean);
   setOverride(a);apply(a);syncDom();
 },true);
}
function boot(){bind();syncDom();[150,400,800,1400,2200].forEach(function(t){setTimeout(syncDom,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(syncDom,1000);
})();
