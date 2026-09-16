/* ACROW Factory 5 — v233: fix only the affected daily-machine toggles */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v233';
var FIXED={'2':1,'8':1,'9':1,'10':1,'forming-frame':1};
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function getStore(){return typeof store!=='undefined'&&store?store:null;}
function getSettings(){var s=getStore();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function readLocal(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?uniq(x):null;}catch(e){return null;}}
function writeLocal(a){try{localStorage.setItem(KEY,JSON.stringify(uniq(a)));}catch(e){}}
function read(){var st=getSettings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds);var l=readLocal();return l===null?null:l;}
function initial(){var m=read();if(m!==null)return m;var s=getStore();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function saveNow(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function persist(a){a=uniq(a);var st=getSettings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}writeLocal(a);window.__acrowDailyFavoritesDirty=true;var s=getStore();if(s)s.favorites=a.slice();saveNow();}
function syncDom(){try{var box=document.getElementById('machineSelectList'),m=read();if(!box||m===null)return;box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=sid(cb.getAttribute('data-machine'));if(id&&FIXED[id])cb.checked=m.indexOf(id)>=0;});}catch(e){}}
function toggle(id){id=sid(id);if(!FIXED[id])return;var m=initial();var on=m.indexOf(id)<0;if(on)m.push(id);else m=m.filter(function(x){return x!==id;});persist(m);syncDom();}
function handle(e){var row=e.target&&e.target.closest?e.target.closest('#machineSelectList .fav-checkbox-row'):null;if(!row)return;var cb=row.querySelector('input[type="checkbox"]');if(!cb)return;var id=sid(cb.getAttribute('data-machine'));if(!FIXED[id])return;e.preventDefault();e.stopImmediatePropagation();toggle(id);}
document.addEventListener('click',handle,true);
function start(){syncDom();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
