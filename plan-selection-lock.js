/* ACROW Factory 5 — monthly plan machine selection lock */
(function(){
'use strict';
function S(){return typeof store!=='undefined'&&store?store:null}
function I(s){return s&&s.settings&&Array.isArray(s.settings.planMachineIds)?s.settings.planMachineIds.map(String):[]}
function C(s){return !!(s&&s.settings&&s.settings.planMachineIdsConfigured===true)}
function save(){try{if(typeof saveStore==='function')saveStore()}catch(e){}}
function restore(){var s=S();if(!C(s))return;var set=new Set(I(s));document.querySelectorAll('#planStatusMachineSelect input.plan-status-machine-checkbox,#planMachineSelectList input.plan-machine-checkbox').forEach(function(x){x.checked=set.has(String(x.value))})}
function mark(){var s=S();if(!s)return;if(!s.settings)s.settings={};s.settings.planMachineIdsConfigured=true;s.settings.planMachineIds=I(s);s.settings.planStatusMachineIds=I(s).slice();save()}
function wrap(){if(typeof window.renderPlanStatus!=='function'||window.__planSelectionLocked)return;var old=window.renderPlanStatus;window.renderPlanStatus=function(){var s=S(),locked=C(s),before=locked?I(s):null;old.apply(this,arguments);s=S();if(locked&&s){s.settings.planMachineIds=before.slice();s.settings.planMachineIdsConfigured=true;s.settings.planStatusMachineIds=before.slice();restore();save()}};window.__planSelectionLocked=true}
function bind(){var s=S();if(!s||!s.settings)return;if(!C(s)&&I(s).length)mark();document.querySelectorAll('#planStatusMachineSelect input.plan-status-machine-checkbox,#planMachineSelectList input.plan-machine-checkbox').forEach(function(cb){if(cb.dataset.planLock)return;cb.dataset.planLock='1';cb.addEventListener('change',function(){var st=S();if(!st)return;if(!st.settings)st.settings={};var selected=[];document.querySelectorAll('#planStatusMachineSelect input.plan-status-machine-checkbox:checked,#planMachineSelectList input.plan-machine-checkbox:checked').forEach(function(x){var v=String(x.value);if(selected.indexOf(v)<0)selected.push(v)});st.settings.planMachineIds=selected;st.settings.planStatusMachineIds=selected.slice();st.settings.planMachineIdsConfigured=true;save();setTimeout(restore,0)},true)});wrap();restore()}
function start(){bind();setTimeout(bind,100);setTimeout(bind,500);setInterval(bind,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start()
})();
