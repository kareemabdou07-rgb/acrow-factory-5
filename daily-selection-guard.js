/* ACROW Factory 5 — v216 authoritative daily-machine selection guard */
(function(){
'use strict';
function sid(v){return String(v==null?'':v).trim();}
function mark(){window.__acrowDailyFavoritesDirty=true;}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowFirebaseRef!=='undefined'&&typeof window.__acrowFirebaseRef){/* realtime layer notices the dirty flag */}}catch(e){}}
function sync(){try{var box=document.getElementById('machineSelectList');if(!box||typeof store==='undefined')return;var fav=Array.isArray(store.favorites)?store.favorites.map(sid):[];box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var row=cb.closest('label[data-machine-id]');if(!row)return;cb.checked=fav.indexOf(sid(row.getAttribute('data-machine-id')))>=0;});}catch(e){}}
function allIds(){try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))return MACHINES.map(function(m){return sid(m&&m.id);}).filter(Boolean);}catch(e){}return [];}
document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var row=cb.closest('label[data-machine-id]');if(!row||typeof store==='undefined')return;var id=sid(row.getAttribute('data-machine-id'));if(!Array.isArray(store.favorites))store.favorites=[];if(cb.checked){if(store.favorites.map(sid).indexOf(id)<0)store.favorites.push(id);}else{store.favorites=store.favorites.filter(function(x){return sid(x)!==id;});}mark();save();setTimeout(sync,0);},true);
document.addEventListener('click',function(e){var el=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!el||typeof store==='undefined')return;if(el.id==='clearAllMachinesLink'){store.favorites=[];mark();save();setTimeout(sync,30);setTimeout(sync,200);}else{store.favorites=allIds();mark();save();setTimeout(sync,30);}},true);
function boot(){sync();[50,150,400,800,1500].forEach(function(t){setTimeout(sync,t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(sync,700);
})();
