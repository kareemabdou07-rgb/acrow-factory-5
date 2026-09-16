/* ACROW Factory 5 — v229: last five daily machines only */
(function(){
'use strict';
var KEY='acrow_daily_manual_five_v229';
var IDS=['2','8','9','10','forming-frame'];
function sid(v){return String(v==null?'':v).trim();}
function isFive(id){return IDS.indexOf(sid(id))>=0;}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function read(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?uniq(x):null;}catch(e){return null;}}
function write(a){try{localStorage.setItem(KEY,JSON.stringify(uniq(a)));}catch(e){}}
function fav(){return typeof store!=='undefined'&&store&&Array.isArray(store.favorites)?uniq(store.favorites):[];}
function apply(){try{if(typeof store==='undefined'||!store)return;var m=read();if(m===null)return;store.favorites=uniq(fav().filter(function(x){return !isFive(x);}).concat(m));if(typeof saveStore==='function')saveStore();}catch(e){}}
function idOf(cb){return sid(cb&&cb.getAttribute('data-machine'));}
function dom(){try{var box=document.getElementById('machineSelectList'),m=read();if(!box||m===null)return;box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=idOf(cb);if(isFive(id))cb.checked=m.indexOf(id)>=0;});}catch(e){}}
function initial(){var m=read();if(m!==null)return m;return IDS.filter(function(id){return fav().indexOf(id)>=0;});}
function setOne(id,on){var m=initial();m=on?(m.indexOf(id)<0?m.concat(id):m):m.filter(function(x){return x!==id;});write(m);apply();dom();}
function done(){var box=document.getElementById('machineSelectList');if(!box)return;var m=[];box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=idOf(cb);if(isFive(id)&&cb.checked)m.push(id);});write(m);apply();dom();}
document.addEventListener('click',function(e){
 var cb=e.target&&e.target.closest?e.target.closest('#machineSelectList input[type="checkbox"]'):null;
 if(cb&&isFive(idOf(cb))){e.preventDefault();e.stopImmediatePropagation();var id=idOf(cb),m=initial();setOne(id,m.indexOf(id)<0);return;}
 var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;
 if(b){done();setTimeout(function(){apply();dom();},50);setTimeout(function(){apply();dom();},300);}
},true);
document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=idOf(cb);if(!isFive(id))return;e.stopImmediatePropagation();setOne(id,!!cb.checked);},true);
document.addEventListener('click',function(e){var el=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!el)return;if(el.id==='clearAllMachinesLink')write([]);else write(IDS.slice());apply();dom();},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){apply();dom();});else{apply();dom();}
setInterval(function(){apply();dom();},250);
})();
