/* ACROW Factory 5 — v226: force the five daily-production machines into the real production renderer */
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
function ensureDepartment(){
 try{
  if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&!DEPARTMENTS.some(function(d){return d&&sid(d.id)==='daily'})){
   DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
  }
 }catch(e){}
}
function ensureFavorites(){
 try{
  if(typeof store==='undefined'||!store)return;
  if(!Array.isArray(store.favorites))store.favorites=[];
  IDS.forEach(function(id){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);});
 }catch(e){}
}
function extraObjects(){return EXTRA.map(function(m){return {id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null};});}
function patchBuildMachines(){
 try{
  if(typeof window.buildMachines!=='function'||window.buildMachines.__acrow226)return;
  var original=window.buildMachines;
  var wrapped=function(){
   var arr=original.apply(this,arguments)||[];
   EXTRA.forEach(function(m){
    var found=arr.some(function(x){return sid(x&&x.id)===sid(m.id);});
    if(!found)arr.push({id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});
   });
   return arr;
  };
  wrapped.__acrow226=true;
  window.buildMachines=wrapped;
 }catch(e){}
}
function ensureCustomStore(){
 try{
  if(typeof store==='undefined'||!store)return;
  if(!store.machineCustom||typeof store.machineCustom!=='object'||Array.isArray(store.machineCustom))store.machineCustom={};
  EXTRA.forEach(function(m){
   var old=store.machineCustom[m.id]||{};
   store.machineCustom[m.id]=Object.assign({},old,{id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});
  });
  ensureFavorites();
  try{if(typeof saveStore==='function')saveStore();}catch(e){}
 }catch(e){}
}
function rebuildAndRender(){
 ensureDepartment();
 patchBuildMachines();
 ensureCustomStore();
 try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}
 /* rebuildMachines may have been defined before our wrapper; verify the five are actually present. */
 try{
  if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES)){
   EXTRA.forEach(function(m){
    if(!MACHINES.some(function(x){return sid(x&&x.id)===sid(m.id)}))MACHINES.push({id:m.id,name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null});
   });
  }
 }catch(e){}
 ensureFavorites();
 try{if(typeof window.render==='function')window.render();}catch(e){}
 try{if(typeof window.renderMachineSelectList==='function')window.renderMachineSelectList();}catch(e){}
}
function boot(){
 rebuildAndRender();
 [100,300,700,1500,3000,6000,10000].forEach(function(t){setTimeout(rebuildAndRender,t);});
 /* Firebase/realtime or other legacy code can rebuild MACHINES later; keep the five real. */
 setInterval(function(){
  try{
   ensureDepartment();patchBuildMachines();ensureCustomStore();
   var missing=false;
   if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))IDS.forEach(function(id){if(!MACHINES.some(function(x){return sid(x&&x.id)===id;}))missing=true;});
   if(missing){try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}try{if(typeof render==='function')render();}catch(e){}}
  }catch(e){}
 },1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
