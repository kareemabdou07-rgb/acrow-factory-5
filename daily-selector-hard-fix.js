/* ACROW Factory 5 — v228: save the five manual machines BEFORE the Done button renders */
(function(){
'use strict';
var KEY='acrow_daily_favorites_override_v228';
var IDS=['2','8','9','10','forming-frame'];
function sid(v){return String(v==null?'':v).trim();}
function isFive(id){return IDS.indexOf(sid(id))>=0;}
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x.map(sid):null;}catch(e){return null;}}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function storeSet(a){a=uniq(a);try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}if(typeof store!=='undefined'){store.favorites=a.slice();try{if(typeof saveStore==='function')saveStore();}catch(e){}}}
function base(){var a=read();if(a!==null)return a;if(typeof store!=='undefined'&&Array.isArray(store.favorites))return uniq(store.favorites);return [];}
function getId(cb){if(!cb)return '';var id=cb.getAttribute('data-machine');if(id)return sid(id);var row=cb.closest&&cb.closest('label[data-machine-id]');return row?sid(row.getAttribute('data-machine-id')):'';}
function getFiveFromDom(){var root=document.getElementById('machineSelectList'),a=base();if(!root)return a;root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=getId(cb);if(!isFive(id))return;a=a.filter(function(x){return x!==id;});if(cb.checked)a.push(id);});return uniq(a);}
function enforce(){var a=base(),root=document.getElementById('machineSelectList');if(!root)return;root.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=getId(cb);if(isFive(id))cb.checked=a.indexOf(id)>=0;});}
function findCb(t){if(!t)return null;if(t.matches&&t.matches('#machineSelectList input[type="checkbox"]'))return t;var r=t.closest&&t.closest('#machineSelectList label[data-machine-id]');return r?r.querySelector('input[type="checkbox"]'):null;}
window.addEventListener('click',function(e){
 var cb=findCb(e.target);
 if(cb){var id=getId(cb);if(isFive(id)){e.preventDefault();e.stopImmediatePropagation();var a=base(),next=a.indexOf(id)<0;if(next)a.push(id);else a=a.filter(function(x){return x!==id;});storeSet(a);cb.checked=next;setTimeout(enforce,0);setTimeout(enforce,100);setTimeout(enforce,300);return;}}
 var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;
 if(b){
   /* Critical: update store before the app's own Done handler calls render(). */
   storeSet(getFiveFromDom());
   setTimeout(enforce,50);
   setTimeout(enforce,250);
 }
},true);
window.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=getId(cb);if(!isFive(id))return;e.stopImmediatePropagation();var a=base();if(cb.checked){if(a.indexOf(id)<0)a.push(id);}else a=a.filter(function(x){return x!==id;});storeSet(a);setTimeout(enforce,0);},true);
function hook(){try{if(typeof window.renderMachineSelectList!=='function'||window.renderMachineSelectList.__acrow228)return;var old=window.renderMachineSelectList;var wrapped=function(){var r=old.apply(this,arguments);setTimeout(enforce,0);setTimeout(enforce,80);return r;};wrapped.__acrow228=true;window.renderMachineSelectList=wrapped;}catch(e){}}
function boot(){hook();enforce();[50,150,400,800,1500].forEach(function(t){setTimeout(function(){hook();enforce();},t);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
setInterval(function(){hook();enforce();},300);
})();