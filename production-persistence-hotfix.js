/* ACROW Factory 5 — targeted production persistence conflict fix */
(function(){
'use strict';
var lastByKey={};
function key(input){
  if(!input) return '';
  var id=String(input.dataset&&input.dataset.machine||'').trim();
  var d=typeof dateInput!=='undefined'&&dateInput?String(dateInput.value||''):'';
  var s=typeof currentShift!=='undefined'?String(currentShift||''):'';
  return d+'|'+s+'|'+id;
}
function mark(input){
  try{
    var r=typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,String(input.dataset.machine||'')):null;
    if(!r)return;
    var now=Date.now();
    r._productionUpdatedAt=now;
    lastByKey[key(input)]=now;
    if(typeof saveStore==='function')saveStore();
  }catch(e){}
}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(input)mark(input);},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(input)mark(input);},true);
document.addEventListener('blur',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(input)mark(input);},true);
window.__acrowProductionPersistenceHotfix={lastByKey:lastByKey};
})();
