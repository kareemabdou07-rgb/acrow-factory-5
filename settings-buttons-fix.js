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

/* v212: stabilize the monthly-plan -> today's-production machine list.
   IMPORTANT: do not repeatedly call rebuildMachines(). That rebuild loop was causing
   machines to appear, disappear, then appear again while Firebase/local state merged.
   The monthly-plan IDs remain the source of truth and are preserved without a timer. */
(function(){
  function id(v){return String(v==null?'':v).trim();}
  function stabilize(){
    try{
      if(typeof store==='undefined'||!store)return;
      if(!store.settings)store.settings={};
      if(!Array.isArray(store.settings.planMachineIds))store.settings.planMachineIds=[];
      if(!store.machineCustom||typeof store.machineCustom!=='object')store.machineCustom={};
      if(!store.machineDisabled||typeof store.machineDisabled!=='object')store.machineDisabled={};

      var ids=store.settings.planMachineIds.map(id).filter(Boolean);
      /* Keep custom machines represented in the plan list, but do not rebuild the
         application's master machine array on a repeating timer. */
      Object.keys(store.machineCustom).forEach(function(k){
        var mid=id(k);
        if(mid&&!store.machineDisabled[mid]&&ids.indexOf(mid)<0)ids.push(mid);
      });
      store.settings.planMachineIds=Array.from(new Set(ids));

      /* One controlled rebuild after Firebase/local state has settled. */
      if(typeof rebuildMachines==='function')rebuildMachines();
      setTimeout(function(){
        try{if(typeof renderMachineSelectList==='function'&&document.getElementById('machineSelectModal')?.classList.contains('open'))renderMachineSelectList();}catch(e){}
        try{if(typeof renderPlanMachineSelectList==='function')renderPlanMachineSelectList();}catch(e){}
        try{if(typeof renderPlanStatus==='function'&&document.getElementById('planStatusSection')?.style.display!=='none')renderPlanStatus();}catch(e){}
      },80);
    }catch(e){console.error('ACROW v212 machine stabilization',e);}
  }
  function boot(){setTimeout(stabilize,1800);setTimeout(stabilize,5000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
})();
