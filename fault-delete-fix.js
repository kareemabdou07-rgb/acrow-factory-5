/* ACROW Factory 5 v68 — repair and delete fault buttons */
(function(){
'use strict';
if(window.__acrowFaultRepairDeleteV68)return;
window.__acrowFaultRepairDeleteV68=true;
function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim()}
/* Existing fault repair/delete code remains loaded by the original file. */
/* ACROW: direct daily-production custom-machine injection */
(function(){
 function collect(){
  var out=[],seen={};
  function add(m,key){
   if(!m)return;
   if(typeof m==='string')m={id:m,name:m};
   if(typeof m!=='object')return;
   var id=norm(m.number||m.code||m.id||m.machine||key||'');
   if(!id||seen[id])return;
   var name=norm(m.name||m.type||m.machineName||m.title||id)||id;
   seen[id]=1;out.push({id:id,name:name});
  }
  try{
   if(window.store){
    ['machines','machineCustom','customMachines'].forEach(function(k){
     var s=store[k];
     if(Array.isArray(s))s.forEach(function(v){add(v)});
     else if(s&&typeof s==='object')Object.keys(s).forEach(function(k){var v=s[k];if(v&&typeof v==='object'&&!v.id&&!v.number&&!v.code)v.id=k;add(v,k)})
    });
   }
  }catch(e){}
  return out;
 }
 function inject(){
  var box=document.getElementById('machineSelectList');if(!box)return;
  var data=collect();if(!data.length)return;
  var existing={};box.querySelectorAll('.fav-checkbox').forEach(function(c){existing[norm(c.getAttribute('data-machine')||c.value)]=1});
  var missing=data.filter(function(m){return !existing[m.id]});if(!missing.length)return;
  var group=box.querySelector('.fav-machine-custom-group');
  if(!group){group=document.createElement('div');group.className='fav-machine-custom-group';var title=document.createElement('div');title.className='fav-group-title';title.textContent='الماكينات المضافة';group.appendChild(title);box.appendChild(group)}
  missing.forEach(function(m){
   var label=document.createElement('label');label.className='fav-checkbox-row';
   var cb=document.createElement('input');cb.type='checkbox';cb.className='fav-checkbox';cb.setAttribute('data-machine',m.id);cb.value=m.id;
   try{if(window.store&&Array.isArray(store.favorites)&&store.favorites.indexOf(m.id)>=0)cb.checked=true}catch(e){}
   label.appendChild(cb);label.appendChild(document.createTextNode(' '+m.id+' — '+m.name));group.appendChild(label);
  });
 }
 function boot(){inject();setTimeout(inject,200);setTimeout(inject,600);setTimeout(inject,1200);setInterval(inject,2000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 if(window.MutationObserver)new MutationObserver(function(){setTimeout(inject,40)}).observe(document.documentElement,{childList:true,subtree:true});
})();
})();