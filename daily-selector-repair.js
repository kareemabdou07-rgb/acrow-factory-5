/* ACROW Factory 5 — daily selector repair v240 */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v240';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function S(){return typeof store!=='undefined'&&store?store:null;}
function box(){return document.getElementById('machineSelectList');}
function idOf(cb){if(!cb)return '';var id=cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id')||cb.value;if(id)return sid(id);var r=cb.closest&&cb.closest('label,.fav-checkbox-row,[data-machine-id]');return r?sid(r.getAttribute('data-machine-id')||r.getAttribute('data-machine')||''):'';}
function boxes(){var b=box();return b?Array.from(b.querySelectorAll('input[type="checkbox"]')):[];}
function current(){var s=S();if(s&&s.settings&&Array.isArray(s.settings.dailyMachineIds))return uniq(s.settings.dailyMachineIds);try{var x=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('acrow_daily_manual_selection_v239')||'null');if(Array.isArray(x))return uniq(x);}catch(e){}return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function save(a){a=uniq(a);var s=S();if(s){if(!s.settings)s.settings={};s.settings.dailyMachineIds=a.slice();s.settings.dailyMachineIdsConfigured=true;s.favorites=a.slice();}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}window.__acrowDailyFavoritesDirty=true;try{if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function sync(){var a=current();boxes().forEach(function(cb){var id=idOf(cb);if(id)cb.checked=a.indexOf(id)>=0;});}
function collect(){return boxes().filter(function(cb){return cb.checked;}).map(idOf).filter(Boolean);}
function onClick(e){var b=box();if(!b||!b.contains(e.target))return;var cb=e.target.closest&&e.target.closest('input[type="checkbox"],label');if(!cb)return;setTimeout(function(){save(collect());sync();},40);}
function onDone(e){var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(b)setTimeout(function(){save(collect());},40);}
document.addEventListener('click',onClick,true);
document.addEventListener('click',onDone,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
setInterval(sync,700);
})();
