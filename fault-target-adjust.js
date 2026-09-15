/* ACROW Factory 5 — fault downtime is excluded from the production target */
(function(){
'use strict';
function faultMinutes(rec){
  try{return Math.max(0,(rec&&Array.isArray(rec.faults)?rec.faults:[]).reduce(function(s,f){return s+(Number(f&&f.mins)||0);},0));}catch(e){return 0;}
}
window.effectiveTarget=function(machine,rec,shift){
  if(!machine||!machine.target)return null;
  var stdHours=typeof shiftHoursFor==='function'?Number(shiftHoursFor(shift))||8:8;
  var hours=rec&&rec.hours!==null&&rec.hours!==undefined?Number(rec.hours):stdHours;
  if(!isFinite(hours)||hours<=0)return 0;
  var downtime=faultMinutes(rec)/60;
  var available=Math.max(0,hours-downtime);
  return Math.round(Number(machine.target)*(available/stdHours));
};
})();
