/* ACROW Factory 5 — v228: lock the five daily machines into selector + production cards */
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
function obj(m){return {id:String(m.id),name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null};}
function ensureDepartment(){try{if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)){
 var d=DEPARTMENTS.find(function(x){return x&&sid(x.id)==='daily'});
 if(!d)DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 else {d.name='ماكينات إنتاج اليوم';d.count=5;}
}}catch(e){}}
function ensureGlobal(){try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA.forEach(function(m){
 var found=MACHINES.find(function(x){return sid(x&&x.id)===sid(m.id)});
 if(!found)MACHINES.push(obj(m));
 else {found.id=String(m.id);found.name=m.name;found.dept='daily';found.deptName='ماكينات إنتاج اليوم';if(found.target===undefined)found.target=null;}
});}catch(e){}}
function addContainer(c,m){var id=sid(m.id),o=obj(m);if(Array.isArray(c)){
 var found=c.find(function(x){return sid(x&&x.id)===id});
 if(!found)c.push(o);else{found.id=id;found.name=m.name;found.dept='daily';found.deptName='ماكينات إنتاج اليوم';}
 return;
}if(c&&typeof c==='object'){if(!c[id])c[id]=o;else{c[id].id=id;c[id].name=m.name;c[id].dept='daily';c[id].deptName='ماكينات إنتاج اليوم';}}}
function ensureStoreMachines(){try{if(typeof store==='undefined'||!store)return;
 ['machines','customMachines','machineCustom'].forEach(function(k){var v=store[k];if(v==null){store[k]=k==='machineCustom'?{}:[];v=store[k];}EXTRA.forEach(function(m){addContainer(v,m);});});
 if(!Array.isArray(store.favorites))store.favorites=[];
 IDS.forEach(function(id){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);});
 try{if(typeof saveStore==='function')saveStore();}catch(e){}
}catch(e){}}
function ensureAll(){ensureDepartment();ensureGlobal();ensureStoreMachines();}
function hook(name){try{if(typeof window[name]!=='function'||window[name]['__acrow228_'+name])return;var old=window[name];var w=function(){ensureAll();var r=old.apply(this,arguments);ensureAll();return r;};w['__acrow228_'+name]=true;window[name]=w;}catch(e){}}
function hookBuildMachines(){try{if(typeof window.buildMachines==='function'&&!window.buildMachines.__acrow228){var old=window.buildMachines;var w=function(){var a=old.apply(this,arguments)||[];EXTRA.forEach(function(m){var f=a.find(function(x){return sid(x&&x.id)===sid(m.id)});if(!f)a.push(obj(m));else{f.id=String(m.id);f.name=m.name;f.dept='daily';f.deptName='ماكينات إنتاج اليوم';}});return a;};w.__acrow228=true;window.buildMachines=w;}}catch(e){}}
function redraw(){ensureAll();hookBuildMachines();hook('rebuildMachines');hook('renderMachineSelectList');hook('render');hook('renderAll');try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}ensureAll();try{if(typeof window.renderMachineSelectList==='function')window.renderMachineSelectList();}catch(e){}try{if(typeof window.render==='function')window.render();}catch(e){}}
function boot(){redraw();[100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(redraw,t);});setInterval(function(){ensureAll();hookBuildMachines();hook('rebuildMachines');hook('renderMachineSelectList');hook('render');hook('renderAll');},1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — FINAL: put efficiency-reason button directly under daily produced-machines selector */
(function(){
'use strict';
function place(){
  var b=document.getElementById('acrowReasonBtn');
  if(!b)return;
  var a=document.getElementById('selectMachinesBtn');
  if(!a){
    var all=Array.from(document.querySelectorAll('button'));
    a=all.find(function(x){return /اختيار\s*الماكينات\s*المنتجة\s*اليوم/.test((x.textContent||'').replace(/\s+/g,' ').trim());});
  }
  if(!a)return;
  if(a.nextElementSibling!==b){
    try{a.insertAdjacentElement('afterend',b);}catch(e){}
  }
  b.style.setProperty('display','flex','important');
  b.style.setProperty('width','100%','important');
  b.style.setProperty('margin-top','0','important');
  b.style.setProperty('order','2','important');
}
function boot(){
  place();
  [100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(place,t);});
  if(window.MutationObserver)new MutationObserver(function(){place();}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();