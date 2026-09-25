/* ACROW — authoritative daily machine chooser
   Fix: every checkbox is independently selectable/unselectable and the saved list
   is exactly what appears in production. */
(function(){
'use strict';
function S(){ try{ return (typeof store!=='undefined'&&store) ? store : null; }catch(e){ return null; } }
function A(){ var s=S(); if(!s)return null; if(!s.settings)s.settings={}; return s; }
function ids(){ var s=S(); return s&&Array.isArray(MACHINES)?MACHINES.map(function(m){return String(m.id)}):[]; }
function save(){
  try{ if(typeof saveStore==='function') saveStore(); }catch(e){}
  try{ if(typeof __acrowCloudSaveNow==='function') __acrowCloudSaveNow(); }catch(e){}
}
function normalize(){
  var s=A(); if(!s)return [];
  var valid=new Set(ids());
  s.favorites=Array.from(new Set((Array.isArray(s.favorites)?s.favorites:[]).map(String).filter(function(x){return valid.has(x)})));
  s.settings.dailyMachineIds=s.favorites.slice();
  s.settings.dailyMachineIdsConfigured=true;
  return s.favorites;
}
function renderChooser(){
  var root=document.getElementById('machineSelectList'), s=S();
  if(!root||!s||!Array.isArray(MACHINES))return;
  var selected=new Set(normalize()), html='';
  var deps=Array.isArray(DEPARTMENTS)?DEPARTMENTS:[];
  deps.forEach(function(d){
    var ms=MACHINES.filter(function(m){return m.dept===d.id});
    if(!ms.length)return;
    html+='<div style="margin-bottom:14px;"><div class="fav-group-title">'+d.name+'</div>';
    ms.forEach(function(m){
      var id=String(m.id);
      html+='<label class="fav-checkbox-row"><input type="checkbox" class="fav-checkbox" data-machine="'+id+'" '+(selected.has(id)?'checked':'')+'>'+ (typeof machineDisplayName==='function'?machineDisplayName(m):(id+' — '+m.name))+'</label>';
    });
    html+='</div>';
  });
  root.innerHTML=html;
  root.dataset.acrowAuthoritative='1';
}
function bind(){
  var root=document.getElementById('machineSelectList');
  if(root && root.dataset.acrowAuthoritativeBound!=='1'){
    root.dataset.acrowAuthoritativeBound='1';
    root.addEventListener('change',function(e){
      var cb=e.target&&e.target.closest?e.target.closest('.fav-checkbox'):null;
      if(!cb)return;
      e.stopImmediatePropagation();
      var s=A(); if(!s)return;
      var id=String(cb.getAttribute('data-machine')||'');
      var set=new Set((Array.isArray(s.favorites)?s.favorites:[]).map(String));
      if(cb.checked)set.add(id); else set.delete(id);
      s.favorites=Array.from(set);
      s.settings.dailyMachineIds=s.favorites.slice();
      s.settings.dailyMachineIdsConfigured=true;
      save();
    },true);
  }
  var open=document.getElementById('selectMachinesBtn');
  if(open && open.dataset.acrowAuthoritative!=='1'){
    open.dataset.acrowAuthoritative='1';
    open.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();renderChooser();document.getElementById('machineSelectModal').classList.add('open');},true);
  }
  var done=document.getElementById('doneMachineSelectBtn');
  if(done && done.dataset.acrowAuthoritative!=='1'){
    done.dataset.acrowAuthoritative='1';
    done.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();normalize();save();document.getElementById('machineSelectModal').classList.remove('open');if(typeof render==='function')render();},true);
  }
  var clear=document.getElementById('clearAllMachinesLink');
  if(clear && clear.dataset.acrowAuthoritative!=='1'){
    clear.dataset.acrowAuthoritative='1';
    clear.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var s=A();if(!s)return;s.favorites=[];s.settings.dailyMachineIds=[];s.settings.dailyMachineIdsConfigured=true;save();renderChooser();if(typeof window.render==='function')window.render();},true);
  }
  var all=document.getElementById('selectAllMachinesLink');
  if(all && all.dataset.acrowAuthoritative!=='1'){
    all.dataset.acrowAuthoritative='1';
    all.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var s=A();if(!s)return;s.favorites=ids();s.settings.dailyMachineIds=s.favorites.slice();s.settings.dailyMachineIdsConfigured=true;save();renderChooser();if(typeof window.render==='function')window.render();},true);
  }
}
function boot(){ bind(); if(document.getElementById('machineSelectList')) renderChooser(); }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setTimeout(boot,100);setTimeout(boot,500);setTimeout(boot,1200);
setInterval(bind,1000);
})();
