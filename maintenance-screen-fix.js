/* ACROW Factory 5 — v218: restore the maintenance/fault screen without touching machine selection */
(function(){
  'use strict';
  function bind(){
    var old=document.getElementById('maintenanceBtn');
    if(!old || old.dataset.v218Maintenance==='1') return;
    var b=old.cloneNode(true);
    b.dataset.v218Maintenance='1';
    b.dataset.v137Bound='1';
    b.dataset.v180='1';
    b.dataset.v181Capture='1';
    old.parentNode.replaceChild(b,old);
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      try{
        if(typeof openMaintenanceView==='function') openMaintenanceView();
        if(typeof renderMaintenance==='function') renderMaintenance();
      }catch(err){ console.error('v218 maintenance screen error',err); }
    },false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  setTimeout(bind,100);
  setTimeout(bind,700);
  setInterval(bind,1500);
})();
