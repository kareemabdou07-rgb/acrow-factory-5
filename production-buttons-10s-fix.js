/* ACROW Factory 5 — v227: make the five fixed machines real production entries */
(function(){
'use strict';
var EXTRA=[
 {id:'2',name:'مكبس فريم كونكتور'},
 {id:'8',name:'تليسكوب'},
 {id:'9',name:'شور برس'},
 {id:'10',name:'اسبيجوت'},
 {id:'forming-frame',name:'فريم تشكيل'}
];
var IDS=EXTRA.map(function(x){return String(x.id);});
function sid(v){return String(v==null?'':v).trim();}
function obj(m){return {id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null};}
function ensureDepartment(){try{if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&sid(d.id)==='daily';}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});}catch(e){}}
function ensureGlobal(){try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA.forEach(function(m){if(!MACHINES.some(function(x){return sid(x&&x.id)===sid(m.id)}))MACHINES.push(obj(m));});}catch(e){}}
function addContainer(c,m){var id=sid(m.id),o=obj(m);if(Array.isArray(c)){if(!c.some(function(x){return sid(x&&x.id)===id}))c.push(o);return;}if(c&&typeof c==='object'){if(!c[id])c[id]=o;}}
function ensureStoreMachines(){try{if(typeof store==='undefined'||!store)return;['machines','customMachines','machineCustom'].forEach(function(k){var v=store[k];if(v==null){store[k]=k==='machineCustom'?{}:[];v=store[k];}EXTRA.forEach(function(m){addContainer(v,m);});});if(!Array.isArray(store.favorites))store.favorites=[];IDS.forEach(function(id){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);});try{if(typeof saveStore==='function')saveStore();}catch(e){}}catch(e){}}
function hookBuild(){try{if(typeof window.buildMachines==='function'&&!window.buildMachines.__acrow227){var old=window.buildMachines;var w=function(){var a=old.apply(this,arguments)||[];EXTRA.forEach(function(m){if(!a.some(function(x){return sid(x&&x.id)===sid(m.id)}))a.push(obj(m));});return a;};w.__acrow227=true;window.buildMachines=w;}}catch(e){}}
function redraw(){ensureDepartment();ensureGlobal();ensureStoreMachines();hookBuild();try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}ensureGlobal();ensureStoreMachines();try{if(typeof window.render==='function')window.render();}catch(e){}try{if(typeof window.renderAll==='function')window.renderAll();}catch(e){}}
function boot(){redraw();[150,400,800,1500,3000,6000,10000].forEach(function(t){setTimeout(redraw,t);});setInterval(function(){ensureDepartment();ensureGlobal();ensureStoreMachines();},1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();