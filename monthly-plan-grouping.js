/* ACROW Factory 5 — monthly plan product grouping */
(function(){
'use strict';
var GROUPS=[
  {key:'ledger',name:'ليدجر',test:function(m){return ['1522','999','5004','5003','1521','998'].indexOf(String(m.id))>=0||/ليدجر/.test(String(m.name||''));}},
  {key:'shore',name:'شور بريس',test:function(m){return /شور\s*بريس|shore\s*brace/i.test(String(m.name||''));}},
  {key:'frame-cup',name:'فريم كوباية',test:function(m){return String(m.id)==='114'||/فريم\s*كوباية|فريم\s*كوبايه/.test(String(m.name||''));}},
  {key:'frame-forming',name:'فريم تشكيل',test:function(m){return String(m.id)==='forming-frame'||/فريم\s*تشكيل/.test(String(m.name||''));}},
  {key:'frame-connector',name:'فريم كونيكتور',test:function(m){return String(m.id)==='2'||/فريم\s*كونيكتور/.test(String(m.name||''));}},
  {key:'spigot',name:'أسبجوت',test:function(m){return String(m.id)==='10'||/أسبجوت|اسبجوت|spigot/i.test(String(m.name||''));}},
  {key:'sorting',name:'منطقة الفرز',test:function(m){return String(m.id)==='1502'||/منطقة\s*الفرز/.test(String(m.name||''));}},
  {key:'ring',name:'رينج فيرتكال',test:function(m){return ['997','996','5006'].indexOf(String(m.id))>=0||/رينج\s*فيرت|رينج\s*فيرتical|ring\s*vertical/i.test(String(m.name||''));}}
];
function groupFor(m){for(var i=0;i<GROUPS.length;i++)if(GROUPS[i].test(m))return GROUPS[i];return {key:'other',name:'باقي الماكينات',test:function(){return false;}};}
function groupedMachines(){
  var groups={};
  (typeof MACHINES!=='undefined'?MACHINES:[]).forEach(function(m){var g=groupFor(m);if(!groups[g.key])groups[g.key]={meta:g,machines:[]};groups[g.key].machines.push(m);});
  return groups;
}
function renderGroupedPlanMachineSelectList(){
  var listDiv=document.getElementById('planMachineSelectList'); if(!listDiv||typeof MACHINES==='undefined')return;
  var selected=new Set(Array.isArray(store.settings.planMachineIds)?store.settings.planMachineIds.map(String):[]);
  var groups=groupedMachines(),order=GROUPS.map(function(g){return g.key;});
  order.push('other');
  var html='';
  order.forEach(function(key){var block=groups[key];if(!block||!block.machines.length)return;
    html+='<div class="monthly-plan-product-group"><div class="monthly-plan-product-group-title">'+block.meta.name+'</div><div class="monthly-plan-product-group-machines">';
    block.machines.forEach(function(m){var id=String(m.id);html+='<label class="plan-machine-option"><input type="checkbox" class="plan-machine-checkbox" data-machine="'+id+'" '+(selected.has(id)?'checked':'')+'><span>'+machineDisplayName(m)+'</span></label>';});
    html+='</div></div>';
  });
  listDiv.innerHTML=html||'<div class="fault-empty">لا توجد ماكينات</div>';
  listDiv.querySelectorAll('.plan-machine-checkbox').forEach(function(cb){cb.addEventListener('change',function(){var ids=new Set(Array.isArray(store.settings.planMachineIds)?store.settings.planMachineIds.map(String):[]);if(cb.checked)ids.add(String(cb.dataset.machine));else ids.delete(String(cb.dataset.machine));store.settings.planMachineIds=Array.from(ids);});});
}
function productNameForMachine(m){return groupFor(m).name;}
function refreshGroupedProductTable(){
  var root=document.getElementById('planProductBreakdown');if(!root||typeof MACHINES==='undefined'||typeof store==='undefined')return;
  var selected=new Set(Array.isArray(store.settings.planMachineIds)?store.settings.planMachineIds.map(String):[]);
  if(!selected.size)return;
  var base=(typeof planDate==='function'?planDate():'');
  var dates=(typeof planDates==='function'&&base)?planDates('month',base):[];
  var totals={};
  MACHINES.forEach(function(m){var id=String(m.id);if(!selected.has(id))return;var g=groupFor(m);if(!totals[g.key])totals[g.key]={name:g.name,actual:0};
    Object.keys(store.records||{}).forEach(function(k){var parts=k.split('_'),rid=String(parts[parts.length-1]),date=parts.slice(0,parts.length-2).join('_');if(rid===id&&(!dates.length||dates.indexOf(date)>=0))totals[g.key].actual+=Number(store.records[k]&&store.records[k].actual)||0;});
  });
  var rows=Object.keys(totals).map(function(k){return totals[k];}).filter(function(x){return x.actual>0||true;});
  var oldTables=root.querySelectorAll('.report-table-wrap');if(!oldTables.length)return;
  var box=oldTables[oldTables.length-1];var tbody=box.querySelector('tbody');if(!tbody)return;
  var monthActual=rows.reduce(function(a,x){return a+x.actual;},0);
  tbody.innerHTML=rows.map(function(x){return '<tr><td>'+x.name+'</td><td>'+Math.round(x.actual)+' قطعة</td><td>'+(monthActual?Math.round(x.actual/monthActual*1000)/10:0)+'%</td></tr>';}).join('')||'<tr><td colspan="3">لا توجد بيانات إنتاج للمكن المختارة</td></tr>';
}
function install(){
  window.renderPlanMachineSelectList=renderGroupedPlanMachineSelectList;
  var old=window.renderPlanStatus;
  if(typeof old==='function'&&!old.__monthlyProductGrouping){
    var wrapped=function(){old.apply(this,arguments);setTimeout(function(){renderGroupedPlanMachineSelectList();refreshGroupedProductTable();},0);};
    wrapped.__monthlyProductGrouping=true;window.renderPlanStatus=wrapped;
  }
  renderGroupedPlanMachineSelectList();
}
var style=document.createElement('style');style.textContent='.monthly-plan-product-group{border:1px solid var(--border);border-radius:12px;background:var(--surface-2);padding:10px;margin-bottom:10px}.monthly-plan-product-group-title{font-size:14px;font-weight:900;color:var(--accent);padding:5px 8px 9px;border-bottom:1px solid var(--border);margin-bottom:5px}.monthly-plan-product-group-machines{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 12px}.monthly-plan-product-group .plan-machine-option{margin:0}.monthly-plan-product-group:last-child{margin-bottom:0}@media(max-width:700px){.monthly-plan-product-group-machines{grid-template-columns:1fr}}';document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
