/* ACROW Factory 5 v18 — production confirmation pulse only. Does not alter machines or production logic. */
(function(){
'use strict';
var STYLE_ID='acrow-production-pulse-v18';
function install(){
  if(document.getElementById(STYLE_ID)) return;
  var s=document.createElement('style'); s.id=STYLE_ID;
  s.textContent='.acrow-production-pulse-v18{animation:acrowProductionPulseV18 1.05s ease-in-out 0s 3;}@keyframes acrowProductionPulseV18{0%{filter:brightness(1);box-shadow:0 0 0 0 rgba(37,229,143,0)}35%{filter:brightness(1.55);box-shadow:0 0 0 5px rgba(37,229,143,.28),0 0 24px rgba(37,229,143,.5)}70%{filter:brightness(1.15);box-shadow:0 0 0 2px rgba(37,229,143,.14),0 0 10px rgba(37,229,143,.22)}100%{filter:brightness(1);box-shadow:0 0 0 0 rgba(37,229,143,0)}}';
  document.head.appendChild(s);
}
function pulse(input){
  if(!input || String(input.value||'').trim()==='') return;
  install();
  var card=input.closest('.machine-card');
  var targets=[input,card].filter(Boolean);
  targets.forEach(function(el){el.classList.remove('acrow-production-pulse-v18');void el.offsetWidth;el.classList.add('acrow-production-pulse-v18');setTimeout(function(){el.classList.remove('acrow-production-pulse-v18');},3300);});
}
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;if(input)pulse(input);},true);
document.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var input=e.target&&e.target.closest?e.target.closest('input.actual-input'):null;if(input)pulse(input);},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();