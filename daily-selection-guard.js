/* ACROW Factory 5 — v239: working daily machine selection for all machines */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v239';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function getStore(){return typeof store!=='undefined'&&store?store:null;}
function getSettings(){var s=getStore();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function read(){var st=getSettings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds);try{var x=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(x))return uniq(x);}catch(e){}var s=getStore();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function saveNow(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function persist(a){a=uniq(a);var st=getSettings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}var s=getStore();if(s)s.favorites=a.slice();window.__acrowDailyFavoritesDirty=true;saveNow();}
function idOf(cb){return cb?sid(cb.getAttribute('data-machine')):'';}
function getCb(t){if(!t)return null;if(t.matches&&t.matches('#machineSelectList input[type="checkbox"][data-machine]'))return t;var row=t.closest&&t.closest('#machineSelectList label, #machineSelectList .fav-checkbox-row, #machineSelectList [data-machine-id]');return row&&row.querySelector?row.querySelector('input[type="checkbox"][data-machine]'):null;}
function sync(){var box=document.getElementById('machineSelectList'),m=read();if(!box)return;box.querySelectorAll('input[type="checkbox"][data-machine]').forEach(function(cb){cb.checked=m.indexOf(idOf(cb))>=0;});}
function toggle(e){var cb=getCb(e.target);if(!cb)return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();var m=read(),id=idOf(cb);var on=m.indexOf(id)<0;if(on)m.push(id);else m=m.filter(function(x){return x!==id;});cb.checked=on;persist(m);setTimeout(sync,0);setTimeout(sync,100);setTimeout(sync,300);}
function done(e){var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(!b)return;setTimeout(function(){var box=document.getElementById('machineSelectList');if(!box)return;var a=Array.from(box.querySelectorAll('input[type="checkbox"][data-machine]')).filter(function(cb){return cb.checked;}).map(idOf);persist(a);},0);}
window.addEventListener('click',toggle,true);
window.addEventListener('click',done,true);
function boot(){sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(sync,800);
})();
