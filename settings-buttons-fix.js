/* ACROW Factory 5 — stable settings buttons + stable production input */
(function(){
'use strict';
var STYLE_ID='acrow-settings-buttons-stable-v1';
function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.acrow-settings-stable{position:relative!important;z-index:60!important;visibility:visible!important;opacity:1!important;transform:none!important;transition:none!important;animation:none!important;}
.acrow-settings-stable button,.acrow-settings-stable a{visibility:visible!important;opacity:1!important;transform:none!important;transition:none!important;animation:none!important;}
.machine-card{overflow-anchor:none!important;}
.actual-input{scroll-margin:0!important;}
`;
 document.head.appendChild(s);
}
function mark(){
 addStyle();
 var all=document.querySelectorAll('button,a');
 all.forEach(function(el){
   var t=(el.textContent||el.getAttribute('aria-label')||el.title||'').trim();
   if(!t)return;
   if(/الخطة|طباعة التقارير|الصيانة|تعديل|الإعدادات|اعدادات|إعدادات/.test(t)){
     el.classList.add('acrow-settings-stable');
     var p=el.parentElement;
     if(p && p.children.length<=12) p.classList.add('acrow-settings-stable');
   }
 });
}
var productionLock=null;
function releaseProductionLock(){
 if(!productionLock)return;
 var v=productionLock.vv;
 if(v){v.removeEventListener('resize',productionLock.keep);v.removeEventListener('scroll',productionLock.keep);}
 window.removeEventListener('resize',productionLock.keep);window.removeEventListener('scroll',productionLock.keep);productionLock=null;
}
function lockProductionInput(inp){
 releaseProductionLock();var y=window.scrollY||window.pageYOffset||0,x=window.scrollX||0,vv=window.visualViewport;
 var keep=function(){if(!document.body.contains(inp)||document.activeElement!==inp){releaseProductionLock();return;}if(Math.abs((window.scrollY||0)-y)>1||Math.abs((window.scrollX||0)-x)>1)window.scrollTo(x,y);};
 productionLock={vv:vv,keep:keep,y:y,x:x};
 if(vv){vv.addEventListener('resize',keep,{passive:true});vv.addEventListener('scroll',keep,{passive:true});}
 window.addEventListener('resize',keep,{passive:true});window.addEventListener('scroll',keep,{passive:true});requestAnimationFrame(keep);setTimeout(keep,50);setTimeout(keep,150);setTimeout(keep,300);setTimeout(keep,600);
}
function bindProductionInputs(){
 addStyle();document.querySelectorAll('.actual-input').forEach(function(inp){if(inp.dataset.acrowStableBound==='1')return;inp.dataset.acrowStableBound='1';inp.addEventListener('focus',function(){lockProductionInput(inp);},false);inp.addEventListener('blur',function(){setTimeout(releaseProductionLock,80);},false);});
}
function boot(){mark();bindProductionInputs();setTimeout(mark,50);setTimeout(bindProductionInputs,50);setTimeout(mark,200);setTimeout(bindProductionInputs,200);setTimeout(mark,500);setTimeout(bindProductionInputs,500);setTimeout(mark,1000);setTimeout(bindProductionInputs,1000);setTimeout(mark,2000);setTimeout(bindProductionInputs,2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){mark();bindProductionInputs();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});

/* v209: machine master-list bridge */
(function(){
  function id(v){return String(v==null?'':v).trim();}
  function sync(){
    try{
      if(typeof store==='undefined'||!store)return;
      if(!store.machineCustom||typeof store.machineCustom!=='object')store.machineCustom={};
      if(!store.machineDisabled||typeof store.machineDisabled!=='object')store.machineDisabled={};
      if(!store.settings)store.settings={};
      if(!Array.isArray(store.settings.planMachineIds))store.settings.planMachineIds=[];
      Object.keys(store.machineCustom).forEach(function(k){
        k=id(k); if(k&&!store.machineDisabled[k]&&store.settings.planMachineIds.indexOf(k)<0)store.settings.planMachineIds.push(k);
      });
      if(typeof rebuildMachines==='function')rebuildMachines();
    }catch(e){console.error('ACROW machine sync',e);}
  }
  function refresh(){
    sync();
    try{if(typeof renderMachineSelectList==='function'&&document.getElementById('machineSelectModal')?.classList.contains('open'))renderMachineSelectList();}catch(e){}
    try{if(typeof renderPlanMachineSelectList==='function')renderPlanMachineSelectList();}catch(e){}
    try{if(typeof renderPlanStatus==='function'&&document.getElementById('planStatusSection')?.style.display!=='none')renderPlanStatus();}catch(e){}
  }
  function boot(){refresh();[200,600,1200,2500].forEach(function(ms){setTimeout(refresh,ms);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.__acrowMachineMasterSync=refresh;
  setInterval(sync,1500);
})();

/* v211: keep every machine already present in the monthly plan visible in today's production selector.
   Do not hard-code machine numbers or names here. The monthly-plan list is the single source of truth. */
(function(){
  function id(v){return String(v==null?'':v).trim();}
  function ensure(){
    try{
      if(typeof store==='undefined'||!store)return false;
      if(!store.settings)store.settings={};
      if(!Array.isArray(store.settings.planMachineIds))store.settings.planMachineIds=[];
      if(!store.machineCustom||typeof store.machineCustom!=='object')store.machineCustom={};
      if(!store.machineDisabled||typeof store.machineDisabled!=='object')store.machineDisabled={};

      /* Preserve every ID already selected by the monthly plan. */
      var ids=store.settings.planMachineIds.map(id).filter(Boolean);
      var changed=false;
      ids.forEach(function(mid){
        if(!store.machineCustom[mid]){
          var base=Array.isArray(store.machines)?store.machines.find(function(m){return id(m&&((m.id||m.code||m.number||m.machine)))===mid;}):null;
          if(base){store.machineCustom[mid]=Object.assign({},base,{id:mid,code:base.code||mid});changed=true;}
        }
      });

      /* Also retain all custom machines in the plan list so a remote/local merge
         cannot make a newly-added machine disappear from the production selector. */
      Object.keys(store.machineCustom).forEach(function(k){
        var mid=id(k);
        if(mid&&!store.machineDisabled[mid]&&ids.indexOf(mid)<0){ids.push(mid);changed=true;}
      });
      store.settings.planMachineIds=Array.from(new Set(ids));

      if(typeof rebuildMachines==='function')rebuildMachines();
      try{if(typeof renderMachineSelectList==='function'&&document.getElementById('machineSelectModal')?.classList.contains('open'))renderMachineSelectList();}catch(e){}
      try{if(typeof renderPlanMachineSelectList==='function')renderPlanMachineSelectList();}catch(e){}
      try{if(typeof renderPlanStatus==='function'&&document.getElementById('planStatusSection')?.style.display!=='none')renderPlanStatus();}catch(e){}
      return changed;
    }catch(e){console.error('ACROW v211 machine sync',e);return false;}
  }
  function boot(){ensure();[300,1000,2000,4000].forEach(function(ms){setTimeout(ensure,ms);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  setInterval(ensure,2500);
})();
})();
