/* ACROW Factory 5 — monthly plan machine selection lock
   The monthly-plan selection is global/persistent and changes only by explicit user action.
*/
(function(){
  'use strict';
  var KEY='planMachineIds';
  var bound=false;
  function ready(){return window.store && store.settings && typeof window.saveStore==='function';}
  function normalize(){
    if(!ready()) return null;
    var ids=Array.isArray(store.settings[KEY]) ? store.settings[KEY].map(String) : null;
    if(!ids) return null;
    store.settings[KEY]=ids;
    return ids;
  }
  function renderPlanList(){
    try{ if(typeof window.renderPlanMachineSelectList==='function') window.renderPlanMachineSelectList(); }catch(e){}
  }
  function renderStatusList(){
    var root=document.getElementById('planStatusMachineSelect');
    if(!root || !ready()) return;
    var ids=new Set((normalize()||[]).map(String));
    var machines=Array.isArray(window.MACHINES)?MACHINES.filter(function(m){return !(store.machineDisabled&&store.machineDisabled[m.id]);}):[];
    root.innerHTML=machines.map(function(m){
      return '<label style="display:block;margin:5px 0;cursor:pointer;"><input type="checkbox" class="plan-status-machine-checkbox" value="'+String(m.id).replace(/"/g,'&quot;')+'" '+(ids.has(String(m.id))?'checked':'')+'> '+String(m.name||m.id)+' ('+String(m.id)+')</label>';
    }).join('') || '<div>لا توجد ماكينة</div>';
  }
  function renderBoth(){
    renderPlanList();
    renderStatusList();
  }
  function saveSelection(ids){
    if(!ready()) return;
    store.settings[KEY]=Array.from(new Set((ids||[]).map(String)));
    /* Do not key this selection by date/month/day. */
    store.settings.planMachineIdsConfigured=true;
    saveStore();
  }
  function bind(){
    if(!ready()) return;
    normalize();
    var a=document.getElementById('planMachineSelectList');
    if(a && !a.dataset.planLockBound){
      a.dataset.planLockBound='1';
      a.addEventListener('change',function(e){
        var cb=e.target.closest&&e.target.closest('.plan-machine-checkbox');
        if(!cb)return;
        var ids=new Set((normalize()||[]).map(String));
        if(cb.checked)ids.add(String(cb.value)); else ids.delete(String(cb.value));
        saveSelection(Array.from(ids));
        renderStatusList();
      },true);
    }
    var b=document.getElementById('planStatusMachineSelect');
    if(b && !b.dataset.planLockBound){
      b.dataset.planLockBound='1';
      b.addEventListener('change',function(e){
        var cb=e.target.closest&&e.target.closest('.plan-status-machine-checkbox');
        if(!cb)return;
        var ids=new Set((normalize()||[]).map(String));
        if(cb.checked)ids.add(String(cb.value)); else ids.delete(String(cb.value));
        saveSelection(Array.from(ids));
        renderPlanList();
      },true);
    }
  }
  function guard(){
    if(!ready()) return;
    /* Re-render only to restore the saved checked state. Never create or clear a selection. */
    bind();
  }
  function boot(){
    if(!ready()){setTimeout(boot,300);return;}
    bind();
    /* Important: no date listener and no interval that changes planMachineIds. */
    setTimeout(bind,500);
    setTimeout(bind,1500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
