/* ACROW Factory 5 — monthly plan machine selection lock v3 */
(function(){
'use strict';
function S(){return typeof store!=='undefined'&&store?store:null}
function I(s){return s&&s.settings&&Array.isArray(s.settings.planMachineIds)?s.settings.planMachineIds.map(String):[]}
function C(s){return !!(s&&s.settings&&s.settings.planMachineIdsConfigured===true)}
function save(){try{if(typeof saveStore==='function')saveStore()}catch(e){}}
function is114(cb){if(!cb)return false;var v=String(cb.value||'').trim();if(v==='114')return true;var d=String(cb.dataset&&((cb.dataset.machine||cb.dataset.id||cb.dataset.code)||'')).trim();if(d==='114')return true;var p=cb.closest('label,.machine-option,.plan-machine-option,.checkbox-row,.machine-row,div');var t=p?String(p.textContent||''):'';return /114\s*[-–—:]?\s*فريم\s*كوباية|فريم\s*كوباية\s*[-–—:]?\s*114/i.test(t)}
function checkboxId(cb){return is114(cb)?'114':String(cb.value||'').trim()}
function boxes(){return Array.prototype.slice.call(document.querySelectorAll('#planStatusMachineSelect input.plan-status-machine-checkbox,#planMachineSelectList input.plan-machine-checkbox'))}
function restore(){var s=S();if(!C(s))return;var set=new Set(I(s));boxes().forEach(function(x){x.checked=set.has(checkboxId(x))})}
function mark(){var s=S();if(!s)return;if(!s.settings)s.settings={};s.settings.planMachineIdsConfigured=true;s.settings.planMachineIds=I(s);s.settings.planStatusMachineIds=I(s).slice();save()}
function wrap(){if(typeof window.renderPlanStatus!=='function'||window.__planSelectionLocked)return;var old=window.renderPlanStatus;window.renderPlanStatus=function(){var s=S(),locked=C(s),before=locked?I(s):null;old.apply(this,arguments);s=S();if(locked&&s){s.settings.planMachineIds=before.slice();s.settings.planMachineIdsConfigured=true;s.settings.planStatusMachineIds=before.slice();restore();save()}};window.__planSelectionLocked=true}
function bind(){var s=S();if(!s||!s.settings)return;if(!C(s)&&I(s).length)mark();boxes().forEach(function(cb){if(cb.dataset.planLock)return;cb.dataset.planLock='1';cb.addEventListener('change',function(){var st=S();if(!st)return;if(!st.settings)st.settings={};var selected=[];boxes().forEach(function(x){if(x.checked){var v=checkboxId(x);if(v&&selected.indexOf(v)<0)selected.push(v)}});st.settings.planMachineIds=selected;st.settings.planStatusMachineIds=selected.slice();st.settings.planMachineIdsConfigured=true;save();setTimeout(restore,0)},true)});wrap();restore()}
function start(){bind();setTimeout(bind,100);setTimeout(bind,500);setTimeout(bind,1200);setInterval(bind,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start()
})();