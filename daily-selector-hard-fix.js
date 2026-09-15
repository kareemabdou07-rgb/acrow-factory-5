/* ACROW Factory 5 — v223: last five machines in daily-production selector are fully manual */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
var DISABLED_KEY='acrow_daily_five_disabled_v223';
var EXTRA_DAILY=[
 {id:'2',name:'مكبس فريم كونكتور',dept:'daily'},
 {id:'8',name:'تليسكوب',dept:'daily'},
 {id:'9',name:'شور برس',dept:'daily'},
 {id:'10',name:'اسبيجوت',dept:'daily'},
 {id:'forming-frame',name:'فريم تشكيل',dept:'daily'}
];
/* All five bottom machines are manual. None is forced back on. */
var FIXED_IDS=[];
var TOGGLE_IDS=['2','8','9','10','forming-frame'];
function sid(v){return String(v==null?'':v).trim();}
function getDisabled(){try{var x=JSON.parse(localStorage.getItem(DISABLED_KEY)||'[]');return Array.isArray(x)?x.map(sid):[];}catch(e){return [];}}
function setDisabled(a){try{localStorage.setItem(DISABLED_KEY,JSON.stringify(Array.isArray(a)?a.map(sid):[]));}catch(e){}}
function fixed(a){
 a=Array.isArray(a)?a.map(sid).filter(Boolean):[];
 var dis=getDisabled();
 TOGGLE_IDS.forEach(function(id){if(dis.indexOf(id)>=0)a=a.filter(function(x){return sid(x)!==id;});});
 return a;
}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?fixed(a):null;}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify(fixed(a)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return fixed(store.favorites);return fixed([]);}
function apply(a){if(typeof store==='undefined')return;store.favorites=fixed(a);try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function ensureDailyMachines(){try{
 if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily';}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA_DAILY.forEach(function(x){var i=MACHINES.findIndex(function(m){return sid(m&&m.id)===sid(x.id);});if(i<0)MACHINES.push({id:x.id,name:x.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});else{MACHINES[i].name=x.name;MACHINES[i].dept='daily';MACHINES[i].deptName='ماكينات إنتاج اليوم';}});
}catch(e){}}
function checkboxes(){var b=document.getElementById('machineSelectList');return b?Array.from(b.querySelectorAll('input[type="checkbox"][data-machine],input[type="checkbox"]')):[];}
function checkboxId(cb){return sid(cb.getAttribute('data-machine')||((cb.closest('label')||{}).getAttribute&&cb.closest('label').getAttribute('data-machine-id')));}
function sync(){ensureDailyMachines();var a=selected();apply(a);checkboxes().forEach(function(cb){var id=checkboxId(cb);if(id)cb.checked=a.indexOf(id)>=0;});}
function forceBeforeRender(){ensureDailyMachines();var o=getOverride();if(o!==null)apply(o);else apply(selected());}
function rememberToggle(id,checked){if(TOGGLE_IDS.indexOf(id)<0)return;var d=getDisabled();if(checked)d=d.filter(function(x){return sid(x)!==id;});else if(d.indexOf(id)<0)d.push(id);setDisabled(d);}
function renderNow(){forceBeforeRender();try{if(typeof renderMachineSelectList==='function')renderMachineSelectList();}catch(e){}setTimeout(sync,0);setTimeout(sync,80);}
function bind(){if(window.__acrowDailyHardFix)return;window.__acrowDailyHardFix=true;
 document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=checkboxId(cb);if(!id)return;var a=selected();if(TOGGLE_IDS.indexOf(id)>=0){rememberToggle(id,cb.checked);if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else{a=a.filter(function(x){return sid(x)!==id;});}setOverride(a);apply(a);cb.checked=!!cb.checked;e.preventDefault();e.stopImmediatePropagation();setTimeout(sync,0);return;}if(FIXED_IDS.indexOf(id)>=0){cb.checked=true;setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();return;}if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();setTimeout(sync,0);},true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;var a=[];if(t.id==='selectAllMachinesLink'){ensureDailyMachines();setDisabled([]);if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))a=MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);}else{setDisabled(TOGGLE_IDS.slice());}setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();renderNow();},true);
 var oldRender=null;function hook(){ensureDailyMachines();if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow220)return;if(oldRender)return;oldRender=window.renderMachineSelectList;var wrapped=function(){forceBeforeRender();var r=oldRender.apply(this,arguments);setTimeout(sync,0);return r;};wrapped.__acrow220=true;window.renderMachineSelectList=wrapped;}
 function hookRebuild(){try{if(typeof window.rebuildMachines==='function'&&!window.rebuildMachines.__acrow220){var old=window.rebuildMachines;var wrapped=function(){var r=old.apply(this,arguments);ensureDailyMachines();return r;};wrapped.__acrow220=true;window.rebuildMachines=wrapped;}}catch(e){}}
 function boot(){hookRebuild();hook();forceBeforeRender();sync();[50,100,200,400,700,1200,2000].forEach(function(t){setTimeout(function(){hookRebuild();hook();forceBeforeRender();sync();},t);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();bind();setInterval(function(){hookRebuild();hook();forceBeforeRender();sync();},150);
})();
