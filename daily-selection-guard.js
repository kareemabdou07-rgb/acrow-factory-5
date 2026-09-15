/* ACROW Factory 5 — v217 daily selection + local recovery guard */
(function(){
'use strict';
var BACKUP_KEY='acrowFactory5_critical_backup_v1';
function sid(v){return String(v==null?'':v).trim();}
function mark(){window.__acrowDailyFavoritesDirty=true;}
function criticalSnapshot(){
  try{
    if(typeof store==='undefined'||!store)return null;
    var rec={};
    Object.keys(store.records||{}).forEach(function(k){
      var r=store.records[k];
      if(!r||typeof r!=='object')return;
      var x={};
      if(r.actual!==undefined&&r.actual!==null&&r.actual!=='')x.actual=r.actual;
      if(r._productionUpdatedAt)x._productionUpdatedAt=r._productionUpdatedAt;
      if(Object.keys(x).length)rec[k]=x;
    });
    var mc={};
    Object.keys(store.machineCustom||{}).forEach(function(id){
      var m=store.machineCustom[id];
      if(!m||typeof m!=='object')return;
      if(m.target!==undefined&&m.target!==null&&m.target!=='')mc[id]={target:m.target};
    });
    return {version:1,savedAt:Date.now(),records:rec,machineCustom:mc,settings:JSON.parse(JSON.stringify(store.settings||{})),favorites:Array.isArray(store.favorites)?store.favorites.slice():[]};
  }catch(e){return null;}
}
function saveBackup(){try{var s=criticalSnapshot();if(s)localStorage.setItem(BACKUP_KEY,JSON.stringify(s));}catch(e){}}
function restoreBackup(){
  try{
    if(typeof store==='undefined'||!store)return;
    var raw=localStorage.getItem(BACKUP_KEY);if(!raw)return;
    var b=JSON.parse(raw);if(!b||b.version!==1)return;
    if(!store.records)store.records={};
    Object.keys(b.records||{}).forEach(function(k){
      var old=store.records[k]||{};
      var x=b.records[k]||{};
      var oldTime=Number(old._productionUpdatedAt||0),newTime=Number(x._productionUpdatedAt||0);
      if(x.actual!==undefined&&x.actual!==null&&x.actual!==''&&(!old.actual||newTime>=oldTime)){
        store.records[k]=Object.assign({},old,x);
      }
    });
    if(!store.machineCustom)store.machineCustom={};
    Object.keys(b.machineCustom||{}).forEach(function(id){
      var x=b.machineCustom[id];if(!x)return;
      store.machineCustom[id]=Object.assign({},store.machineCustom[id]||{},x);
    });
    if(b.settings&&typeof b.settings==='object')store.settings=Object.assign({},b.settings,store.settings||{});
    if(Array.isArray(b.favorites)&&!Array.isArray(store.favorites))store.favorites=b.favorites.slice();
    try{if(typeof saveStore==='function')saveStore();}catch(e){}
  }catch(e){}
}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}saveBackup();try{if(typeof window.__acrowFirebaseRef!=='undefined'&&typeof window.__acrowFirebaseRef){/* realtime layer notices the dirty flag */}}catch(e){}}
function sync(){try{var box=document.getElementById('machineSelectList');if(!box||typeof store==='undefined')return;var fav=Array.isArray(store.favorites)?store.favorites.map(sid):[];box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var row=cb.closest('label[data-machine-id]');if(!row)return;cb.checked=fav.indexOf(sid(row.getAttribute('data-machine-id')))>=0;});}catch(e){}}
function allIds(){try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))return MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);}catch(e){}return [];}
document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var row=cb.closest('label[data-machine-id]');if(!row||typeof store==='undefined')return;var id=sid(row.getAttribute('data-machine-id'));if(!Array.isArray(store.favorites))store.favorites=[];if(cb.checked){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);}else{store.favorites=store.favorites.filter(function(x){return sid(x)!==id;});}mark();save();setTimeout(sync,0);},true);
document.addEventListener('click',function(e){var el=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!el||typeof store==='undefined')return;if(el.id==='clearAllMachinesLink'){store.favorites=[];mark();save();setTimeout(sync,30);setTimeout(sync,200);}else{store.favorites=allIds();mark();save();setTimeout(sync,30);}},true);
function boot(){restoreBackup();saveBackup();sync();[50,150,400,800,1500].forEach(function(t){setTimeout(sync,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(function(){sync();saveBackup();},700);
})();
