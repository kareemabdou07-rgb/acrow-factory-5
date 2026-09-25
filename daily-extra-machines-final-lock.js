/* ACROW Factory 5 — FINAL daily extra-machine selection lock
   Fixes the five optional machines returning after unchecking:
   2, 8, 9, 10, forming-frame.
   The user's checkbox choice is authoritative and is persisted locally + in store.
*/
(function(){
'use strict';
var IDS=['2','8','9','10','forming-frame'];
var KEY='acrow_daily_extra_lock_v1';

function id(v){return String(v==null?'':v).trim();}
function uniq(a){return Array.from(new Set((a||[]).map(id).filter(Boolean)));}
function getStore(){return (typeof window.store!=='undefined'&&window.store)?window.store:null;}
function getSettings(){
  var s=getStore(); if(!s)return null;
  if(!s.settings)s.settings={};
  return s.settings;
}
function loadLock(){
  try{
    var x=JSON.parse(localStorage.getItem(KEY)||'null');
    if(Array.isArray(x))return uniq(x).filter(function(v){return IDS.indexOf(v)>=0;});
  }catch(e){}
  var st=getSettings();
  if(st&&Array.isArray(st.dailyMachineIdsLocked))
    return uniq(st.dailyMachineIdsLocked).filter(function(v){return IDS.indexOf(v)>=0;});
  if(st&&Array.isArray(st.dailyMachineIds)&&st.dailyMachineIdsConfigured===true)
    return uniq(st.dailyMachineIds).filter(function(v){return IDS.indexOf(v)>=0;});
  var s=getStore();
  return s&&Array.isArray(s.favorites)
    ? uniq(s.favorites).filter(function(v){return IDS.indexOf(v)>=0;}) : [];
}
function saveLock(chosen){
  chosen=uniq(chosen).filter(function(v){return IDS.indexOf(v)>=0;});
  try{localStorage.setItem(KEY,JSON.stringify(chosen));}catch(e){}
  var st=getSettings();
  if(st){
    st.dailyMachineIdsLocked=chosen.slice();
    st.dailyMachineIds=chosen.slice();
    st.dailyMachineIdsConfigured=true;
  }
}
function boxes(){
  var root=document.getElementById('machineSelectList');
  return root?Array.from(root.querySelectorAll('input[type="checkbox"]')):[];
}
function boxId(cb){
  return id(cb&&((cb.getAttribute('data-machine'))||(cb.getAttribute('data-machine-id'))||cb.value));
}
function readDomForFive(){
  var root=document.getElementById('machineSelectList');
  if(!root)return null;
  var seen={};
  var found=0;
  root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
    var v=boxId(cb);
    if(IDS.indexOf(v)<0)return;
    seen[v]=!!cb.checked; found++;
  });
  if(!found)return null;
  var old=loadLock(), out=[];
  IDS.forEach(function(v){
    if(Object.prototype.hasOwnProperty.call(seen,v)){
      if(seen[v])out.push(v);
    }else if(old.indexOf(v)>=0){
      out.push(v);
    }
  });
  return out;
}
function apply(){
  var root=document.getElementById('machineSelectList');
  if(!root)return;
  var lock=loadLock(), set={};
  lock.forEach(function(v){set[v]=true;});
  root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
    var v=boxId(cb);
    if(IDS.indexOf(v)>=0)cb.checked=!!set[v];
  });
}
function updateFromDom(){
  var next=readDomForFive();
  if(next===null)return;
  saveLock(next);
  var s=getStore();
  if(s){
    s.favorites=uniq(s.favorites||[]).filter(function(v){return IDS.indexOf(v)<0;}).concat(next);
    saveLock(next);
    try{if(typeof window.saveStore==='function')window.saveStore();}catch(e){}
    try{if(typeof window.__acrowCloudSaveNow==='function')window.__acrowCloudSaveNow();}catch(e){}
  }
  setTimeout(apply,20);
  setTimeout(apply,100);
}
function bind(){
  var root=document.getElementById('machineSelectList');
  if(!root)return;
  if(root.dataset.acrowFinalFiveBound!=='1'){
    root.dataset.acrowFinalFiveBound='1';
    root.addEventListener('change',function(e){
      var cb=e.target&&e.target.closest?e.target.closest('input[type="checkbox"]'):null;
      if(!cb||IDS.indexOf(boxId(cb))<0)return;
      setTimeout(updateFromDom,0);
      setTimeout(updateFromDom,40);
    },true);
    root.addEventListener('click',function(e){
      var cb=e.target&&e.target.closest?e.target.closest('input[type="checkbox"]'):null;
      if(!cb||IDS.indexOf(boxId(cb))<0)return;
      setTimeout(updateFromDom,30);
    },true);
  }
}
function boot(){
  bind();
  var s=getStore();
  if(s){
    var lock=loadLock();
    if(!s.favorites)s.favorites=[];
    s.favorites=uniq(s.favorites).filter(function(v){return IDS.indexOf(v)<0;}).concat(lock);
    saveLock(lock);
    try{if(typeof window.saveStore==='function')window.saveStore();}catch(e){}
  }
  apply();
  setTimeout(apply,100);
  setTimeout(apply,400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.MutationObserver){
  new MutationObserver(function(){bind();apply();}).observe(document.documentElement,{childList:true,subtree:true});
}
setInterval(function(){bind();apply();},700);
})();