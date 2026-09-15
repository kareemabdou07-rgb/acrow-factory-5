/* ACROW Factory 5 — production input stable mode
   Important: do not force focus or reopen the Android keyboard.
   Android controls the keyboard; the app must not fight it. */
(function(){
'use strict';
function boot(){
  var inputs=document.querySelectorAll('.actual-input');
  for(var i=0;i<inputs.length;i++){
    try{
      inputs[i].setAttribute('inputmode','numeric');
      inputs[i].setAttribute('autocomplete','off');
      inputs[i].setAttribute('enterkeyhint','done');
    }catch(e){}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

function loadFaultScreen(){
  if(window.__acrowFaultScreenLoaded)return;
  window.__acrowFaultScreenLoaded=true;
  var s=document.createElement('script');
  s.src='./fault-log-screen.js?v=246'; s.async=false; document.head.appendChild(s);
  s.onload=function(){
    if(window.__acrowFaultMediaLoaded)return;
    window.__acrowFaultMediaLoaded=true;
    var m=document.createElement('script'); m.src='./fault-media-details.js?v=246'; m.async=false; document.head.appendChild(m);
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadFaultScreen);else loadFaultScreen();

(function(){
  function mark(input){try{var r=typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,String(input.dataset.machine||'')):null;if(!r)return;r._productionUpdatedAt=Date.now();if(typeof saveStore==='function')saveStore();}catch(e){}}
  document.addEventListener('input',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
  document.addEventListener('change',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
  document.addEventListener('blur',function(e){var x=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(x)mark(x);},true);
})();
})();

/* ACROW Factory 5 — DATA SAFETY */
(function(){
'use strict';
if(window.__acrowDataSafetyLoaded)return;window.__acrowDataSafetyLoaded=true;
var BACKUP_KEY='acrowFactory5_safety_backup_v1',MAX_BACKUP=5*1024*1024;
function meaningful(s){if(!s||typeof s!=='object')return false;try{var keys=Object.keys(s);if(keys.length<2)return false;for(var i=0;i<keys.length;i++){var v=s[keys[i]];if(Array.isArray(v)&&v.length)return true;if(v&&typeof v==='object'&&Object.keys(v).length)return true;}}catch(e){}return false;}
function snapshot(){try{if(typeof store==='undefined'||!meaningful(store))return;var raw=JSON.stringify(store);if(raw.length>MAX_BACKUP)return;localStorage.setItem(BACKUP_KEY,raw);localStorage.setItem(BACKUP_KEY+'_time',String(Date.now()));}catch(e){}}
function restoreIfWiped(){try{if(typeof store==='undefined'||meaningful(store))return false;var raw=localStorage.getItem(BACKUP_KEY);if(!raw)return false;var old=JSON.parse(raw);if(!meaningful(old))return false;window.store=old;return true;}catch(e){return false;}}
function protectSave(){try{if(typeof saveStore!=='function'||saveStore.__acrowSafetyWrapped)return;var old=saveStore;var wrapped=function(){var restored=restoreIfWiped();if(!restored&&typeof store!=='undefined'&&!meaningful(store))return;var result=old.apply(this,arguments);snapshot();return result;};wrapped.__acrowSafetyWrapped=true;window.saveStore=wrapped;}catch(e){}}
function run(){restoreIfWiped();protectSave();snapshot();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();setTimeout(run,500);setTimeout(run,1500);setInterval(function(){protectSave();},2000);
})();

/* ACROW Factory 5 — efficiency reasons enhancement: duration + multi-day reports/Pareto */
(function(){
'use strict';
if(window.__acrowEfficiencyReasonEnhancementLoaded)return;window.__acrowEfficiencyReasonEnhancementLoaded=true;
var s=document.createElement('script');s.src='./efficiency-reasons-enhancement.js?v=2';s.async=false;document.head.appendChild(s);
})();
