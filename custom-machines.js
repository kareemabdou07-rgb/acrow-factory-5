/* ACROW Factory 5 v73 — 10 permanent custom machine slots */
(function(){
'use strict';
if(window.__acrowCustomMachinesV73)return;
window.__acrowCustomMachinesV73=true;
var IDS=Array.from({length:10},function(_,i){return 'USR'+String(i+1).padStart(2,'0');});
function saveAll(){
 if(typeof store==='undefined'||!store)return;
 store.machineCustom=store.machineCustom||{}; store.machineDisabled=store.machineDisabled||{};
 var deptEl=document.getElementById('newMachineDept'),dept=deptEl?String(deptEl.value||'').trim():'';
 var d=(typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS.find)?DEPARTMENTS.find(function(x){return x.id===dept;}):null;
 IDS.forEach(function(id){var el=document.querySelector('[data-custom-machine-name="'+id+'"]');if(!el)return;var name=String(el.value||'').trim();if(name){store.machineCustom[id]={id:id,name:name,dept:dept||'custom',deptName:d&&d.name?d.name:'إضافي',target:null};delete store.machineDisabled[id];}else{delete store.machineCustom[id];store.machineDisabled[id]=true;}});
 try{saveStore();}catch(e){} try{rebuildMachines();}catch(e){} try{renderMachineManager();}catch(e){} try{render();}catch(e){} try{renderReport();}catch(e){} try{renderDashboard();}catch(e){} setTimeout(inject,30);
}
function inject(){var modal=document.getElementById('machineManagerModal'),list=document.getElementById('machineManagerList');if(!modal||!list)return;if(document.getElementById('acrow-custom-machines-v73')){refreshValues();return;}var box=document.createElement('div');box.id='acrow-custom-machines-v73';box.innerHTML='<div class="acrow-custom-title">10 خانات ماكينات إضافية ثابتة</div><div class="acrow-custom-grid">'+IDS.map(function(id,i){return '<div class="acrow-custom-row"><span>'+String(i+1)+'</span><input type="text" data-custom-machine-name="'+id+'" placeholder="اكتب اسم الماكينة هنا"></div>';}).join('')+'</div><button type="button" id="acrow-custom-save-v73" class="btn-primary">حفظ الماكينات الإضافية</button>';list.parentNode.insertBefore(box,list);document.getElementById('acrow-custom-save-v73').addEventListener('click',saveAll);refreshValues();}
function refreshValues(){IDS.forEach(function(id){var el=document.querySelector('[data-custom-machine-name="'+id+'"]');var c=typeof store!=='undefined'&&store.machineCustom?store.machineCustom[id]:null;if(el&&document.activeElement!==el)el.value=c&&c.name?c.name:'';});}
function watch(){if(!window.MutationObserver)return;new MutationObserver(function(){inject();}).observe(document.body,{childList:true,subtree:true});}
function start(){inject();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
