/* ACROW Factory 5 — daily machine selector repair */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v239';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function S(){return typeof store!=='undefined'&&store?store:null;}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function current(){var s=S();if(s&&s.settings&&Array.isArray(s.settings.dailyMachineIds))return uniq(s.settings.dailyMachineIds);try{var x=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(x))return uniq(x);}catch(e){}return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function persist(a){a=uniq(a);var s=S();if(s){if(!s.settings)s.settings={};s.settings.dailyMachineIds=a.slice();s.settings.dailyMachineIdsConfigured=true;s.favorites=a.slice();}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}window.__acrowDailyFavoritesDirty=true;save();}
function box(){return document.getElementById('machineSelectList');}
function checkboxes(){var b=box();return b?Array.from(b.querySelectorAll('input[type="checkbox"][data-machine]')):[];}
function sync(){var a=current();checkboxes().forEach(function(cb){cb.checked=a.indexOf(sid(cb.getAttribute('data-machine')))>=0;});}
function selectedFromDom(){return checkboxes().filter(function(cb){return cb.checked;}).map(function(cb){return sid(cb.getAttribute('data-machine'));}).filter(Boolean);}
function onClick(e){var t=e.target, b=box();if(!b||!b.contains(t))return;var cb=t.closest&&t.closest('input[type="checkbox"][data-machine]');if(!cb)return;setTimeout(function(){var a=selectedFromDom();persist(a);sync();},0);}
function onDone(e){var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(!b)return;var a=selectedFromDom();if(a.length||checkboxes().length)persist(a);}
function bind(){if(!box())return;sync();}
document.addEventListener('click',onClick,true);
document.addEventListener('click',onDone,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
setInterval(bind,500);
})();
