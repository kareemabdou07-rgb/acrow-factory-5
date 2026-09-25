/* ACROW Factory 5 — single authoritative machine chooser
   One source of truth: store.favorites
   No extra-machine lock or competing chooser logic. */
(function(){
  'use strict';

  function getStore(){
    try { return (typeof store !== 'undefined' && store) ? store : null; } catch(e){ return null; }
  }
  function getMachines(){
    try { return (typeof MACHINES !== 'undefined' && Array.isArray(MACHINES)) ? MACHINES : []; } catch(e){ return []; }
  }
  function save(){
    try { if(typeof saveStore === 'function') saveStore(); } catch(e){}
    try { if(typeof window.__acrowCloudSaveNow === 'function') window.__acrowCloudSaveNow(); } catch(e){}
  }
  function normalize(){
    const s=getStore(), ms=getMachines();
    if(!s) return [];
    if(!s.settings) s.settings={};
    const valid=new Set(ms.map(m=>String(m.id)));
    const current=Array.isArray(s.favorites)?s.favorites:[];
    s.favorites=Array.from(new Set(current.map(String).filter(id=>valid.has(id))));
    s.settings.dailyMachineIds=s.favorites.slice();
    s.settings.dailyMachineIdsConfigured=true;
    return s.favorites;
  }
  function machineName(m){
    try { return typeof machineDisplayName==='function' ? machineDisplayName(m) : String(m.id)+' — '+String(m.name||''); }
    catch(e){ return String(m.id)+' — '+String(m.name||''); }
  }
  function renderChooser(){
    const root=document.getElementById('machineSelectList');
    const s=getStore(), ms=getMachines();
    if(!root || !s || !ms.length) return;
    const selected=new Set(normalize());
    const deps=(typeof DEPARTMENTS!=='undefined' && Array.isArray(DEPARTMENTS)) ? DEPARTMENTS : [];
    let html='';
    deps.forEach(d=>{
      const list=ms.filter(m=>m.dept===d.id);
      if(!list.length) return;
      html+='<div style="margin-bottom:14px;"><div class="fav-group-title">'+d.name+'</div>';
      list.forEach(m=>{
        const id=String(m.id);
        html+='<label class="fav-checkbox-row"><input type="checkbox" class="fav-checkbox" data-machine="'+id+'" '+(selected.has(id)?'checked':'')+'>'+machineName(m)+'</label>';
      });
      html+='</div>';
    });
    root.innerHTML=html;
  }
  function openChooser(e){
    e.preventDefault(); e.stopImmediatePropagation();
    renderChooser();
    const modal=document.getElementById('machineSelectModal');
    if(modal) modal.classList.add('open');
  }
  function doneChooser(e){
    e.preventDefault(); e.stopImmediatePropagation();
    normalize(); save();
    const modal=document.getElementById('machineSelectModal');
    if(modal) modal.classList.remove('open');
    try { if(typeof render==='function') render(); } catch(err){}
  }
  function changeMachine(e){
    const cb=e.target && e.target.closest ? e.target.closest('.fav-checkbox') : null;
    if(!cb) return;
    e.stopImmediatePropagation();
    const s=getStore();
    if(!s) return;
    if(!s.settings) s.settings={};
    const id=String(cb.getAttribute('data-machine')||'');
    const set=new Set((Array.isArray(s.favorites)?s.favorites:[]).map(String));
    if(cb.checked) set.add(id); else set.delete(id);
    s.favorites=Array.from(set);
    s.settings.dailyMachineIds=s.favorites.slice();
    s.settings.dailyMachineIdsConfigured=true;
    save();
  }
  function selectAll(e){
    e.preventDefault(); e.stopImmediatePropagation();
    const s=getStore(), ms=getMachines();
    if(!s) return;
    if(!s.settings) s.settings={};
    s.favorites=Array.from(new Set(ms.map(m=>String(m.id))));
    s.settings.dailyMachineIds=s.favorites.slice();
    s.settings.dailyMachineIdsConfigured=true;
    save();
    renderChooser();
  }
  function clearAll(e){
    e.preventDefault(); e.stopImmediatePropagation();
    const s=getStore();
    if(!s) return;
    if(!s.settings) s.settings={};
    s.favorites=[];
    s.settings.dailyMachineIds=[];
    s.settings.dailyMachineIdsConfigured=true;
    save();
    renderChooser();
  }
  function bind(){
    const root=document.getElementById('machineSelectList');
    if(root && root.dataset.acrowSingleChooser!=='1'){
      root.dataset.acrowSingleChooser='1';
      root.addEventListener('change',changeMachine,true);
    }
    const open=document.getElementById('selectMachinesBtn');
    if(open && open.dataset.acrowSingleChooser!=='1'){
      open.dataset.acrowSingleChooser='1';
      open.addEventListener('click',openChooser,true);
    }
    const done=document.getElementById('doneMachineSelectBtn');
    if(done && done.dataset.acrowSingleChooser!=='1'){
      done.dataset.acrowSingleChooser='1';
      done.addEventListener('click',doneChooser,true);
    }
    const all=document.getElementById('selectAllMachinesLink');
    if(all && all.dataset.acrowSingleChooser!=='1'){
      all.dataset.acrowSingleChooser='1';
      all.addEventListener('click',selectAll,true);
    }
    const clear=document.getElementById('clearAllMachinesLink');
    if(clear && clear.dataset.acrowSingleChooser!=='1'){
      clear.dataset.acrowSingleChooser='1';
      clear.addEventListener('click',clearAll,true);
    }
  }
  function boot(){
    /* Retire the old five-machine lock so it can never resurrect old choices. */
    try { localStorage.removeItem('acrow_daily_extra_lock_v1'); } catch(e){}
    const s=getStore();
    if(s && s.settings){
      try { delete s.settings.dailyMachineIdsLocked; } catch(e){}
    }
    bind();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
  setTimeout(bind,100);
  setTimeout(bind,500);
  setTimeout(bind,1200);
  setInterval(bind,1000);
})();