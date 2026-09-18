/* ACROW Factory 5 — v69: stable production + machine list persistence */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v65';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;background-image:none!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;transition:none!important;}
.actual-input.acrow-fixed,.actual-input:focus,.actual-input[data-production-done="1"]{background:#b9f3d1!important;background-image:none!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:inset 0 0 0 9999px #b9f3d1!important;}
.mc-row,.acrow-production-row{display:grid!important;grid-template-columns:58px 160px!important;align-items:center!important;column-gap:8px!important;width:100%!important;box-sizing:border-box!important;}
.mc-row>label,.acrow-production-row>label{grid-column:1!important;width:58px!important;min-width:58px!important;max-width:58px!important;flex:none!important;position:static!important;box-sizing:border-box!important;}
.mc-row>.actual-input,.mc-row>.mc-target-fixed,.acrow-production-row>.actual-input,.acrow-production-row>.mc-target-fixed{grid-column:2!important;width:160px!important;min-width:160px!important;max-width:160px!important;flex:none!important;box-sizing:border-box!important;}
.acrow-production-row .actual-input{height:70px!important;min-height:70px!important;max-height:70px!important;font-size:28px!important;text-align:center!important;font-weight:800!important;padding:6px!important;}
.mc-row .mc-target-fixed{height:70px!important;min-height:70px!important;max-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}
.mc-row .mc-target-fixed small{white-space:nowrap!important;}
.mc-bottom{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;gap:8px!important;width:100%!important;}
.mc-bottom>.mc-btn.has-faults{width:110px!important;min-width:110px!important;max-width:110px!important;flex:none!important;box-sizing:border-box!important;overflow:hidden!important;white-space:nowrap!important;}
.acrow-production-row.acrow-production-done{background:#b9f3d1!important;border:3px solid #159957!important;border-radius:10px!important;padding:0!important;box-shadow:none!important;}
.acrow-production-row.acrow-production-done .production-label{color:#063b22!important;}
.acrow-production-row.acrow-production-done .actual-input{background:#b9f3d1!important;background-image:none!important;border-color:#159957!important;color:#063b22!important;}
.acrow-production-row .production-fix-btn-v2{display:none!important;}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function paint(input,r){var has=String(input.value||'').trim()!=='';var row=input.closest('.mc-row')||input.parentElement;input.classList.toggle('acrow-fixed',has);input.setAttribute('data-production-done',has?'1':'0');if(row){row.classList.add('acrow-production-row');row.classList.toggle('acrow-production-done',has);}input.style.setProperty('background',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-color',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-image','none','important');input.style.setProperty('border-color',has?'#159957':'#e0ad00','important');input.style.setProperty('color',has?'#063b22':'#4a3900','important');if(has)input.style.setProperty('box-shadow','inset 0 0 0 9999px #b9f3d1','important');else input.style.setProperty('box-shadow','none','important');if(r)r.productionFixed=has;}
function decorate(root){style();(root||document).querySelectorAll('.actual-input').forEach(function(input){paint(input,rec(String(input.dataset.machine||'').trim()));});}
var MERGED_MACHINES=[['1712','منشار RSA'],['982','متقاب/مثقاب'],['961','متقاب'],['263','مثقاب'],['882','مثقاب'],['1522','Ledgers/Ring'],['999','Ledgers/Ring'],['5004','Ledgers/Ring'],['5003','Ledgers/Ring'],['1521','Ledgers/Ring'],['998','Ledgers/Ring'],['997','Ring Vertical'],['996','Ring Vertical'],['5006','Ring Vertical'],['5005','Cup Lock Vertical'],['450','Cup Lock Vertical'],['1524','Cup Lock Vertical'],['1523','Cup Lock Vertical'],['5008','فوله اوتوماتيك'],['402','Hand welding'],['455','Hand welding'],['118','Hand welding'],['116','Hand welding'],['404','Hand welding'],['1502','منطقة الفرز'],['279','مكبس'],['225','مكبس'],['956','مكبس'],['284','مكبس'],['1107','مكبس تخريم'],['1324','مكبس تشكيل'],['1313','مكنه تشكيل'],['1320','مكنه تشكيل'],['147','مكنه تشكيل'],['986','متقاب'],['1306','متقاب'],['963','متقاب'],['1317','متقاب'],['1318','متقاب'],['964','متقاب'],['954','منشار'],['1713','متقاب متعدد'],['112','فريم كوباية'],['114','فريم كوباية'],['477','فارمه يدوي'],['1504','فارمه يدوي'],['712','فارمه يدوي'],['710','فارمه يدوي'],['122','فارمه يدوي'],['454','فارمه يدوي'],['713','فارمه يدوي'],['115','فارمه يدوي'],['117','فارمه يدوي'],['711','فارمه يدوي'],['456','فارمه يدوي'],['1501','ماكينه يدوي'],['120','ماكينه يدوي']];
var mergedNumbers=MERGED_MACHINES.map(function(x){return String(x[0]);});
function machineEntries(){
 var out=MERGED_MACHINES.map(function(m){return {id:String(m[0]),name:String(m[1]||'')};});
 try{if(window.store&&Array.isArray(store.machines))store.machines.forEach(function(m){var id=String(m.number||m.code||m.id||m.machine||'').trim();var name=String(m.name||m.type||m.machineName||'').trim();if(!id)return;var exists=out.some(function(x){return x.id===id;});if(!exists)out.push({id:id,name:name||id});else if(name){out.forEach(function(x){if(x.id===id&&(!x.name||x.name===id))x.name=name;});}});}catch(e){}
 try{if(window.store&&store.machineCustom)Object.values(store.machineCustom).forEach(function(m){var id=String(m&&m.id||'').trim();var name=String(m&&m.name||m&&m.type||m&&m.machineName||'').trim();if(!id)return;var exists=out.some(function(x){return x.id===id;});if(!exists)out.push({id:id,name:name||id});else if(name)out.forEach(function(x){if(x.id===id)x.name=name;});});}catch(e){}
 return out;
}
function isMachineSelect(sel){
 var txt=(sel.id+' '+sel.name+' '+sel.className+' '+(sel.getAttribute('aria-label')||'')+' '+(sel.getAttribute('data-label')||'')).toLowerCase();
 if(/machine|ماكين|ماكينه|مكن|اختيار|خطة|plan|انتاج|إنتاج/.test(txt))return true;
 return Array.prototype.some.call(sel.options,function(o){return mergedNumbers.indexOf(String(o.value||o.textContent).trim())>=0;});
}
function mergeMachineOptions(){try{var entries=machineEntries();document.querySelectorAll('select').forEach(function(sel){if(!isMachineSelect(sel))return;var existing={};Array.prototype.forEach.call(sel.options,function(o){existing[String(o.value||'').trim()]=true;});entries.forEach(function(m){if(!existing[m.id]){var o=document.createElement('option');o.value=m.id;o.textContent=m.id+' — '+m.name;sel.appendChild(o);existing[m.id]=true;}});});}catch(e){}}
function mergeMachineStore(){try{if(window.store&&Array.isArray(window.store.machines)){var seen={};store.machines.forEach(function(m){seen[String(m.number||m.code||m.id||m.machine||'')]=true;});MERGED_MACHINES.forEach(function(m){if(!seen[m[0]])store.machines.push({number:m[0],name:m[1],zone:'منطقة 1'});});try{if(typeof saveStore==='function')saveStore();}catch(e){}}}catch(e){}}
function addCustomMachines(){try{var types=['مكبس','فارمه شور بريس','فارمه تلسكوب','فارمه فريم كبايه','فارمه فريم مشكل','ماكينه تشكيل','مكبس عوارض','ماكينه لحام شور بريس','ماكينه قطع T2'];var locs=['منطقة الفرز','الإنتاج','الصيانة','المخزن','أخرى'];if(!window.store)return;if(!Array.isArray(store.machines))store.machines=[];var existing={};store.machines.forEach(function(m){existing[String(m.code||m.id||m.number||'')]=true;});for(var i=1;i<=10;i++){var code='USR'+String(i).padStart(2,'0');if(!existing[code])store.machines.push({id:code,code:code,barcode:code,name:'',type:types[(i-1)%types.length],location:locs[0],dept:'sorting',deptName:locs[0],target:null});}try{if(typeof saveStore==='function')saveStore();}catch(e){}}catch(e){}}
function normalizeProductionMachineNames(){try{if(!window.store||!Array.isArray(store.machines))return;var changed=false;store.machines.forEach(function(m){var t=String(m.type||'').trim();if(/شور\s*بريس/.test(t)){if(m.name!=='شور بريس'){m.name='شور بريس';changed=true;}}else if(/تلسكوب/.test(t)){if(m.name!=='تلسكوب'){m.name='تلسكوب';changed=true;}}});if(changed&&typeof saveStore==='function')saveStore();}catch(e){}}
function keepMachineLists(){addCustomMachines();normalizeProductionMachineNames();mergeMachineStore();mergeMachineOptions();}
function decorateMerged(){keepMachineLists();decorate();setTimeout(function(){mergeMachineOptions();},80);setTimeout(function(){mergeMachineOptions();},300);}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;e.stopImmediatePropagation();var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';}paint(input,r);},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);mergeMachineOptions();},true);
document.addEventListener('blur',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
function watch(){if(!window.MutationObserver)return;var ob=new MutationObserver(function(list){list.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){decorate(n);mergeMachineOptions();}});});});ob.observe(document.body,{childList:true,subtree:true});}
function start(){style();decorateMerged();watch();setInterval(keepMachineLists,10000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
(function loadFaultRepairDeleteFix(){if(window.__acrowFaultRepairDeleteV68Loaded)return;window.__acrowFaultRepairDeleteV68Loaded=true;var s=document.createElement('script');s.src='fault-delete-fix.js?v=68';s.async=false;document.head.appendChild(s);})();
(function(){
 function syncCustom(){try{if(typeof window.rebuildMachines==='function')window.rebuildMachines();}catch(e){}}
 function hookChooser(){try{if(window.__acrowDailyChooserHook)return;if(typeof window.renderMachineSelectList!=='function')return;var original=window.renderMachineSelectList;window.renderMachineSelectList=function(){syncCustom();return original.apply(this,arguments)};window.__acrowDailyChooserHook=true;}catch(e){}}
 function boot(){syncCustom();hookChooser();setTimeout(function(){syncCustom();hookChooser()},300);setTimeout(function(){syncCustom();hookChooser()},1000);setTimeout(function(){syncCustom();hookChooser()},2000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
(function(){function hideSplash(){var s=document.getElementById('acrowSplash');if(!s)return;s.classList.add('hidden','v172-off');s.setAttribute('aria-hidden','true');s.style.setProperty('display','none','important');s.style.setProperty('visibility','hidden','important');s.style.setProperty('opacity','0','important');s.style.setProperty('pointer-events','none','important');s.style.setProperty('z-index','-1','important');}function openApp(e){if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}document.body.classList.add('v172-app-open');document.body.classList.remove('splash-open','v139-app-open','v128-app-open','v162-app-open','v163-app-open');document.body.style.setProperty('overflow','auto','important');hideSplash();['.topbar','.container','#summaryStrip','#departments'].forEach(function(sel){var x=document.querySelector(sel);if(x){x.style.setProperty('display','block','important');x.style.setProperty('visibility','visible','important');x.style.setProperty('opacity','1','important');}});try{if(typeof render==='function')render();}catch(err){}try{if(typeof renderReport==='function')renderReport();}catch(err){}return false;}function findButton(){var ids=['enterSystemBtn','enterBtn','loginBtn','splashEnterBtn'];for(var i=0;i<ids.length;i++){var b=document.getElementById(ids[i]);if(b)return b;}var s=document.getElementById('acrowSplash');if(s){var bs=s.querySelectorAll('button,input[type=button],input[type=submit],a');for(var j=0;j<bs.length;j++){var t=String(bs[j].textContent||bs[j].value||'').trim();if(/دخول|ادخل|ابدأ|فتح|اضغط/i.test(t))return bs[j];}}return null;}function bind(){var b=findButton();if(!b)return;b.onclick=openApp;b.disabled=false;b.removeAttribute('disabled');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('touch-action','manipulation','important');if(b.dataset.v172!=='1'){b.dataset.v172='1';b.addEventListener('click',openApp,true);b.addEventListener('touchend',openApp,true);}}function guard(){if(document.body.classList.contains('v172-app-open'))hideSplash();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();if(window.MutationObserver)new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});setInterval(bind,200);setInterval(guard,100);})();
/* v70 — freeze only production-related render/rebuild calls while the production input has focus. No refocus is used, so Android keyboard is not forced open/closed. */
(function(){
 var hookedNames={};
 var queued=false;
 function editing(){var e=document.activeElement;return !!(e&&e.classList&&e.classList.contains('actual-input'));}
 function install(){
  ['render','renderAll','rebuildMachines','renderMachineSelectList','renderDashboard','renderReport','renderMaintenance'].forEach(function(name){
   try{
    if(hookedNames[name]||typeof window[name]!=='function')return;
    var fn=window[name];
    var wrap=function(){
     if(editing()){queued=true;return;}
     return fn.apply(this,arguments);
    };
    wrap.__acrowKeyboardGuard=true;
    window[name]=wrap;
    hookedNames[name]=true;
   }catch(e){}
  });
 }
 document.addEventListener('focusin',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('actual-input')){install();}},true);
 document.addEventListener('focusout',function(e){if(!(e.target&&e.target.classList&&e.target.classList.contains('actual-input')))return;if(queued){queued=false;setTimeout(function(){try{if(typeof window.render==='function')window.render();}catch(x){}},80);}},true);
 install();setTimeout(install,100);setTimeout(install,500);setTimeout(install,1500);
})();
})();

