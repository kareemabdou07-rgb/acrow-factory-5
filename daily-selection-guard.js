/* ACROW Factory 5 — v242: stable daily machine selector + immediate production cloud sync */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v240';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function S(){return typeof store!=='undefined'&&store?store:null;}
function settings(){var s=S();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function read(){var st=settings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds);try{var x=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('acrow_daily_manual_selection_v239')||'null');if(Array.isArray(x))return uniq(x);}catch(e){}var s=S();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function idOf(cb){if(!cb)return '';var id=cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id')||cb.value;if(id)return sid(id);var row=cb.closest&&cb.closest('#machineSelectList label,#machineSelectList .fav-checkbox-row,#machineSelectList [data-machine-id]');return row?sid(row.getAttribute('data-machine-id')||row.getAttribute('data-machine')||''):'';}
function boxes(){var root=document.getElementById('machineSelectList');return root?Array.from(root.querySelectorAll('input[type="checkbox"]')):[];}
function sync(){var a=read();boxes().forEach(function(cb){var id=idOf(cb);if(id)cb.checked=a.indexOf(id)>=0;});}
function persist(a){a=uniq(a);var st=settings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}var s=S();if(s)s.favorites=a.slice();window.__acrowDailyFavoritesDirty=true;save();}
function click(e){var root=document.getElementById('machineSelectList');if(!root||!root.contains(e.target))return;var cb=e.target.closest&&e.target.closest('input[type="checkbox"],label');if(!cb)return;var input=cb.matches&&cb.matches('input[type="checkbox"]')?cb:cb.querySelector&&cb.querySelector('input[type="checkbox"]');if(!input)return;setTimeout(function(){persist(boxes().filter(function(x){return x.checked;}).map(idOf));sync();},30);}
function done(e){var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(!b)return;setTimeout(function(){persist(boxes().filter(function(x){return x.checked;}).map(idOf));},30);}
document.addEventListener('click',click,true);
document.addEventListener('click',done,true);
function cloudPush(){try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function productionPush(input){
 try{
  if(input&&typeof getRecord==='function'&&typeof dateInput!=='undefined'){
   var id=sid(input.dataset&&input.dataset.machine||'');
   if(id){
    var r=getRecord(dateInput.value,currentShift,id);
    if(r){var raw=String(input.value==null?'':input.value).trim();r.actual=raw===''?null:Number(raw);r.productionFixed=raw!=='';r._productionUpdatedAt=Date.now();}
   }
  }
 }catch(e){}
 try{if(window.store)store._productionUpdatedAt=Date.now();}catch(e){}
 try{if(typeof window.saveStore==='function')window.saveStore();}catch(e){}
 cloudPush();
 setTimeout(cloudPush,120);
 setTimeout(cloudPush,500);
}
var lastProductionKey='';
function productionTick(){
 try{
  var t=document.activeElement;
  if(!t||!t.classList||!t.classList.contains('actual-input'))return;
  var id=sid(t.dataset&&t.dataset.machine||'');
  var d=(typeof dateInput!=='undefined'&&dateInput)?dateInput.value:'';
  var sh=(typeof currentShift!=='undefined')?currentShift:'';
  var val=String(t.value==null?'':t.value);
  var key=d+'|'+sh+'|'+id+'|'+val;
  if(key&&key!==lastProductionKey){lastProductionKey=key;productionPush(t);}
 }catch(e){}
}
function productionEvents(){
 if(window.__acrowImmediateProductionSync)return;
 window.__acrowImmediateProductionSync=true;
 ['input','change','blur'].forEach(function(type){document.addEventListener(type,function(e){var t=e.target;if(t&&t.classList&&t.classList.contains('actual-input'))productionPush(t);},true);});
 setInterval(productionTick,150);
}
function boot(){sync();productionEvents();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(sync,1000);
})();
