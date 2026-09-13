/* ACROW Factory 5 — v225 fixed daily production machines */
(function(){
'use strict';
var EXTRA=[
 {id:'2',name:'مكبس فريم كونكتور'},
 {id:'8',name:'تليسكوب'},
 {id:'9',name:'شور برس'},
 {id:'10',name:'اسبيجوت'},
 {id:'forming-frame',name:'فريم تشكيل'}
];
var IDS=EXTRA.map(function(x){return x.id;});
function sid(v){return String(v==null?'':v).trim();}
function addArray(a,m){if(!Array.isArray(a))return;if(!a.some(function(x){return sid(x&&x.id||x&&x.machineId||x&&x.number)===m.id}))a.push({id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});}
function ensureGlobals(){try{
 if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&sid(d.id)==='daily'}))DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA.forEach(function(m){var x=MACHINES.find(function(v){return sid(v&&v.id)===m.id;});if(!x)MACHINES.push({id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});else{x.name=m.name;x.dept='daily';x.deptName='ماكينات إنتاج اليوم';}});
}catch(e){}}
function ensureStore(){try{if(typeof store==='undefined'||!store)return;
 EXTRA.forEach(function(m){
  ['machines','machineCustom','customMachines'].forEach(function(k){var v=store[k];if(Array.isArray(v)){addArray(v,m);}else if(v&&typeof v==='object'){if(!Object.keys(v).some(function(k2){var x=v[k2];return sid(x&&x.id||x&&x.machineId||k2)===m.id}))v[m.id]={id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null};}});
  if(!Array.isArray(store.favorites))store.favorites=[];if(store.favorites.map(sid).indexOf(m.id)<0)store.favorites.push(m.id);
 });
 try{if(typeof saveStore==='function')saveStore();}catch(e){}
}catch(e){}}
function ensure(){ensureGlobals();ensureStore();}
function render(){ensure();try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}try{if(typeof window.renderAll==='function')window.renderAll();}catch(e){}try{if(typeof window.renderMachineSelectList==='function')window.renderMachineSelectList();}catch(e){}}
function boot(){render();[200,700,1500,3000,6000].forEach(function(t){setTimeout(render,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();