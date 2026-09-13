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

/* v217: preserve every machine source used by the app, especially machines
   created/selected from the monthly plan.  The original app's rebuild can
   recreate MACHINES from the default list, so we merge stored machines back
   in without changing the existing layout or production behavior. */
(function(){
  function sid(v){return String(v==null?'':v).trim();}
  function eachStoredMachine(fn){
    if(typeof store==='undefined'||!store)return;
    var seen={};
    function add(id,obj){
      id=sid(id); if(!id||seen[id])return; seen[id]=1; fn(id,obj||null);
    }
    if(store.machineCustom&&typeof store.machineCustom==='object'){
      Object.keys(store.machineCustom).forEach(function(k){add(k,store.machineCustom[k]);});
    }
    if(Array.isArray(store.machines)){
      store.machines.forEach(function(m){if(m&&typeof m==='object')add(m.id,m);});
    }else if(store.machines&&typeof store.machines==='object'){
      Object.keys(store.machines).forEach(function(k){add(k,store.machines[k]);});
    }
    var st=store.settings||{};
    if(Array.isArray(st.planMachineIds))st.planMachineIds.forEach(function(k){add(k,null);});
    if(Array.isArray(st.planStatusMachineIds))st.planStatusMachineIds.forEach(function(k){add(k,null);});
  }
  function fallbackMachine(mid,obj){
    var dept=(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)&&DEPARTMENTS.length)?DEPARTMENTS[0]:{id:'production',name:'الإنتاج'};
    return Object.assign({id:mid,name:'ماكينة '+mid,dept:dept.id,deptName:dept.name||dept.id,target:null,disabled:false},obj||{}, {id:mid,disabled:false});
  }
  function addStoredMachines(){
    try{
      if(typeof store==='undefined'||!store||typeof MACHINES==='undefined'||!Array.isArray(MACHINES))return;
      eachStoredMachine(function(mid,obj){
        var idx=MACHINES.findIndex(function(m){return sid(m&&m.id)===mid;});
        if(idx>=0){
          if(obj)MACHINES[idx]=Object.assign({},MACHINES[idx],obj,{id:mid,disabled:false});
          else MACHINES[idx].disabled=false;
        }else{
          MACHINES.push(fallbackMachine(mid,obj));
        }
      });
    }catch(e){console.error('ACROW v217 machine merge',e);}
  }
  function patchDailySelector(){
    try{
      var box=document.getElementById('machineSelectList');
      if(!box||typeof store==='undefined'||!store)return;
      addStoredMachines();
      var ids=[];
      eachStoredMachine(function(mid){ids.push(mid);});
      ids=Array.from(new Set(ids));
      ids.forEach(function(mid){
        var selector='[data-machine-id="'+(window.CSS&&CSS.escape?CSS.escape(mid):mid.replace(/(["\\])/g,'\\$1'))+'"]';
        if(box.querySelector(selector))return;
        var m=(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))?MACHINES.find(function(x){return sid(x&&x.id)===mid;}):null;
        if(!m)return;
        var row=document.createElement('label');
        row.className='fav-checkbox-row';
        row.setAttribute('data-machine-id',mid);
        var checked=Array.isArray(store.favorites)&&store.favorites.map(sid).includes(mid);
        row.innerHTML='<input type="checkbox" '+(checked?'checked':'')+' data-mid="'+mid.replace(/"/g,'&quot;')+'"><span>'+String(m.name||('ماكينة '+mid))+' <span style="opacity:.65">('+mid+')</span></span>';
        var cb=row.querySelector('input');
        cb.addEventListener('change',function(){
          if(!Array.isArray(store.favorites))store.favorites=[];
          if(this.checked){if(!store.favorites.map(sid).includes(mid))store.favorites.push(mid);}
          else store.favorites=store.favorites.filter(function(x){return sid(x)!==mid;});
          if(typeof saveStore==='function')saveStore();
          if(typeof render==='function')render();
        });
        var titles=box.querySelectorAll('.fav-group-title');
        var title=titles.length?titles[titles.length-1]:null;
        if(title&&title.parentElement)title.parentElement.appendChild(row);else box.appendChild(row);
      });
    }catch(e){console.error('ACROW v217 selector patch',e);}
  }
  function run(){addStoredMachines();patchDailySelector();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,300);});else setTimeout(run,300);
  setInterval(run,800);
})();
})();