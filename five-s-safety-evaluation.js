/* ACROW Factory 5 — 5S/Safety evaluation disabled. */
(function(){'use strict';
function disable(){
 var b=document.getElementById('factoryFiveSSSafetyBtn');
 if(b)b.remove();
 var m=document.getElementById('factoryFiveSSSafetyModal');
 if(m)m.remove();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',disable);else disable();
})();