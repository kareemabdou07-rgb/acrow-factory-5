/* ACROW Factory 5 — daily selector hard fix + current machine list sync */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):[];}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}

/* Keep the daily selector on the same live machine source used by the plan/settings.
   Never change the saved daily selection while rebuilding the machine list. */
function syncMachineSource(){
  try{
    if(typeof window.MACHINES==='undefined'||!Array.isArray(window.MACHINES))return;
    var map={}, order=[];
    function put(id,name,extra){
      id=sid(id); if(!id)return;
      if(!map[id]){map[id]={id:id,name:name||id};order.push(id);}
      if(name)map[id].name=String(name);
      if(extra)for(var k in extra)if(extra[k]!==undefined&&extra[k]!==null)map[id][k]=extra[k];
    }
    if(typeof store!=='undefined'&&Array.isArray(store.machines))store.machines.forEach(function(m){
      put(m&& (m.id||m.number||m.code||m.machine), m&&(m.name||m.type||m.machineName), m||{});
    });
    if(typeof store!=='undefined'&&store.machineCustom&&typeof store.machineCustom==='object')Object.keys(store.machineCustom).forEach(function(k){
      var m=store.machineCustom[k]||{}; put(m.id||k,m.name||m.type||m.machineName,m);
    });
    if(Array.isArray(window.MERGED_MACHINES))window.MERGED_MACHINES.forEach(function(m){put(m&&m[0],m&&m[1]);});
    window.MACHINES.forEach(function(m){put(m&&m.id,m&&m.name,m||{});});
    var out=order.map(function(id){return map[id];}).filter(Boolean);
    if(out.length){window.MACHINES.splice(0,window.MACHINES.length);out.forEach(function(m){window.MACHINES.push(m);});}
  }catch(e){}
}
function checkboxes(){var b=document.getElementById('machineSelectList');return b?Array.from(b.querySelectorAll('input[type="checkbox"][data-machine],input[type="checkbox"]')):[];}
function sync(){var a=selected();checkboxes().forEach(function(cb){var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(id)cb.checked=a.indexOf(id)>=0;});}
function forceBeforeRender(){syncMachineSource();var o=getOverride();if(o!==null)apply(o);}
function renderNow(){forceBeforeRender();try{if(typeof renderMachineSelectList==='function')renderMachineSelectList();}catch(e){}setTimeout(sync,0);setTimeout(sync,80);}
function bind(){
 if(window.__acrowDailyHardFix)return;
 window.__acrowDailyHardFix=true;
 document.addEventListener('change',function(e){
   var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;
   var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(!id)return;
   var a=selected();
   if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});
   setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();setTimeout(sync,0);
 },true);
 document.addEventListener('click',function(e){
   var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;
   var a=[];
   if(t.id==='selectAllMachinesLink'){
     syncMachineSource();
     if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))a=MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);
   }
   setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();renderNow();
 },true);
 var oldRender=null;
 function hook(){
   if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrowDailyUnified)return;
   if(oldRender)return;
   oldRender=window.renderMachineSelectList;
   var wrapped=function(){forceBeforeRender();var r=oldRender.apply(this,arguments);setTimeout(sync,0);return r;};
   wrapped.__acrowDailyUnified=true;window.renderMachineSelectList=wrapped;
 }
 function boot(){
   hook();forceBeforeRender();sync();
   [100,300,700,1500,2500].forEach(function(t){setTimeout(function(){hook();forceBeforeRender();sync();},t);});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 setInterval(function(){hook();if(getOverride()!==null){forceBeforeRender();sync();}},700);
})();