/* ACROW FIX 2026-09-18 — make the extra daily/monthly machines truly independent.
   No machine in this set is forced on by this fix. The checkbox state is the authority. */
(function(){
'use strict';
var INDEPENDENT_IDS=['2','8','9','10','forming-frame'];
var INDEPENDENT_NAMES={
  '2':'مكبس فريم كونيكتور',
  '8':'تليسكوب',
  '9':'شور بريس',
  '10':'اسبيجوت',
  'forming-frame':'فريم تشكيل'
};
function iid(v){return String(v==null?'':v).trim();}
function unique(a){return Array.from(new Set((a||[]).map(iid).filter(Boolean)));}
function appStore(){return (typeof window.store!=='undefined'&&window.store)?window.store:null;}
function appSettings(){
  var s=appStore(); if(!s)return null;
  if(!s.settings)s.settings={};
  return s.settings;
}
function readIndependentSelection(){
  var st=appSettings();
  if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds)) return unique(st.dailyMachineIds);
  try{
    var x=JSON.parse(localStorage.getItem('acrow_daily_manual_selection_v240')||'null');
    if(Array.isArray(x)) return unique(x);
  }catch(e){}
  var s=appStore();
  return s&&Array.isArray(s.favorites)?unique(s.favorites):[];
}
function saveIndependentSelection(a){
  a=unique(a);
  var st=appSettings();
  if(st){
    st.dailyMachineIds=a.slice();
    st.dailyMachineIdsConfigured=true;
  }
  var s=appStore();
  if(s)s.favorites=a.slice();
  try{localStorage.setItem('acrow_daily_manual_selection_v240',JSON.stringify(a));}catch(e){}
  try{localStorage.setItem('acrow_daily_independent_selection_v1',JSON.stringify(a));}catch(e){}
  try{window.__acrowDailyFavoritesDirty=true;if(typeof window.saveStore==='function')window.saveStore();}catch(e){}
  try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}
}
function checkboxId(cb){
  if(!cb)return '';
  var id=cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id')||cb.value;
  if(id)return iid(id);
  var row=cb.closest&&cb.closest('#machineSelectList label,#machineSelectList .fav-checkbox-row,#machineSelectList [data-machine-id]');
  return row?iid(row.getAttribute('data-machine-id')||row.getAttribute('data-machine')||''):'';
}
function dailyBoxes(){
  var root=document.getElementById('machineSelectList');
  return root?Array.from(root.querySelectorAll('input[type="checkbox"]')):[];
}
function captureDailyState(){
  var a=readIndependentSelection();
  dailyBoxes().forEach(function(cb){
    var id=checkboxId(cb);
    if(INDEPENDENT_IDS.indexOf(id)<0)return;
    a=a.filter(function(x){return x!==id;});
    if(cb.checked)a.push(id);
  });
  saveIndependentSelection(a);
}
function bindDaily(){
  var root=document.getElementById('machineSelectList');
  if(!root||root.dataset.acrowIndependentExtra==='1')return;
  root.dataset.acrowIndependentExtra='1';
  root.addEventListener('change',function(e){
    var cb=e.target&&e.target.closest?e.target.closest('input[type="checkbox"]'):null;
    if(!cb)return;
    var id=checkboxId(cb);
    if(INDEPENDENT_IDS.indexOf(id)<0)return;
    captureDailyState();
  },true);
  root.addEventListener('click',function(e){
    var cb=e.target&&e.target.closest?e.target.closest('input[type="checkbox"]'):null;
    if(!cb)return;
    var id=checkboxId(cb);
    if(INDEPENDENT_IDS.indexOf(id)<0)return;
    setTimeout(captureDailyState,0);
  },true);
}
function bindDone(){
  var b=document.getElementById('doneMachineSelectBtn');
  if(!b||b.dataset.acrowIndependentDone==='1')return;
  b.dataset.acrowIndependentDone='1';
  b.addEventListener('click',function(){captureDailyState();},true);
}
function protectDailyRender(){
  /* Re-apply only the saved state for these IDs after the app finishes rendering.
     This prevents unrelated render code from grouping/reselecting them. */
  var root=document.getElementById('machineSelectList');
  if(!root)return;
  var saved=readIndependentSelection(), set={};
  saved.forEach(function(x){set[iid(x)]=true;});
  root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
    var id=checkboxId(cb);
    if(INDEPENDENT_IDS.indexOf(id)>=0) cb.checked=!!set[id];
  });
}
function bindPlanRoot(id){
  var root=document.getElementById(id);
  if(!root||root.dataset.acrowIndependentPlan==='1')return;
  root.dataset.acrowIndependentPlan='1';
  root.addEventListener('change',function(e){
    var cb=e.target;
    if(!cb||cb.tagName!=='INPUT'||cb.type!=='checkbox')return;
    var value=iid(cb.value||cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id'));
    if(!value)return;
    var st=appSettings(); if(!st)return;
    var key='planMachineIds',lock='planMachineIdsLocked';
    var cur=Array.isArray(st[lock])?unique(st[lock]):(Array.isArray(st[key])?unique(st[key]):[]);
    var set=new Set(cur);
    if(cb.checked)set.add(value);else set.delete(value);
    var next=Array.from(set);
    st[key]=next.slice(); st[lock]=next.slice(); st.planMachineIdsConfigured=true;
    try{if(typeof window.saveStore==='function')window.saveStore();}catch(e){}
  },true);
}
function boot(){
  bindDaily(); bindDone();
  bindPlanRoot('planMachineSelectList');
  bindPlanRoot('planStatusMachineSelect');
  protectDailyRender();
  setTimeout(protectDailyRender,80);
  setTimeout(protectDailyRender,300);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver)new MutationObserver(function(){
  bindDaily();bindDone();bindPlanRoot('planMachineSelectList');bindPlanRoot('planStatusMachineSelect');
}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){
  bindDaily();bindDone();bindPlanRoot('planMachineSelectList');bindPlanRoot('planStatusMachineSelect');
},1000);
})();
