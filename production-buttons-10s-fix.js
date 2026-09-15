/* ACROW Factory 5 — v228: lock the five daily machines into selector + production cards */
(function(){
'use strict';
var EXTRA=[
 {id:'2',name:'مكبس فريم كونكتور'},
 {id:'8',name:'تليسكوب'},
 {id:'9',name:'شور برس'},
 {id:'10',name:'اسبيجوت'},
 {id:'forming-frame',name:'فريم تشكيل'}
];
var IDS=EXTRA.map(function(x){return String(x.id);});
function sid(v){return String(v==null?'':v).trim();}
function obj(m){return {id:String(m.id),name:m.name,dept:'daily',deptName:'ماكينات إنتاج اليوم',target:null};}
function ensureDepartment(){try{if(typeof DEPARTMENTS!=='undefined'&&Array.isArray(DEPARTMENTS)){
 var d=DEPARTMENTS.find(function(x){return x&&sid(x.id)==='daily'});
 if(!d)DEPARTMENTS.push({id:'daily',name:'ماكينات إنتاج اليوم',target:0,count:5,prefix:'PD'});
 else {d.name='ماكينات إنتاج اليوم';d.count=5;}
}}catch(e){}}
function ensureGlobal(){try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))EXTRA.forEach(function(m){
 var found=MACHINES.find(function(x){return sid(x&&x.id)===sid(m.id)});
 if(!found)MACHINES.push(obj(m));
 else {found.id=String(m.id);found.name=m.name;found.dept='daily';found.deptName='ماكينات إنتاج اليوم';if(found.target===undefined)found.target=null;}
});}catch(e){}}
function addContainer(c,m){var id=sid(m.id),o=obj(m);if(Array.isArray(c)){
 var found=c.find(function(x){return sid(x&&x.id)===id});
 if(!found)c.push(o);else{found.id=id;found.name=m.name;found.dept='daily';found.deptName='ماكينات إنتاج اليوم';}
 return;
}if(c&&typeof c==='object'){if(!c[id])c[id]=o;else{c[id].id=id;c[id].name=m.name;c[id].dept='daily';c[id].deptName='ماكينات إنتاج اليوم';}}}
function ensureStoreMachines(){try{if(typeof store==='undefined'||!store)return;
 ['machines','customMachines','machineCustom'].forEach(function(k){var v=store[k];if(v==null){store[k]=k==='machineCustom'?{}:[];v=store[k];}EXTRA.forEach(function(m){addContainer(v,m);});});
 if(!Array.isArray(store.favorites))store.favorites=[];
 IDS.forEach(function(id){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);});
 try{if(typeof saveStore==='function')saveStore();}catch(e){}
}catch(e){}}
function ensureAll(){ensureDepartment();ensureGlobal();ensureStoreMachines();}
function hook(name){try{if(typeof window[name]!=='function'||window[name]['__acrow228_'+name])return;var old=window[name];var w=function(){ensureAll();var r=old.apply(this,arguments);ensureAll();return r;};w['__acrow228_'+name]=true;window[name]=w;}catch(e){}}
function hookBuildMachines(){try{if(typeof window.buildMachines==='function'&&!window.buildMachines.__acrow228){var old=window.buildMachines;var w=function(){var a=old.apply(this,arguments)||[];EXTRA.forEach(function(m){var f=a.find(function(x){return sid(x&&x.id)===sid(m.id)});if(!f)a.push(obj(m));else{f.id=String(m.id);f.name=m.name;f.dept='daily';f.deptName='ماكينات إنتاج اليوم';}});return a;};w.__acrow228=true;window.buildMachines=w;}}catch(e){}}
function redraw(){ensureAll();hookBuildMachines();hook('rebuildMachines');hook('renderMachineSelectList');hook('render');hook('renderAll');try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}ensureAll();try{if(typeof window.renderMachineSelectList==='function')window.renderMachineSelectList();}catch(e){}try{if(typeof window.render==='function')window.render();}catch(e){}}
function boot(){redraw();[100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(redraw,t);});setInterval(function(){ensureAll();hookBuildMachines();hook('rebuildMachines');hook('renderMachineSelectList');hook('render');hook('renderAll');},1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — FINAL: put efficiency-reason button directly under daily produced-machines selector */
(function(){
'use strict';
function place(){
  var b=document.getElementById('acrowReasonBtn');
  if(!b)return;
  var a=document.getElementById('selectMachinesBtn');
  if(!a){
    var all=Array.from(document.querySelectorAll('button'));
    a=all.find(function(x){return /اختيار\s*الماكينات\s*المنتجة\s*اليوم/.test((x.textContent||'').replace(/\s+/g,' ').trim());});
  }
  if(!a)return;
  if(a.nextElementSibling!==b){try{a.insertAdjacentElement('afterend',b);}catch(e){}}
  b.style.setProperty('display','flex','important');
  b.style.setProperty('width','100%','important');
  b.style.setProperty('margin-top','0','important');
  b.style.setProperty('order','2','important');
}
function boot(){place();[100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(place,t);});if(window.MutationObserver)new MutationObserver(function(){place();}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — QUICK: production entry beside/above barcode-clear button */
(function(){
'use strict';
function findClear(){
 var bs=Array.from(document.querySelectorAll('button'));
 return bs.find(function(b){return /مسح\s*(الباركود|الباركود\s*)?/i.test((b.textContent||'').replace(/\s+/g,' ').trim());});
}
function findProduction(){
 var bs=Array.from(document.querySelectorAll('button'));
 return bs.find(function(b){return /تسجيل\s*الإنتاج/.test((b.textContent||'').replace(/\s+/g,' ').trim());});
}
function place(){
 var clear=findClear(); if(!clear)return;
 var b=document.getElementById('acrowQuickProductionBtn');
 if(!b){
  b=document.createElement('button');b.id='acrowQuickProductionBtn';b.type='button';
  b.textContent='إدخال الإنتاج';
  b.style.cssText='display:flex!important;width:100%;margin:6px 0!important;background:linear-gradient(135deg,#0f6fff,#20b8ff)!important;color:#fff!important;border:1px solid #20b8ff!important;padding:10px 14px;border-radius:9px;font-family:Tajawal,sans-serif;font-weight:800;font-size:13px;cursor:pointer;justify-content:center;align-items:center;';
  b.onclick=function(){
   var p=findProduction();
   if(p){p.click();return;}
   var all=Array.from(document.querySelectorAll('button'));
   var q=all.find(function(x){return /الوردية\s*الأولى/.test(x.textContent||'')&&/إنتاج/.test(x.textContent||'');});
   if(q)q.click();
  };
 }
 if(clear.parentElement && b.parentElement!==clear.parentElement){clear.parentElement.insertBefore(b,clear);}
 else if(clear.previousElementSibling!==b){try{clear.insertAdjacentElement('beforebegin',b);}catch(e){}}
}
function boot(){place();[100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(place,t);});if(window.MutationObserver)new MutationObserver(function(){place();}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* ACROW Factory 5 — Add the missing efficiency-loss reasons button */
(function(){
'use strict';
var REASONS=['نقص خامات','عطل ماكينة','إعداد وتجهيز','نقص عمالة','تغيير منتج','جودة وإعادة تشغيل','انتظار تعليمات','أخرى'];
function saveReason(reason,details){
 try{
  var key='acrowEfficiencyReasons';
  var arr=[];try{arr=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(arr))arr=[];}catch(e){arr=[];}
  arr.push({date:new Date().toISOString(),shift:window.currentShift||'',reason:reason,details:details||''});
  localStorage.setItem(key,JSON.stringify(arr));
  try{if(window.store){store.efficiencyReasons=arr;if(typeof saveStore==='function')saveStore();}}catch(e){}
 }catch(e){}
}
function ensureModal(){
 if(document.getElementById('acrowEfficiencyReasonModal'))return;
 var o=document.createElement('div');o.id='acrowEfficiencyReasonModal';
 o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(4,10,18,.78);display:none;align-items:center;justify-content:center;padding:16px;';
 o.innerHTML='<div dir="rtl" style="width:100%;max-width:430px;max-height:88vh;overflow:auto;background:#111d2b;border:1px solid #2b4054;border-radius:16px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.45);font-family:Tajawal,sans-serif;color:#e9edf1;">'
 +'<div style="font-size:20px;font-weight:900;margin-bottom:4px;">أسباب نقص كفاءة الإنتاج</div>'
 +'<div style="font-size:12px;color:#8b98a5;margin-bottom:14px;">اختر سبب النقص وسجّل الملاحظة إن وجدت</div>'
 +'<select id="acrowEfficiencyReasonSelect" style="width:100%;padding:12px;border-radius:9px;background:#07101b;color:#fff;border:1px solid #2b4054;font-family:Tajawal;font-size:14px;margin-bottom:10px;">'
 +'<option value="">اختر السبب</option>'+REASONS.map(function(r){return '<option value="'+r+'">'+r+'</option>';}).join('')+'</select>'
 +'<textarea id="acrowEfficiencyReasonDetails" placeholder="ملاحظات إضافية" style="width:100%;min-height:90px;resize:vertical;padding:11px;border-radius:9px;background:#07101b;color:#fff;border:1px solid #2b4054;font-family:Tajawal;font-size:13px;margin-bottom:12px;"></textarea>'
 +'<div style="display:flex;gap:8px;justify-content:flex-start;">'
 +'<button id="acrowEfficiencyReasonSave" type="button" style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:1px solid #22c55e;padding:10px 18px;border-radius:9px;font-family:Tajawal;font-weight:800;cursor:pointer;">حفظ السبب</button>'
 +'<button id="acrowEfficiencyReasonClose" type="button" style="background:#334155;color:#fff;border:1px solid #64748b;padding:10px 18px;border-radius:9px;font-family:Tajawal;font-weight:800;cursor:pointer;">إغلاق</button>'
 +'</div></div>';
 document.body.appendChild(o);
 o.addEventListener('click',function(e){if(e.target===o)o.style.display='none';});
 document.getElementById('acrowEfficiencyReasonClose').onclick=function(){o.style.display='none';};
 document.getElementById('acrowEfficiencyReasonSave').onclick=function(){
  var r=document.getElementById('acrowEfficiencyReasonSelect').value;
  if(!r){alert('اختر سبب نقص الكفاءة أولاً');return;}
  saveReason(r,document.getElementById('acrowEfficiencyReasonDetails').value.trim());
  document.getElementById('acrowEfficiencyReasonSelect').value='';
  document.getElementById('acrowEfficiencyReasonDetails').value='';
  o.style.display='none';
 };
}
function place(){
 ensureModal();
 var b=document.getElementById('acrowReasonBtn');
 if(!b){
  b=document.createElement('button');b.id='acrowReasonBtn';b.type='button';b.textContent='أسباب نقص كفاءة الإنتاج';
  b.style.cssText='display:flex!important;width:100%!important;margin:8px 0 10px!important;box-sizing:border-box!important;background:#ffd400!important;color:#064b9b!important;border:3px solid #064b9b!important;padding:12px 16px!important;border-radius:10px!important;font-family:Tajawal,sans-serif!important;font-weight:800!important;font-size:14px!important;cursor:pointer!important;justify-content:center!important;align-items:center!important;box-shadow:0 2px 8px rgba(6,75,155,.28)!important;';
  b.onclick=function(){ensureModal();document.getElementById('acrowEfficiencyReasonModal').style.display='flex';};
  document.body.appendChild(b);
 }
 var a=document.getElementById('selectMachinesBtn');
 if(!a){var all=Array.from(document.querySelectorAll('button'));a=all.find(function(x){return /اختيار\s*الماكينات\s*المنتجة\s*اليوم/.test((x.textContent||'').replace(/\s+/g,' ').trim());});}
 if(a&&b.parentElement===document.body){a.insertAdjacentElement('afterend',b);}
 if(a){b.style.setProperty('display','flex','important');b.style.setProperty('width','100%','important');}
}
function boot(){place();[100,300,700,1200,2000,4000,7000].forEach(function(t){setTimeout(place,t);});if(window.MutationObserver)new MutationObserver(function(){place();}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();