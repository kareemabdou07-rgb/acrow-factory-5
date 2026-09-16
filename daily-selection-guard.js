/* ACROW Factory 5 — v232: stable daily machine selection */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v232';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function getStore(){return typeof store!=='undefined'&&store?store:null;}
function getSettings(){var s=getStore();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function readLocal(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?uniq(x):null;}catch(e){return null;}}
function writeLocal(a){try{localStorage.setItem(KEY,JSON.stringify(uniq(a)));}catch(e){}}
function read(){var st=getSettings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds);var l=readLocal();return l===null?null:l;}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function persist(a){a=uniq(a);var st=getSettings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}writeLocal(a);window.__acrowDailyFavoritesDirty=true;save();if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}
function apply(){try{var s=getStore(),m=read();if(!s||m===null)return;s.favorites=m.slice();window.__acrowDailyFavoritesDirty=true;save();if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function dom(){try{var box=document.getElementById('machineSelectList'),m=read();if(!box||m===null)return;box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=sid(cb.getAttribute('data-machine'));if(id)cb.checked=m.indexOf(id)>=0;});}catch(e){}}
function initial(){var m=read();if(m!==null)return m;var s=getStore();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function setOne(id,on){id=sid(id);var m=initial();if(on){if(m.indexOf(id)<0)m.push(id);}else m=m.filter(function(x){return x!==id;});persist(m);apply();dom();}
function done(){var box=document.getElementById('machineSelectList');if(!box)return;var m=[];box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=sid(cb.getAttribute('data-machine'));if(id&&cb.checked)m.push(id);});persist(m);apply();dom();}
document.addEventListener('click',function(e){var cb=e.target&&e.target.closest?e.target.closest('#machineSelectList input[type="checkbox"]'):null;if(cb){e.preventDefault();e.stopImmediatePropagation();var id=sid(cb.getAttribute('data-machine'));if(id)setOne(id,initial().indexOf(id)<0);return;}var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(b){e.preventDefault();e.stopImmediatePropagation();done();}},true);
document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;e.preventDefault();e.stopImmediatePropagation();var id=sid(cb.getAttribute('data-machine'));if(id)setOne(id,!!cb.checked);},true);
document.addEventListener('click',function(e){var el=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!el)return;e.preventDefault();e.stopImmediatePropagation();if(el.id==='clearAllMachinesLink')persist([]);else{var box=document.getElementById('machineSelectList'),m=[];if(box)box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=sid(cb.getAttribute('data-machine'));if(id)m.push(id);});persist(m);}apply();dom();},true);
function start(){var m=read();if(m===null){m=initial();persist(m);}apply();dom();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
setInterval(dom,500);
})();
