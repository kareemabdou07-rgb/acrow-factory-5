/* ACROW Factory 5 — v238: stable selection for five daily machines */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v238';
var FIXED={'2':1,'8':1,'9':1,'10':1,'forming-frame':1};
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function getStore(){return typeof store!=='undefined'&&store?store:null;}
function getSettings(){var s=getStore();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function read(){var st=getSettings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds);try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?uniq(x):null;}catch(e){return null;}}
function initial(){var m=read();if(m!==null)return m;var s=getStore();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function saveNow(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function persist(a){a=uniq(a);var st=getSettings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}var s=getStore();if(s)s.favorites=a.slice();window.__acrowDailyFavoritesDirty=true;saveNow();}
function idOf(cb){return cb?sid(cb.getAttribute('data-machine')):'';}
function getCb(t){if(!t)return null;if(t.matches&&t.matches('#machineSelectList input[type="checkbox"]'))return t;var row=t.closest&&t.closest('#machineSelectList label, #machineSelectList .fav-checkbox-row, #machineSelectList [data-machine-id]');return row&&row.querySelector?row.querySelector('input[type="checkbox"]'):null;}
function sync(){var box=document.getElementById('machineSelectList'),m=read();if(!box||m===null)return;box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=idOf(cb);if(FIXED[id])cb.checked=m.indexOf(id)>=0;});}
function handle(e){var cb=getCb(e.target);if(!cb)return;var id=idOf(cb);if(!FIXED[id])return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();var m=initial();var on=m.indexOf(id)<0;if(on)m.push(id);else m=m.filter(function(x){return x!==id;});cb.checked=on;persist(m);setTimeout(sync,60);setTimeout(sync,250);}
window.addEventListener('click',handle,true);
function boot(){sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();