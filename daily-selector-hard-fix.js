/* ACROW Factory 5 — v226: last five daily-production machines are fully independent */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override_v226';
var TOGGLE_IDS=['2','8','9','10','forming-frame'];
function sid(v){return String(v==null?'':v).trim();}
function isToggle(id){return TOGGLE_IDS.indexOf(sid(id))>=0;}
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x.map(sid):null;}catch(e){return null;}}
function write(a){try{localStorage.setItem(KEY,JSON.stringify(a.map(sid)));}catch(e){}}
function current(){var a=read();if(a!==null)return a;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return store.favorites.map(sid);return [];}
function setState(a){a=Array.from(new Set(a.map(sid).filter(Boolean)));write(a);if(typeof store!=='undefined'){store.favorites=a.slice();try{if(typeof saveStore==='function')saveStore();}catch(e){}}}
function getId(cb){if(!cb)return '';var id=cb.getAttribute('data-machine');if(id)return sid(id);var row=cb.closest&&cb.closest('label[data-machine-id]');return row?sid(row.getAttribute('data-machine-id')):'';}
function findCb(target){if(!target)return null;if(target.matches&&target.matches('#machineSelectList input[type="checkbox"]'))return target;var row=target.closest&&target.closest('#machineSelectList label[data-machine-id]');return row?row.querySelector('input[type="checkbox"]'):null;}
function enforce(){var a=current();var root=document.getElementById('machineSelectList');if(!root)return;root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=getId(cb);if(isToggle(id))cb.checked=a.indexOf(id)>=0;});}
window.addEventListener('click',function(e){
 var cb=findCb(e.target);if(!cb)return;var id=getId(cb);if(!isToggle(id))return;
 e.preventDefault();e.stopImmediatePropagation();
 var a=current();var next=a.indexOf(id)<0;
 if(next){if(a.indexOf(id)<0)a.push(id);}else{a=a.filter(function(x){return sid(x)!==id;});}
 setState(a);cb.checked=next;setTimeout(enforce,0);setTimeout(enforce,80);setTimeout(enforce,250);
},true);
window.addEventListener('change',function(e){
 var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=getId(cb);if(!isToggle(id))return;
 e.stopImmediatePropagation();var a=current();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return sid(x)!==id;});setState(a);setTimeout(enforce,0);
},true);
function hook(){try{if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow226)return;var old=window.renderMachineSelectList;var wrapped=function(){var r=old.apply(this,arguments);setTimeout(enforce,0);setTimeout(enforce,60);return r;};wrapped.__acrow226=true;window.renderMachineSelectList=wrapped;}catch(e){}}
function boot(){hook();enforce();[50,150,400,800,1500].forEach(function(t){setTimeout(function(){hook();enforce();},t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(function(){hook();enforce();},250);
})();
