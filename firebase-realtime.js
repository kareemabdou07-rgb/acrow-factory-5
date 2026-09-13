/* ACROW Factory 5 — shared Firebase realtime data layer */
(function(){
'use strict';
var COLLECTION='acrowFactory5',DOC='store',ready=false,applyingRemote=false,firstSnapshot=true,lastSent='',lastRemote='',lastRemoteFavorites='',timer=null;
var cfg={apiKey:'AIzaSyCGUyuOU0q-Zg5A1LnnH6oIcbJSwgwS9oc',authDomain:'acrow-factory-5.firebaseapp.com',projectId:'acrow-factory-5',storageBucket:'acrow-factory-5.firebasestorage.app',messagingSenderId:'26128829420',appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'};
function js(v){try{return JSON.stringify(v||{});}catch(e){return '{}';}}
function favKey(v){try{return JSON.stringify((Array.isArray(v)?v:[]).map(function(x){return String(x==null?'':x).trim();}).filter(Boolean).sort());}catch(e){return '[]';}}
function localStore(){return typeof store!=='undefined'&&store?store:null;}
function saveLocal(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function renderAll(){try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}try{if(typeof fillDashboardDepts==='function')fillDashboardDepts();}catch(e){}try{if(typeof render==='function')render();}catch(e){}try{if(typeof renderReport==='function')renderReport();}catch(e){}try{if(typeof renderDashboard==='function')renderDashboard();}catch(e){}try{if(typeof renderMaintenance==='function')renderMaintenance();}catch(e){}}
function mergeObjectPreferLocal(remoteObj,localObj){var out=Object.assign({},remoteObj||{});Object.keys(localObj||{}).forEach(function(k){if(!Object.prototype.hasOwnProperty.call(out,k))out[k]=localObj[k];});return out;}
function mergeRecords(remoteRecords,localRecords){var out=Object.assign({},remoteRecords||{});Object.keys(localRecords||{}).forEach(function(k){if(!Object.prototype.hasOwnProperty.call(out,k)||!out[k])out[k]=localRecords[k];});return out;}
function mergeMachineAndPlanData(remote,local,preserveLocalFavorites){
  if(!remote)return local||{};
  if(!local)return remote;
  var out=Object.assign({},remote);
  out.machineCustom=mergeObjectPreferLocal(remote.machineCustom,local.machineCustom);
  out.machineDisabled=Object.assign({},remote.machineDisabled||{},local.machineDisabled||{});
  out.machines=Array.isArray(remote.machines)?remote.machines.slice():[];
  var seen={};out.machines.forEach(function(m){var id=String(m&& (m.id||m.code||m.number||m.machine)||'').trim();if(id)seen[id]=true;});
  (Array.isArray(local.machines)?local.machines:[]).forEach(function(m){var id=String(m&& (m.id||m.code||m.number||m.machine)||'').trim();if(id&&!seen[id]){out.machines.push(m);seen[id]=true;}});
  out.settings=Object.assign({},remote.settings||{},local.settings||{});
  var rids=remote.settings&&Array.isArray(remote.settings.planMachineIds)?remote.settings.planMachineIds:[];
  var lids=local.settings&&Array.isArray(local.settings.planMachineIds)?local.settings.planMachineIds:[];
  out.settings.planMachineIds=Array.from(new Set(rids.concat(lids).map(function(x){return String(x);}))).filter(Boolean);
  var rs=remote.settings&&Array.isArray(remote.settings.planStatusMachineIds)?remote.settings.planStatusMachineIds:[];
  var ls=local.settings&&Array.isArray(local.settings.planStatusMachineIds)?local.settings.planStatusMachineIds:[];
  if(rs.length||ls.length)out.settings.planStatusMachineIds=Array.from(new Set(rs.concat(ls).map(function(x){return String(x);}))).filter(Boolean);
  var rf=Array.isArray(remote.favorites)?remote.favorites:[],lf=Array.isArray(local.favorites)?local.favorites:[];
  out.favorites=preserveLocalFavorites?lf.slice():rf.slice();
  out.records=mergeRecords(remote.records,local.records);
  return out;
}
function mergeFirst(remote,local){
  var out=mergeMachineAndPlanData(remote,local,false);if(!out)return local||{};
  if(local&&local.records&&typeof local.records==='object')out.records=mergeRecords(remote.records,local.records);
  return out;
}
function focusedProductionSnapshot(local){try{var el=document.activeElement;if(!el||!el.classList||!el.classList.contains('actual-input')||typeof dateInput==='undefined')return null;var id=String(el.dataset.machine||'').trim();if(!id)return null;var key=typeof recKey==='function'?recKey(dateInput.value,currentShift,id):(dateInput.value+'_'+currentShift+'_'+id);return {key:key,record:local&&local.records&&local.records[key]?JSON.parse(JSON.stringify(local.records[key])):null,value:el.value};}catch(e){return null;}}
function restoreFocusedProduction(snap){if(!snap)return;try{var el=document.activeElement;if(el&&el.classList&&el.classList.contains('actual-input')){if(snap.record){if(!store.records)store.records={};store.records[snap.key]=snap.record;}el.value=snap.value;}}catch(e){}}
function cloudSave(){if(!ready||applyingRemote||!window.__acrowFirebaseRef)return;var s=localStore();if(!s)return;var p=js(s);if(p===lastSent)return;lastSent=p;window.__acrowFirebaseRef.set({data:s,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(e){console.error('Firebase save failed',e);});}
function queue(){clearTimeout(timer);timer=setTimeout(cloudSave,180);}
function start(){if(!window.firebase||!firebase.initializeApp||!firebase.firestore){console.error('Firebase libraries unavailable');return;}try{if(!firebase.apps.length)firebase.initializeApp(cfg);var db=firebase.firestore(),ref=db.collection(COLLECTION).doc(DOC);window.__acrowFirebaseRef=ref;ready=true;ref.onSnapshot(function(snap){var remote=snap.exists&&snap.data()?snap.data().data:null,local=localStore();if(!remote){if(local){lastSent=js(local);lastRemoteFavorites=favKey(local.favorites);ref.set({data:local,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(console.error);}firstSnapshot=false;return;}var rj=js(remote);if(rj===lastSent||rj===lastRemote){firstSnapshot=false;lastRemoteFavorites=favKey(remote.favorites);return;}var localFavKey=favKey(local&&local.favorites);var preserveLocalFavorites=!firstSnapshot&&localFavKey!==lastRemoteFavorites;var focus=focusedProductionSnapshot(local);applyingRemote=true;try{var merged=firstSnapshot?mergeFirst(remote,local):mergeMachineAndPlanData(remote,local,preserveLocalFavorites);store=merged;restoreFocusedProduction(focus);saveLocal();lastRemote=js(merged);lastRemoteFavorites=favKey(store&&store.favorites);if(firstSnapshot&&lastRemote!==rj){lastSent=lastRemote;ref.set({data:merged,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(console.error);}firstSnapshot=false;if(!focus)renderAll();}finally{applyingRemote=false;}if(lastRemote!==lastSent)queue();},function(e){console.error('Firebase listener failed',e);});setInterval(function(){var s=localStore();if(!s||applyingRemote)return;var now=js(s);if(now!==lastSent)queue();},300);window.addEventListener('beforeunload',function(){try{cloudSave();}catch(e){}});console.log('ACROW Factory 5 Firebase realtime connected');}catch(e){console.error('Firebase startup failed',e);}}
function loadScripts(){var a=document.createElement('script');a.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';a.onload=function(){var f=document.createElement('script');f.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';f.onload=start;document.head.appendChild(f);};document.head.appendChild(a);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadScripts);else loadScripts();
function showBigFaultScreenButton(){var old=document.getElementById('bigFaultScreenButton');if(old)old.remove();var target=null;var els=document.querySelectorAll('button,h1,h2,h3,h4,h5,h6,label,div,p');for(var i=0;i<els.length;i++){var tx=(els[i].innerText||els[i].textContent||'').trim();if(tx.indexOf('اختيار الماكينات المنتجة اليوم')!==-1){target=els[i];break;}}var box=document.createElement('div');box.id='bigFaultScreenButton';box.style.cssText='width:100%;box-sizing:border-box;margin:0 0 12px 0;position:relative;z-index:20;background:#10263a;border:3px solid #0879d1;border-radius:16px;padding:10px;box-shadow:0 8px 22px rgba(0,0,0,.35);direction:rtl;text-align:center;font-family:Tajawal,Arial,sans-serif;';box.innerHTML='<button id="bigFaultOpenBtn" style="width:100%;min-height:68px;border:0;border-radius:12px;background:#0879d1;color:#fff;font-family:inherit;font-size:25px;font-weight:900;cursor:pointer">شاشة الأعطال</button>';if(target&&target.parentNode){target.parentNode.insertBefore(box,target);}else{var main=document.querySelector('main')||document.body;main.insertBefore(box,main.firstChild);}document.getElementById('bigFaultOpenBtn').onclick=function(){window.location.href='fault-screen.html?v=224';};}
function removeBigFaultScreenButton(){var x=document.getElementById('bigFaultScreenButton');if(x)x.remove();}
function looksLikeFaultManagement(){var t=(document.body.innerText||'');return t.indexOf('إدارة الأعطال')!==-1&&(t.indexOf('تسجيل عطل')!==-1||t.indexOf('الأعطال المفتوحة')!==-1||t.indexOf('العطل')!==-1);}
function watchFaultManagement(){var last=false;function scan(){var now=looksLikeFaultManagement();if(now&&!last)showBigFaultScreenButton();if(!now)removeBigFaultScreenButton();last=now;}scan();setInterval(scan,300);if(window.MutationObserver)new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchFaultManagement);else watchFaultManagement();
function repairConfirmation(){if(document.getElementById('acrowRepairToast'))return;var x=document.createElement('div');x.id='acrowRepairToast';x.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#16a34a;color:#fff;border:3px solid #fff;border-radius:18px;padding:22px 34px;font-family:Tajawal,Arial,sans-serif;font-size:28px;font-weight:900;box-shadow:0 15px 45px rgba(0,0,0,.45);text-align:center;direction:rtl;';x.textContent='تم إصلاح العطل';document.body.appendChild(x);try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance('تم إصلاح العطل');u.lang='ar-EG';u.rate=.9;speechSynthesis.speak(u);}catch(e){}setTimeout(function(){x.remove();},2500);}
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;var txt=(b.innerText||b.textContent||'').trim();if(txt.indexOf('تم الإصلاح')!==-1||txt==='إصلاح')setTimeout(repairConfirmation,250);},true);
})();