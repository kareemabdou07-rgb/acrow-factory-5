/* ACROW Factory 5 — production input stable mode
   Monthly-plan machines are available to the production selector but are NOT auto-selected. */
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
function start(){boot();ensurePlanMachines();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
