/* ACROW Factory 5 — production input stable mode
   Important: do not force focus or reopen the Android keyboard.
   Android controls the keyboard; the app must not fight it. */
(function(){
'use strict';
function boot(){
  var inputs=document.querySelectorAll('.actual-input');
  for(var i=0;i<inputs.length;i++){
    try{
      inputs[i].setAttribute('inputmode','numeric');
      inputs[i].setAttribute('autocomplete','off');
      inputs[i].setAttribute('enterkeyhint','done');
    }catch(e){}
  }
}
function sid(v){return String(v==null?'':v).trim();}
function planIds(){
  var out=[];
  function add(v){if(v&&typeof v==='object')v=v.id||v.number||v.code||v.machine;v=sid(v);if(v&&out.indexOf(v)<0)out.push(v);}
  try{var st=(window.store&&store.settings)||{};['planMachineIds','planStatusMachineIds','monthlyPlanMachineIds','monthlyPlanMachines','planMachines'].forEach(function(k){var v=st[k];if(Array.isArray(v))v.forEach(add);else if(v&&typeof v==='object')Object.keys(v).forEach(add);});}catch(e){}
  return out;
}
function ensurePlanMachines(){
  try{
    if(!Array.isArray(window.MACHINES))return;
    planIds().forEach(function(id){
      if(MACHINES.some(function(m){return sid(m&&m.id)===id;}))return;
      var obj=null;
      try{if(store.machineCustom&&store.machineCustom[id])obj=Object.assign({},store.machineCustom[id]);}catch(e){}
      if(!obj&&Array.isArray(store.machines))obj=store.machines.find(function(m){return sid(m&&(m.id||m.number||m.code||m.machine))===id;});
      obj=obj||{};
      var dept=(typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS.length)?DEPARTMENTS[0]:{id:'production',name:'الإنتاج'};
      MACHINES.push(Object.assign({id:id,name:obj.name||obj.type||obj.machineName||('ماكينة '+id),dept:obj.dept||dept.id,deptName:obj.deptName||dept.name,target:null,disabled:false},obj,{id:id,disabled:false}));
    });
  }catch(e){}
}
function selectedOverride(){try{var x=localStorage.getItem('acrow_daily_favorites_override');if(x===null)return null;var a=JSON.parse(x);return Array.isArray(a)?a.map(sid).filter(Boolean):null;}catch(e){return null;}}
function syncPlanToDaily(){
  if(!window.store)return;
  var ids=planIds();if(!ids.length)return;
  var current=Array.isArray(store.favorites)?store.favorites.map(sid):[];
  var changed=false;
  ids.forEach(function(id){if(current.indexOf(id)<0){current.push(id);changed=true;}});
  if(!changed)return;
  store.favorites=current;
  try{localStorage.setItem('acrow_daily_favorites_override',JSON.stringify(current));}catch(e){}
  try{if(typeof saveStore==='function')saveStore();}catch(e){}
  try{if(typeof render==='function')render();}catch(e){}
}
function repairDailySelector(){
  try{
    var box=document.getElementById('machineSelectList');if(!box)return;
    var ids=planIds();if(!ids.length)return;
    ids.forEach(function(id){
      if(box.querySelector('[data-machine-id="'+id.replace(/(["\\])/g,'\\$1')+'"]'))return;
      var m=Array.isArray(window.MACHINES)?MACHINES.find(function(x){return sid(x&&x.id)===id;}):null;
      var row=document.createElement('label');row.className='fav-checkbox-row';row.setAttribute('data-machine-id',id);
      var cb=document.createElement('input');cb.type='checkbox';cb.setAttribute('data-machine',id);cb.checked=Array.isArray(store.favorites)&&store.favorites.map(sid).indexOf(id)>=0;
      var sp=document.createElement('span');sp.textContent=(m&&m.name?m.name:'ماكينة '+id)+' ('+id+')';row.appendChild(cb);row.appendChild(sp);box.appendChild(row);
    });
  }catch(e){}
}
function bindPlanSync(){
  if(window.__acrowPlanDailySyncBound)return;
  window.__acrowPlanDailySyncBound=true;
  document.addEventListener('change',function(e){var el=e.target;if(!el||!el.matches)return;if(el.matches('#planMachineSelectList input[type="checkbox"],#planStatusMachineSelect input[type="checkbox"]'))setTimeout(function(){ensurePlanMachines();syncPlanToDaily();repairDailySelector();},50);},true);
  document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('#saveMonthlyPlanBtn'):null;if(t)setTimeout(function(){ensurePlanMachines();syncPlanToDaily();repairDailySelector();},80);},true);
}
function start(){boot();ensurePlanMachines();bindPlanSync();repairDailySelector();if(selectedOverride()===null)syncPlanToDaily();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
