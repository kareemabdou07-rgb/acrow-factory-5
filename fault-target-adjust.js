/* ACROW Factory 5 — target + fault time adjustment */
(function(){
'use strict';
function targetFor(machine){
  if(!machine)return null;
  var t=Number(machine.target);
  try{if((!isFinite(t)||t<=0)&&typeof store!=='undefined'&&store&&store.machineCustom){var c=store.machineCustom[String(machine.id)];if(c&&c.target!==null&&c.target!==undefined&&c.target!=='')t=Number(c.target);}}catch(e){}
  return isFinite(t)&&t>0?t:null;
}
function faultMinutes(rec){try{return Math.max(0,(rec&&Array.isArray(rec.faults)?rec.faults:[]).reduce(function(s,f){return s+(Number(f&&f.mins)||0);},0));}catch(e){return 0;}}
window.effectiveTarget=function(machine,rec,shift){var base=targetFor(machine);if(!base)return null;var stdHours=typeof shiftHoursFor==='function'?Number(shiftHoursFor(shift))||8:8;var hours=rec&&rec.hours!==null&&rec.hours!==undefined?Number(rec.hours):stdHours;if(!isFinite(hours)||hours<=0)return 0;var available=Math.max(0,hours-faultMinutes(rec)/60);return Math.round(base*(available/stdHours));};
window.__acrowTargetFor=targetFor;
})();
