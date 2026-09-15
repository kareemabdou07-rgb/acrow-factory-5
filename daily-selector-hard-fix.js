/* ACROW Factory 5 — v224: last five daily-production machines stay manually toggleable */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override';
var DISABLED_KEY='acrow_daily_five_disabled_v224';
var TOGGLE_IDS=['2','8','9','10','forming-frame'];
var EXTRA_DAILY=[
 {id:'2',name:'مكبس فريم كونكتور',dept:'daily'},
 {id:'8',name:'تليسكوب',dept:'daily'},
 {id:'9',name:'شور برس',dept:'daily'},
 {id:'10',name:'اسبيجوت',dept:'daily'},
 {id:'forming-frame',name:'فريم تشكيل',dept:'daily'}
];
function sid(v){return String(v==null?'':v).trim();}
function isToggle(id){return TOGGLE_IDS.indexOf(sid(id))>=0;}
function getDisabled(){try{var x=JSON.parse(localStorage.getItem(DISABLED_KEY)||'[]');return Array.isArray(x)?x.map(sid):[];}catch(e){return [];}}
function setDisabled(a){try{localStorage.setItem(DISABLED_KEY,JSON.stringify(Array.isArray(a)?a.map(sid):[]));}catch(e){}}
function clean(a){a=Array.isArray(a)?a.map(sid).filter(Boolean):[];var d=getDisabled();return a.filter(function(x){return !isToggle(x)||d.indexOf(x)<0;});}
function getOverride(){try{var x=localStorage.getItem(KEY);if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?clean(a):null;}catch(e){return null;}}
function setOverride(a){try{localStorage.setItem(KEY,JSON.stringify(clean(a)));}catch(e){}}
function selected(){var o=getOverride();if(o!==null)return o;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return clean(store.favorites);return [];}
function apply(a){a=clean(a);if(typeof store==='undefined')return;store.favorites=a.slice();try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function ensureDailyMachines(){try{
 if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&d.id==='daily';}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA_DAILY.forEach(function(x){var i=MACHINES.findIndex(function(m){return sid(m&&m.id)===x.id;});if(i<0)MACHINES.push({id:x.id,name:x.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});else{MACHINES[i].name=x.name;MACHINES[i].dept='daily';MACHINES[i].deptName='ماكينات إنتاج اليوم';}});
}catch(e){}}
function checkboxId(cb){var id=cb.getAttribute('data-machine');if(id)return sid(id);var row=cb.closest&&cb.closest('label[data-machine-id]');if(row)return sid(row.getAttribute('data-machine-id'));return '';}
function checkboxes(){var b=document.getElementById('machineSelectList');return b?Array.from(b.querySelectorAll('input[type="checkbox"]')):[];}
function enforce(){ensureDailyMachines();var a=selected();
 if(typeof store!=='undefined'&&Array.isArray(store.favorites)){var before=store.favorites.map(sid);var after=clean(before);if(JSON.stringify(before)!==JSON.stringify(after)){store.favorites=after;try{if(typeof saveStore==='function')saveStore();}catch(e){}}}
 checkboxes().forEach(function(cb){var id=checkboxId(cb);if(isToggle(id)){var want=a.indexOf(id)>=0;if(cb.checked!==want)cb.checked=want;}});
}
function rememberToggle(id,checked){id=sid(id);if(!isToggle(id))return;var d=getDisabled();if(checked)d=d.filter(function(x){return sid(x)!==id;});else if(d.indexOf(id)<0)d.push(id);setDisabled(d);}
function renderNow(){enforce();try{if(typeof renderMachineSelectList==='function')renderMachineSelectList();}catch(e){}setTimeout(enforce,0);setTimeout(enforce,50);setTimeout(enforce,150);}
function bind(){if(window.__acrowDailyHardFixV224)return;window.__acrowDailyHardFixV224=true;
 document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=checkboxId(cb);if(!id)return;var a=selected();
  if(isToggle(id)){rememberToggle(id,cb.checked);if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else{a=a.filter(function(x){return sid(x)!==id;});}setOverride(a);apply(a);setTimeout(enforce,0);setTimeout(enforce,100);e.stopImmediatePropagation();return;}
  if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setOverride(a);apply(a);setTimeout(enforce,0);
 },true);
 document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!t)return;var a=[];ensureDailyMachines();if(t.id==='selectAllMachinesLink'){setDisabled([]);if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))a=MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);}else{setDisabled(TOGGLE_IDS.slice());}setOverride(a);apply(a);e.preventDefault();e.stopImmediatePropagation();renderNow();},true);
 function hook(){try{if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow224)return;var old=window.renderMachineSelectList;var wrapped=function(){enforce();var r=old.apply(this,arguments);setTimeout(enforce,0);return r;};wrapped.__acrow224=true;window.renderMachineSelectList=wrapped;}catch(e){}}
 function boot(){hook();enforce();[50,100,200,400,700,1200,2000].forEach(function(t){setTimeout(function(){hook();enforce();},t);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();bind();
 try{var root=document.getElementById('machineSelectList');if(root&&window.MutationObserver){new MutationObserver(function(){enforce();}).observe(root,{childList:true,subtree:true});}}catch(e){}
 setInterval(function(){hook();enforce();},150);
})();
