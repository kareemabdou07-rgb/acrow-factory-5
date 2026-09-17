/* ACROW Factory 5 — daily selector repair v241 */
(function(){
'use strict';
var KEY='acrow_daily_manual_selection_v241';
function sid(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function S(){return typeof store!=='undefined'&&store?store:null;}
function box(){return document.getElementById('machineSelectList');}
function idOf(cb){if(!cb)return '';var id=cb.getAttribute('data-machine')||cb.getAttribute('data-machine-id')||cb.value;if(id)return sid(id);var r=cb.closest&&cb.closest('label,.fav-checkbox-row,[data-machine-id]');return r?sid(r.getAttribute('data-machine-id')||r.getAttribute('data-machine')||''):'';}
function boxes(){var b=box();return b?Array.from(b.querySelectorAll('input[type="checkbox"]')):[];}
function collect(){return uniq(boxes().filter(function(cb){return cb.checked;}).map(idOf).filter(Boolean));}
function save(a){a=uniq(a);var s=S();if(s){if(!s.settings)s.settings={};s.settings.dailyMachineIds=a.slice();s.settings.dailyMachineIdsConfigured=true;s.favorites=a.slice();}try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}try{window.__acrowDailyFavoritesDirty=true;if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function onChange(e){var cb=e.target&&e.target.closest?e.target.closest('#machineSelectList input[type="checkbox"]'):null;if(!cb)return;save(collect());}
function onDone(e){var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;if(!b)return;save(collect());}
document.addEventListener('change',onChange,true);
document.addEventListener('click',onDone,true);
})();
