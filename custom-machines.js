/* ACROW Factory 5 v80 — custom machines: approved machine-type list */
(function(){
'use strict';
if(window.__acrowCustomMachinesV80)return;
window.__acrowCustomMachinesV80=true;
var IDS=Array.from({length:10},function(_,i){return 'USR'+String(i+1).padStart(2,'0');});
var DEFAULT_DEPT='sorting';
var MACHINE_TYPES=['مكبس','فارمه شور بريس','فارمه تلسكوب','فارمه فريم كبايه','فارمه فريم مشكل','ماكينه تشكيل','مكبس عوارض','ماكينه لحام شور بريس','ماكينه قطع T2'];
function migrateCodes(){
 if(typeof store==='undefined'||!store)return;
 store.machineCustom=store.machineCustom||{};
 var changed=false;
 IDS.forEach(function(id){
   var c=store.machineCustom[id];
   if(c&&c.name){
     if(!c.code){c.code=id;changed=true;}
     if(!c.barcode){c.barcode=id;changed=true;}
     if(!c.dept||c.dept==='custom'){c.dept=DEFAULT_DEPT;c.deptName='منطقة الفرز';changed=true;}
     if(c.type===undefined){c.type='';changed=true;}
   }
 });
 if(changed){try{saveStore();}catch(e){}}
}
function clearMachineRecords(machineId){
 if(typeof store==='undefined'||!store||!store.records)return;
 var suffix='_'+String(machineId);
 Object.keys(store.records).forEach(function(key){if(key.endsWith(suffix))delete store.records[key];});
}
function saveAll(){
 if(typeof store==='undefined'||!store)return;
 store.machineCustom=store.machineCustom||{};store.machineDisabled=store.machineDisabled||{};
 var deptEl=document.getElementById('newMachineDept'),dept=deptEl?String(deptEl.value||'').trim():'';
 var d=(typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS.find)?DEPARTMENTS.find(function(x){return x.id===dept;}):null;
 if(!dept||dept==='custom'){dept=DEFAULT_DEPT;d=(typeof DEPARTMENTS!=='undefined'&&DEPARTMENTS.find)?DEPARTMENTS.find(function(x){return x.id===DEFAULT_DEPT;}):null;}
 IDS.forEach(function(id){
   var el=document.querySelector('[data-custom-machine-name="'+id+'"]');
   var typeEl=document.querySelector('[data-custom-machine-type="'+id+'"]');
   if(!el)return;
   var name=String(el.value||'').trim(),type=typeEl?String(typeEl.value||'').trim():'';
   var old=store.machineCustom[id];
   if(name){
     if(old&&old.name&&old.name!==name)clearMachineRecords(id);
     store.machineCustom[id]={id:id,code:id,barcode:id,name:name,type:type,dept:dept,deptName:d&&d.name?d.name:'منطقة الفرز',target:null};
     delete store.machineDisabled[id];
   }else{delete store.machineCustom[id];store.machineDisabled[id]=true;}
 });
 try{saveStore();}catch(e){}try{rebuildMachines();}catch(e){}try{renderMachineManager();}catch(e){}try{render();}catch(e){}try{renderReport();}catch(e){}try{renderDashboard();}catch(e){}setTimeout(inject,30);
}
function typeOptions(selected){
 return '<option value="">اختر نوع الماكينة</option>'+MACHINE_TYPES.map(function(t){return '<option value="'+t.replace(/"/g,'&quot;')+'" '+(selected===t?'selected':'')+'>'+t+'</option>';}).join('');
}
function inject(){
 var modal=document.getElementById('machineManagerModal'),list=document.getElementById('machineManagerList');
 if(!modal||!list)return;
 if(document.getElementById('acrow-custom-machines-v80')){refreshValues();return;}
 var box=document.createElement('div');box.id='acrow-custom-machines-v80';
 box.innerHTML='<div class="acrow-custom-title">إضافة ماكينة جديدة — اختر اسم الماكينة ونوعها</div><div class="acrow-custom-grid">'+IDS.map(function(id,i){return '<div class="acrow-custom-row"><span>'+String(i+1)+'</span><input type="text" data-custom-machine-name="'+id+'" placeholder="اسم الماكينة"><select data-custom-machine-type="'+id+'">'+typeOptions('')+'</select><small style="display:block;min-width:52px;text-align:center;font-family:var(--mono);font-weight:800;color:var(--accent);">'+id+'</small></div>';}).join('')+'</div><button type="button" id="acrow-custom-save-v80" class="btn-primary">حفظ الماكينات الإضافية</button>';
 list.parentNode.insertBefore(box,list);
 document.getElementById('acrow-custom-save-v80').addEventListener('click',saveAll);refreshValues();
}
function refreshValues(){migrateCodes();IDS.forEach(function(id){var el=document.querySelector('[data-custom-machine-name="'+id+'"]'),te=document.querySelector('[data-custom-machine-type="'+id+'"]'),c=typeof store!=='undefined'&&store.machineCustom?store.machineCustom[id]:null;if(el&&document.activeElement!==el)el.value=c&&c.name?c.name:'';if(te&&document.activeElement!==te){te.innerHTML=typeOptions(c&&c.type?c.type:'');te.value=c&&c.type?c.type:'';}});}
function watch(){if(!window.MutationObserver)return;new MutationObserver(function(){inject();}).observe(document.body,{childList:true,subtree:true});}
function start(){migrateCodes();inject();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();