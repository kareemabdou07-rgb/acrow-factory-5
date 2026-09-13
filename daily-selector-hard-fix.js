/* ACROW Factory 5 — v219: hard-lock daily machine selection + five daily production machines */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
var EXTRA_DAILY=[
 {id:'2',name:'مكبس فريم كونكتور',dept:'daily'},
 {id:'8',name:'تليسكوب',dept:'daily'},
 {id:'9',name:'شور برس',dept:'daily'},
 {id:'10',name:'اسبيجوت',dept:'daily'},
 {id:'forming-frame',name:'فريم تشكيل',dept:'daily'}
];
function sid(v){return String(v==null?'':v).trim();}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):null;}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify((Array.isArray(a)?a:[]).map(sid).filter(Boolean)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function apply(a){if(typeof store==='undefined')return;store.favorites=(Array.isArray(a)?a:[]).map(sid).filter(Boolean);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function ensureDailyMachines(){try{
 if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily';}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA_DAILY.forEach(function(x){var i=MACHINES.findIndex(function(m){return sid(m&&m.id)===sid(x.id);});if(i<0)MACHINES.push({id:x.id,name:x.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});else{MACHINES[i].name=x.name;MACHINES[i].dept='daily';MACHINES[i].deptName='ماكينات إنتاج اليوم';}});
}catch(e){}}
function checkboxes(){var b=document.getElementById('machineSelectList');return b?Array.from(b.querySelectorAll('input[type="checkbox"][data-machine],input[type="checkbox"]')):[];}
function sync(){ensureDailyMachines();var a=selected();checkboxes().forEach(function(cb){var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(id)cb.checked=a.indexOf(id)>=0;});}
function forceBeforeRender(){ensureDailyMachines();var o=getOverride();if(o!==null)apply(o);}
function renderNow(){forceBeforeRender();try{if(typeof renderMachineSelectList==='function')renderMachineSelectList();}catch(e){}setTimeout(sync,0);setTimeout(sync,80);}
function bind(){if(window.__acrowDailyHardFix)return;window.__acrowDailyHardFix=true;
 document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));if(!id)return;var a=selected();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();setTimeout(sync,0);},true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;var a=[];if(t.id==='selectAllMachinesLink'){ensureDailyMachines();if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))a=MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);}setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();renderNow();},true);
 var oldRender=null;function hook(){ensureDailyMachines();if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow219)return;if(oldRender)return;oldRender=window.renderMachineSelectList;var wrapped=function(){forceBeforeRender();var r=oldRender.apply(this,arguments);setTimeout(sync,0);return r;};wrapped.__acrow219=true;window.renderMachineSelectList=wrapped;}
 function hookRebuild(){try{if(typeof window.rebuildMachines==='function'&&!window.rebuildMachines.__acrow219){var old=window.rebuildMachines;var wrapped=function(){var r=old.apply(this,arguments);ensureDailyMachines();return r;};wrapped.__acrow219=true;window.rebuildMachines=wrapped;}}catch(e){}}
 function boot(){hookRebuild();hook();forceBeforeRender();sync();[100,300,700,1500,2500].forEach(function(t){setTimeout(function(){hookRebuild();hook();forceBeforeRender();sync();},t);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();bind();setInterval(function(){hookRebuild();hook();if(getOverride()!==null){forceBeforeRender();sync();}},700);
})();
