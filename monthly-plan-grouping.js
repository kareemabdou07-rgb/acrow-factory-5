/* ACROW Factory 5 — monthly plan product grouping v2 */
(function(){
'use strict';
var GROUPS=[
 {key:'ledger',name:'ليدجر',test:function(m){return ['1522','999','5004','5003','1521','998'].indexOf(String(m.id))>=0||/ليدجر/i.test(String(m.name||''));}},
 {key:'shore',name:'شور بريس',test:function(m){return /شور\s*بريس|shore\s*brace/i.test(String(m.name||''))||String(m.id)==='9';}},
 {key:'frame-cup',name:'فريم كوباية',test:function(m){return String(m.id)==='114'||/فريم\s*كوباية|فريم\s*كوبايه/i.test(String(m.name||''));}},
 {key:'frame-forming',name:'فريم تشكيل',test:function(m){return String(m.id)==='forming-frame'||/فريم\s*تشكيل/i.test(String(m.name||''));}},
 {key:'frame-connector',name:'فريم كونيكتور',test:function(m){return String(m.id)==='2'||/فريم\s*كونيكتور/i.test(String(m.name||''));}},
 {key:'spigot',name:'أسبجوت',test:function(m){return String(m.id)==='10'||/أسبجوت|اسبجوت|spigot/i.test(String(m.name||''));}},
 {key:'sorting',name:'منطقة الفرز',test:function(m){return String(m.id)==='1502'||/منطقة\s*الفرز/i.test(String(m.name||''));}},
 {key:'ring',name:'رينج فيرتكال',test:function(m){return ['997','996','5006'].indexOf(String(m.id))>=0||/رينج\s*فيرت|ring\s*vertical/i.test(String(m.name||''));}}
];
function groupFor(m){for(var i=0;i<GROUPS.length;i++)if(GROUPS[i].test(m))return GROUPS[i];return {key:'other',name:'باقي الماكينات'};}
function selectedIds(){try{return new Set((store.settings&&Array.isArray(store.settings.planMachineIds)?store.settings.planMachineIds:[]).map(String));}catch(e){return new Set();}}
function actualFor(id,dates){var total=0;try{Object.keys(store.records||{}).forEach(function(k){var parts=k.split('_'),rid=String(parts[parts.length-1]);if(rid!==String(id))return;var date=parts.slice(0,parts.length-2).join('_');if(!dates.length||dates.indexOf(date)>=0)total+=Number(store.records[k]&&store.records[k].actual)||0;});}catch(e){}return total;}
function targetFor(m,days){try{var mc=(store.machineCustom||{})[String(m.id)]||{};var t=Number(mc.target!=null?mc.target:m.target)||0;return t*days;}catch(e){return 0;}}
function renderGroupedSelector(){
 var list=document.getElementById('planMachineSelectList');if(!list||typeof MACHINES==='undefined'||typeof store==='undefined')return;
 var sel=selectedIds(), groups={};MACHINES.forEach(function(m){var g=groupFor(m);if(!groups[g.key])groups[g.key]={meta:g,machines:[]};groups[g.key].machines.push(m);});
 var order=GROUPS.map(function(g){return g.key;});order.push('other');var html='';
 order.forEach(function(k){var b=groups[k];if(!b||!b.machines.length)return;html+='<div class="monthly-plan-product-group"><div class="monthly-plan-product-group-title">'+b.meta.name+'</div><div class="monthly-plan-product-group-machines">';b.machines.forEach(function(m){var id=String(m.id);html+='<label class="plan-machine-option"><input type="checkbox" class="plan-machine-checkbox" data-machine="'+id+'" '+(sel.has(id)?'checked':'')+'><span>'+machineDisplayName(m)+'</span></label>';});html+='</div></div>';});
 list.innerHTML=html||'<div class="fault-empty">لا توجد ماكينات</div>';
 list.querySelectorAll('.plan-machine-checkbox').forEach(function(cb){cb.addEventListener('change',function(){var ids=selectedIds();if(cb.checked)ids.add(String(cb.dataset.machine));else ids.delete(String(cb.dataset.machine));store.settings.planMachineIds=Array.from(ids);if(store.settings.planMachineIdsConfigured!==true)store.settings.planMachineIdsConfigured=true;if(typeof saveStore==='function')saveStore();renderGroupedPlanSummary();});});
}
function renderGroupedPlanSummary(){
 var sec=document.getElementById('planStatusSection');if(!sec||typeof MACHINES==='undefined'||typeof store==='undefined')return;
 var ids=selectedIds(),base=(typeof planDate==='function'?planDate():(document.getElementById('planDate')||{}).value||''),dates=(typeof planDates==='function'&&base?planDates('month',base):[]);
 var days=dates.length||30,groups={};
 MACHINES.forEach(function(m){var id=String(m.id);if(!ids.has(id))return;var g=groupFor(m);if(!groups[g.key])groups[g.key]={name:g.name,machines:[],target:0,actual:0};groups[g.key].machines.push(m);groups[g.key].target+=targetFor(m,days);groups[g.key].actual+=actualFor(id,dates);});
 var keys=GROUPS.map(function(g){return g.key;}).concat(['other']);
 var html='<div class="monthly-plan-grouped-summary"><div class="monthly-plan-grouped-summary-title">تجميع الخطة حسب المنتج</div><div class="monthly-plan-grouped-summary-grid">';
 var count=0;keys.forEach(function(k){var g=groups[k];if(!g)return;count++;var pct=g.target?(g.actual/g.target*100):0;var names=g.machines.map(function(m){return machineDisplayName(m);}).join(' — ');html+='<div class="monthly-plan-group-card"><div class="monthly-plan-group-card-title">'+g.name+'</div><div class="monthly-plan-group-card-machines">'+names+'</div><div class="monthly-plan-group-card-stats"><span>المستهدف <b>'+Math.round(g.target)+'</b></span><span>الإنتاج <b>'+Math.round(g.actual)+'</b></span><span>النسبة <b>'+Math.round(pct*10)/10+'%</b></span></div></div>';});
 html+='</div></div>';
 var old=sec.querySelector('.monthly-plan-grouped-summary');if(old)old.remove();if(count){var anchor=sec.querySelector('.plan-header')||sec.firstElementChild; if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(document.createRange().createContextualFragment(html),anchor);else sec.insertAdjacentHTML('afterbegin',html);}
}
function install(){
 window.renderPlanMachineSelectList=renderGroupedSelector;
 var old=window.renderPlanStatus;
 if(typeof old==='function'&&!old.__monthlyProductGrouping){var wrapped=function(){old.apply(this,arguments);setTimeout(function(){renderGroupedSelector();renderGroupedPlanSummary();},0);};wrapped.__monthlyProductGrouping=true;window.renderPlanStatus=wrapped;}
 renderGroupedSelector();renderGroupedPlanSummary();
}
var style=document.createElement('style');style.textContent='.monthly-plan-product-group{border:1px solid var(--border);border-radius:12px;background:var(--surface-2);padding:10px;margin-bottom:10px}.monthly-plan-product-group-title{font-size:14px;font-weight:900;color:var(--accent);padding:5px 8px 9px;border-bottom:1px solid var(--border);margin-bottom:5px}.monthly-plan-product-group-machines{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 12px}.monthly-plan-product-group .plan-machine-option{margin:0}.monthly-plan-grouped-summary{margin:14px 0 18px;padding:14px;border:1px solid var(--border);border-radius:14px;background:var(--surface)}.monthly-plan-grouped-summary-title{font-size:18px;font-weight:900;color:var(--accent);margin-bottom:12px}.monthly-plan-grouped-summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}.monthly-plan-group-card{border:1px solid var(--border);border-radius:11px;padding:12px;background:var(--surface-2)}.monthly-plan-group-card-title{font-size:15px;font-weight:900;color:#ffd54a;margin-bottom:6px}.monthly-plan-group-card-machines{font-size:11px;color:var(--text-dim);line-height:1.7;min-height:24px}.monthly-plan-group-card-stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;font-size:11px;color:var(--text-dim)}.monthly-plan-group-card-stats span{padding:5px 7px;border:1px solid var(--border);border-radius:7px}.monthly-plan-group-card-stats b{color:var(--text);font-family:var(--mono)}@media(max-width:700px){.monthly-plan-grouped-summary-grid{grid-template-columns:1fr}.monthly-plan-product-group-machines{grid-template-columns:1fr}}';document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
setInterval(function(){if(document.getElementById('planStatusSection')){renderGroupedPlanSummary();}},1200);
})();
