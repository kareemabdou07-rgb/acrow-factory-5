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
 document.querySelectorAll('button,a').forEach(function(el){
   var t=(el.textContent||el.getAttribute('aria-label')||el.title||'').trim();
   if(t&&/الخطة|طباعة التقارير|الصيانة|تعديل|الإعدادات|اعدادات|إعدادات/.test(t)){
     el.classList.add('acrow-settings-stable');
     var p=el.parentElement;if(p&&p.children.length<=12)p.classList.add('acrow-settings-stable');
   }
 });
}
var productionLock=null;
function releaseProductionLock(){if(!productionLock)return;var v=productionLock.vv;if(v){v.removeEventListener('resize',productionLock.keep);v.removeEventListener('scroll',productionLock.keep);}window.removeEventListener('resize',productionLock.keep);window.removeEventListener('scroll',productionLock.keep);productionLock=null;}
function lockProductionInput(inp){releaseProductionLock();var y=window.scrollY||window.pageYOffset||0,x=window.scrollX||0,vv=window.visualViewport;var keep=function(){if(!document.body.contains(inp)||document.activeElement!==inp){releaseProductionLock();return;}if(Math.abs((window.scrollY||0)-y)>1||Math.abs((window.scrollX||0)-x)>1)window.scrollTo(x,y);};productionLock={vv:vv,keep:keep,y:y,x:x};if(vv){vv.addEventListener('resize',keep,{passive:true});vv.addEventListener('scroll',keep,{passive:true});}window.addEventListener('resize',keep,{passive:true});window.addEventListener('scroll',keep,{passive:true});requestAnimationFrame(keep);setTimeout(keep,50);setTimeout(keep,150);setTimeout(keep,300);setTimeout(keep,600);}
function bindProductionInputs(){addStyle();document.querySelectorAll('.actual-input').forEach(function(inp){if(inp.dataset.acrowStableBound==='1')return;inp.dataset.acrowStableBound='1';inp.addEventListener('focus',function(){lockProductionInput(inp);},false);inp.addEventListener('blur',function(){setTimeout(releaseProductionLock,80);},false);});}
function boot(){mark();bindProductionInputs();[50,200,500,1000,2000].forEach(function(t){setTimeout(mark,t);setTimeout(bindProductionInputs,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){mark();bindProductionInputs();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});

/* v215: monthly-plan machines are part of the real machine list.
   Wrap rebuildMachines so Firebase/render cycles cannot remove them. */
(function(){
  function id(v){return String(v==null?'':v).trim();}
  function ensurePlanMachines(){
    try{
      if(typeof store==='undefined'||!store)return;
      if(!store.settings)store.settings={};
      if(!Array.isArray(store.settings.planMachineIds))store.settings.planMachineIds=[];
      if(!store.machineCustom||typeof store.machineCustom!=='object')store.machineCustom={};
      if(!store.machineDisabled||typeof store.machineDisabled!=='object')store.machineDisabled={};
      if(typeof MACHINES==='undefined'||!Array.isArray(MACHINES))return;
      var ids=store.settings.planMachineIds.map(id).filter(Boolean);
      ids.forEach(function(mid){
        var exists=MACHINES.some(function(m){return id(m&&m.id)===mid;});
        if(exists)return;
        var c=store.machineCustom[mid];
        if(!c){
          var base=MACHINES.find(function(m){return id(m&&m.id)===mid;});
          c=base?Object.assign({},base,{id:mid}):null;
        }
        if(!c){
          var dept=(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&DEPARTMENTS.length)?DEPARTMENTS[0]:{id:'production',name:'الإنتاج'};
          c={id:mid,name:'ماكينة '+mid,dept:dept.id,deptName:dept.name||dept.id,target:null};
          store.machineCustom[mid]=c;
        }
        MACHINES.push(Object.assign({},c,{id:mid,disabled:false}));
      });
      /* If a plan machine is marked disabled by an old state, it must still be selectable because it is in the monthly plan. */
      MACHINES=MACHINES.filter(function(m,i,a){return a.findIndex(function(x){return id(x&&x.id)===id(m&&m.id);})===i;});
    }catch(e){console.error('ACROW v215 ensure plan machines',e);}
  }
  function install(){
    if(typeof rebuildMachines!=='function'||rebuildMachines.__acrowV215)return;
    var original=rebuildMachines;
    function wrapped(){original.apply(this,arguments);ensurePlanMachines();}
    wrapped.__acrowV215=true;
    window.rebuildMachines=wrapped;
    try{rebuildMachines();}catch(e){}
    setTimeout(ensurePlanMachines,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(install,200);});else setTimeout(install,200);
})();
})();