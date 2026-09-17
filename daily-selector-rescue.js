/* ACROW Factory 5 — daily selector rescue v4 */
(function(){
'use strict';
function S(){return typeof store!=='undefined'&&store?store:null;}
function R(){return document.getElementById('machineSelectList');}
function ID(cb){return String(cb&&((cb.getAttribute&&cb.getAttribute('data-machine'))||cb.getAttribute&&cb.getAttribute('data-machine-id')||cb.value||'')||'').trim();}
function save(){var s=S(),r=R();if(!s||!r)return;var a=Array.from(r.querySelectorAll('input[type="checkbox"]')).filter(function(x){return x.checked;}).map(ID).filter(Boolean);a=Array.from(new Set(a));if(!s.settings)s.settings={};s.favorites=a.slice();s.settings.dailyMachineIds=a.slice();s.settings.dailyMachineIdsConfigured=true;try{localStorage.setItem('acrow_daily_manual_selection_v242',JSON.stringify(a));}catch(e){}try{window.__acrowDailyFavoritesDirty=true;if(typeof saveStore==='function')saveStore();}catch(e){}try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}}
function sync(){var s=S(),r=R();if(!s||!r)return;var a=Array.isArray(s.settings&&s.settings.dailyMachineIds)?s.settings.dailyMachineIds:(Array.isArray(s.favorites)?s.favorites:[]);a=a.map(String);r.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=ID(cb);if(id)cb.checked=a.indexOf(id)>=0;});}
function open(){var m=document.getElementById('machineSelectModal');if(!m)return;try{if(typeof renderMachineSelectList==='function')renderMachineSelectList();}catch(e){}m.classList.add('open');m.style.display='flex';m.style.visibility='visible';m.style.opacity='1';m.style.pointerEvents='auto';m.style.zIndex='100000';setTimeout(sync,40);}
function close(){var m=document.getElementById('machineSelectModal');if(!m)return;save();m.classList.remove('open');m.style.display='none';try{if(typeof render==='function')render();}catch(e){}}
function all(on){var r=R();if(!r)return;r.querySelectorAll('input[type="checkbox"]').forEach(function(cb){cb.checked=on;});save();sync();}
var suppressClick=false;
function target(e){var t=e.target&&e.target.closest?e.target.closest('#selectMachinesBtn,#doneMachineSelectBtn,#selectAllMachinesLink,#clearAllMachinesLink,#machineSelectList input[type="checkbox"]'):null;return t;}
function delegated(e){var t=target(e);if(!t)return;if(e.type==='pointerdown'||e.type==='touchstart'||e.type==='mousedown'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();suppressClick=true;if(t.id==='selectMachinesBtn'){open();return false;}if(t.id==='doneMachineSelectBtn'){close();return false;}if(t.id==='selectAllMachinesLink'){all(true);return false;}if(t.id==='clearAllMachinesLink'){all(false);return false;}if(t.matches('input[type="checkbox"]')){t.checked=!t.checked;try{t.dispatchEvent(new Event('change',{bubbles:true}));}catch(x){}save();return false;}}
if(e.type==='click'&&suppressClick){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();suppressClick=false;return false;}}
function bind(){if(window.__acrowDailyRescueV4)return;window.__acrowDailyRescueV4=true;document.addEventListener('pointerdown',delegated,true);document.addEventListener('touchstart',delegated,{capture:true,passive:false});document.addEventListener('mousedown',delegated,true);document.addEventListener('click',delegated,true);setInterval(function(){sync();},1500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
