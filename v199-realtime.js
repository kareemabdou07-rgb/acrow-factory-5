/* ACROW Factory 5 — v199 real-time UI sync (no refresh) */
(function(){
  'use strict';
  var started=false, lastRemote='';
  function stable(v){try{return JSON.stringify(v||{});}catch(e){return '';}}
  function rerender(remote){
    try{
      if(typeof store!=='undefined') store=remote;
      try{localStorage.setItem('ACROW_FACTORY_5_STORE',JSON.stringify(remote));}catch(e){}
      var active=document.activeElement;
      var editing=!!(active&&(active.tagName==='INPUT'||active.tagName==='TEXTAREA'||active.tagName==='SELECT'));
      if(!editing){
        if(typeof rebuildMachines==='function')rebuildMachines();
        if(typeof fillDashboardDepts==='function')fillDashboardDepts();
        if(typeof render==='function')render();
        if(typeof renderReport==='function')renderReport();
        if(typeof renderDashboard==='function')renderDashboard();
        if(typeof renderMaintenance==='function')renderMaintenance();
      }
      if(typeof bindProduction==='function')bindProduction();
    }catch(e){console.error('v199 realtime render',e);}
  }
  function attach(){
    if(started)return;
    var sync=window.__acrowV198Sync;
    if(!sync||!sync.ref||typeof sync.ref.onSnapshot!=='function')return;
    started=true;
    sync.ref.onSnapshot(function(snap){
      if(!snap.exists)return;
      var remote=snap.data()&&snap.data().data;
      if(!remote)return;
      var key=stable(remote);
      if(!key||key===lastRemote)return;
      lastRemote=key;
      rerender(remote);
    },function(err){console.error('v199 realtime listener',err);});
  }
  var tries=0;
  var timer=setInterval(function(){
    attach();
    tries++;
    if(started||tries>120)clearInterval(timer);
  },250);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();
