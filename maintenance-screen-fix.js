/* ACROW Factory 5 — v219: force restore visible maintenance/fault button and screen */
(function(){
  'use strict';
  function ensureButton(){
    var b=document.getElementById('maintenanceBtn');
    var host=document.querySelector('.topbar .shift-controls');
    if(!b && host){
      b=document.createElement('button');
      b.id='maintenanceBtn';
      b.type='button';
      b.className='select-machines-btn top-main-action';
      b.title='إدارة الأعطال';
      b.textContent='إدارة الأعطال';
      host.appendChild(b);
    }
    if(!b) return;
    b.style.setProperty('display','flex','important');
    b.style.setProperty('visibility','visible','important');
    b.style.setProperty('opacity','1','important');
    b.style.setProperty('pointer-events','auto','important');
    if(b.dataset.v219Bound==='1') return;
    b.dataset.v219Bound='1';
    b.dataset.v137Bound='1';
    b.dataset.v180='1';
    b.dataset.v181Capture='1';
    b.addEventListener('click',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      try{
        if(typeof openMaintenanceView==='function') openMaintenanceView();
        if(typeof renderMaintenance==='function') renderMaintenance();
        var d=document.getElementById('maintenanceDashboard');
        if(d){d.style.setProperty('display','block','important');d.scrollIntoView({behavior:'smooth',block:'start'});}
      }catch(err){console.error('v219 maintenance error',err);}
    },true);
  }
  function boot(){ensureButton();setTimeout(ensureButton,100);setTimeout(ensureButton,500);setTimeout(ensureButton,1200);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  if(window.MutationObserver) new MutationObserver(ensureButton).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(ensureButton,1500);
})();
