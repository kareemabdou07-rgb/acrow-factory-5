/* ACROW Factory 5 — v230: daily five machine selection is persistent */
(function(){
'use strict';
var KEY='acrow_daily_manual_five_v230';
var IDS=['2','8','9','10','forming-frame'];
function sid(v){return String(v==null?'':v).trim();}
function isFive(id){return IDS.indexOf(sid(id))>=0;}
function uniq(a){return Array.from(new Set((a||[]).map(sid).filter(Boolean)));}
function getStore(){return typeof store!=='undefined'&&store?store:null;}
function getSettings(){var s=getStore();if(!s)return null;if(!s.settings)s.settings={};return s.settings;}
function readLocal(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?uniq(x):null;}catch(e){return null;}}
function writeLocal(a){try{localStorage.setItem(KEY,JSON.stringify(uniq(a)));}catch(e){}}
function read(){var st=getSettings();if(st&&st.dailyMachineIdsConfigured===true&&Array.isArray(st.dailyMachineIds))return uniq(st.dailyMachineIds).filter(isFive);var l=readLocal();return l===null?null:l.filter(isFive);}
function save(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function persist(a){a=uniq(a).filter(isFive);var st=getSettings();if(st){st.dailyMachineIds=a.slice();st.dailyMachineIdsConfigured=true;}writeLocal(a);save();}
function fav(){var s=getStore();return s&&Array.isArray(s.favorites)?uniq(s.favorites):[];}
function apply(){try{var s=getStore(),m=read();if(!s||m===null)return;s.favorites=uniq(fav().filter(function(x){return !isFive(x);}).concat(m));save();}catch(e){}}
function idOf(cb){return sid(cb&&cb.getAttribute('data-machine'));}
function dom(){try{var box=document.getElementById('machineSelectList'),m=read();if(!box||m===null)return;box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=idOf(cb);if(isFive(id))cb.checked=m.indexOf(id)>=0;});}catch(e){}}
function initial(){var m=read();if(m!==null)return m;return IDS.filter(function(id){return fav().indexOf(id)>=0;});}
function setOne(id,on){var m=initial();m=on?(m.indexOf(id)<0?m.concat(id):m):m.filter(function(x){return x!==id;});persist(m);apply();dom();}
function done(){var box=document.getElementById('machineSelectList');if(!box)return;var m=[];box.querySelectorAll('input[type="checkbox"]').forEach(function(cb){var id=idOf(cb);if(isFive(id)&&cb.checked)m.push(id);});persist(m);apply();dom();}
document.addEventListener('click',function(e){
 var cb=e.target&&e.target.closest?e.target.closest('#machineSelectList input[type="checkbox"]'):null;
 if(cb&&isFive(idOf(cb))){e.preventDefault();e.stopImmediatePropagation();var id=idOf(cb),m=initial();setOne(id,m.indexOf(id)<0);return;}
 var b=e.target&&e.target.closest?e.target.closest('#doneMachineSelectBtn'):null;
 if(b){done();setTimeout(function(){apply();dom();},50);setTimeout(function(){apply();dom();},300);}
},true);
document.addEventListener('change',function(e){var cb=e.target;if(!cb||!cb.matches||!cb.matches('#machineSelectList input[type="checkbox"]'))return;var id=idOf(cb);if(!isFive(id))return;e.stopImmediatePropagation();setOne(id,!!cb.checked);},true);
document.addEventListener('click',function(e){var el=e.target&&e.target.closest?e.target.closest('#clearAllMachinesLink,#selectAllMachinesLink'):null;if(!el)return;if(el.id==='clearAllMachinesLink')persist([]);else persist(IDS.slice());apply();dom();},true);
function start(){var m=read();if(m!==null){persist(m);apply();dom();}else{var x=initial();persist(x);apply();dom();}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
setInterval(function(){var m=read();if(m!==null){apply();dom();}},250);
})();
