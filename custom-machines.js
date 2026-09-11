/* ACROW Factory 5 v82 — custom machines: name + type + independent location */
(function(){
'use strict';
if(window.__acrowCustomMachinesV82)return;
window.__acrowCustomMachinesV82=true;
var IDS=Array.from({length:10},function(_,i){return 'USR'+String(i+1).padStart(2,'0');});
var DEFAULT_DEPT='sorting';
var MACHINE_TYPES=['مكبس','فارمه شور بريس','فارمه تلسكوب','فارمه فريم كبايه','فارمه فريم مشكل','ماكينه تشكيل','مكبس عوارض','ماكينه لحام شور بريس','ماكينه قطع T2'];
var LOCATIONS=['منطقة الفرز','الإنتاج','الصيانة','المخزن','أخرى'];
function migrateCodes(){
 if(typeof store==='undefined'||!store)return;
 store.machineCustom=store.machineCustom||{};var changed=false;
 IDS.forEach(function(id){var c=store.machineCustom[id];if(c&&c.name){if(!c.code){c.code=id;changed=true;}if(!c.barcode){c.barcode=id;changed=true;}if(!c.type){c.type='';}if(!c.deptName){c.deptName=c.location||'منطقة الفرز';changed=true;}if(!c.location){c.location=c.deptName||'منطقة الفرز';changed=true;}if(!c.dept){c.dept=DEFAULT_DEPT;changed=true;}}});
 if(changed){try{saveStore();}catch(e){}}
}
function clearMachineRecords(machineId){if(typeof store==='undefined'||!store||!store.records)return;var suffix='_'+String(machineId);Object.keys(store.records).forEach(function(key){if(key.endsWith(suffix))delete store.records[key];});}
function val(id,key){var e=document.querySelector('[data-custom-machine-'+key+'="'+id+'"]');return e?String(e.value||'').trim():'';}
function saveAll(){
 if(typeof store==='undefined'||!store)return;store.machineCustom=store.machineCustom||{};store.machineDisabled=store.machineDisabled||{};
 IDS.forEach(function(id){var name=val(id,'name'),type=val(id,'type'),location=val(id,'location');var old=store.machineCustom[id];
  if(name){if(old&&old.name&&old.name!==name)clearMachineRecords(id);store.machineCustom[id]={id:id,code:id,barcode:id,name:name,type:type,location:location||'منطقة الفرز',dept:DEFAULT_DEPT,deptName:location||'منطقة الفرز',target:null};delete store.machineDisabled[id];}
  else{delete store.machineCustom[id];store.machineDisabled[id]=true;}
 });
 try{saveStore();}catch(e){}try{rebuildMachines();}catch(e){}try{renderMachineManager();}catch(e){}try{render();}catch(e){}try{renderReport();}catch(e){}try{renderDashboard();}catch(e){}setTimeout(inject,30);
}
function options(list,selected){return '<option value="">اختر</option>'+list.map(function(t){return '<option value="'+t.replace(/"/g,'&quot;')+'" '+(selected===t?'selected':'')+'>'+t+'</option>';}).join('');}
function inject(){var modal=document.getElementById('machineManagerModal'),list=document.getElementById('machineManagerList');if(!modal||!list)return;if(document.getElementById('acrow-custom-machines-v82')){refreshValues();return;}
 var box=document.createElement('div');box.id='acrow-custom-machines-v82';
 box.innerHTML='<div class="acrow-custom-title">إضافة ماكينة جديدة — الاسم والنوع والمكان</div><div class="acrow-custom-grid">'+IDS.map(function(id,i){return '<div class="acrow-custom-row"><span>'+String(i+1)+'</span><input type="text" data-custom-machine-name="'+id+'" placeholder="اسم الماكينة"><select data-custom-machine-type="'+id+'">'+options(MACHINE_TYPES,'')+'</select><select data-custom-machine-location="'+id+'">'+options(LOCATIONS,'منطقة الفرز')+'</select><small style="display:block;min-width:52px;text-align:center;font-family:var(--mono);font-weight:800;color:var(--accent);">'+id+'</small></div>';}).join('')+'</div><button type="button" id="acrow-custom-save-v82" class="btn-primary">حفظ الماكينات الإضافية</button>';
 list.parentNode.insertBefore(box,list);document.getElementById('acrow-custom-save-v82').addEventListener('click',saveAll);refreshValues();
}
function refreshValues(){migrateCodes();IDS.forEach(function(id){var c=typeof store!=='undefined'&&store.machineCustom?store.machineCustom[id]:null;var el=document.querySelector('[data-custom-machine-name="'+id+'"]'),te=document.querySelector('[data-custom-machine-type="'+id+'"]'),le=document.querySelector('[data-custom-machine-location="'+id+'"]');if(el&&document.activeElement!==el)el.value=c&&c.name?c.name:'';if(te&&document.activeElement!==te){te.innerHTML=options(MACHINE_TYPES,c&&c.type?c.type:'');te.value=c&&c.type?c.type:'';}if(le&&document.activeElement!==le){le.innerHTML=options(LOCATIONS,c&&c.location?c.location:'منطقة الفرز');le.value=c&&c.location?c.location:'منطقة الفرز';}});try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}}
function watch(){if(!window.MutationObserver)return;new MutationObserver(function(){inject();}).observe(document.body,{childList:true,subtree:true});}
function start(){migrateCodes();inject();try{rebuildMachines();}catch(e){}try{render();}catch(e){}watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
