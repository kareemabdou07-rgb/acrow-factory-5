/* ACROW Factory 5 — v217: hard-lock daily machine selection */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):[];}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function checkboxes(){var b=document.getElementById('machineSelectList');return b?Array.from(b.querySelectorAll('input[type="checkbox"][data-machine],input[type="checkbox"]')):[];}
function sync(){var a=selected();checkboxes().forEach(function(cb){var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(id)cb.checked=a.indexOf(id)>=0;});}
function forceBeforeRender(){var o=getOverride();if(o!==null)apply(o);}
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
     if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))a=MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);
   }
   setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();renderNow();
 },true);
 var oldRender=null;
 function hook(){
   if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow217)return;
   if(oldRender)return;
   oldRender=window.renderMachineSelectList;
   var wrapped=function(){forceBeforeRender();var r=oldRender.apply(this,arguments);setTimeout(sync,0);return r;};
   wrapped.__acrow217=true;window.renderMachineSelectList=wrapped;
 }
 function boot(){hook();forceBeforeRender();sync();[100,300,700,1500,2500].forEach(function(t){setTimeout(function(){hook();forceBeforeRender();sync();},t);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 setInterval(function(){hook();if(getOverride()!==null){forceBeforeRender();sync();}},700);
})();
