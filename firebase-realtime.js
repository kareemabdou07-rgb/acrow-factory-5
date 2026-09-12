/* ACROW Factory 5 — shared Firebase realtime data layer */
(function(){
'use strict';
var COLLECTION='acrowFactory5',DOC='store',ready=false,applyingRemote=false,firstSnapshot=true,lastSent='',lastRemote='',timer=null;
var cfg={apiKey:'AIzaSyCGUyuOU0q-Zg5A1LnnH6oIcbJSwgwS9oc',authDomain:'acrow-factory-5.firebaseapp.com',projectId:'acrow-factory-5',storageBucket:'acrow-factory-5.firebasestorage.app',messagingSenderId:'26128829420',appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'};
function js(v){try{return JSON.stringify(v||{});}catch(e){return '{}';}}
function localStore(){return typeof store!=='undefined'&&store?store:null;}
function saveLocal(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}
function renderAll(){try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}try{if(typeof fillDashboardDepts==='function')fillDashboardDepts();}catch(e){}try{if(typeof render==='function')render();}catch(e){}try{if(typeof renderReport==='function')renderReport();}catch(e){}try{if(typeof renderDashboard==='function')renderDashboard();}catch(e){}try{if(typeof renderMaintenance==='function')renderMaintenance();}catch(e){}}
function mergeFirst(remote,local){if(!remote)return local||{};if(!local)return remote;var out=Object.assign({},remote);if(local.records&&typeof local.records==='object'){out.records=Object.assign({},remote.records||{});Object.keys(local.records).forEach(function(k){if(!Object.prototype.hasOwnProperty.call(out.records,k))out.records[k]=local.records[k];});}return out;}
function focusedProductionSnapshot(local){try{var el=document.activeElement;if(!el||!el.classList||!el.classList.contains('actual-input')||typeof dateInput==='undefined')return null;var id=String(el.dataset.machine||'').trim();if(!id)return null;var key=typeof recKey==='function'?recKey(dateInput.value,currentShift,id):(dateInput.value+'_'+currentShift+'_'+id);return {key:key,record:local&&local.records&&local.records[key]?JSON.parse(JSON.stringify(local.records[key])):null,value:el.value};}catch(e){return null;}}
function restoreFocusedProduction(snap){if(!snap)return;try{var el=document.activeElement;if(el&&el.classList&&el.classList.contains('actual-input')){if(snap.record){if(!store.records)store.records={};store.records[snap.key]=snap.record;}el.value=snap.value;}}catch(e){}}
function cloudSave(){if(!ready||applyingRemote||!window.__acrowFirebaseRef)return;var s=localStore();if(!s)return;var p=js(s);if(p===lastSent)return;lastSent=p;window.__acrowFirebaseRef.set({data:s,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(e){console.error('Firebase save failed',e);});}
function queue(){clearTimeout(timer);timer=setTimeout(cloudSave,180);}
function start(){if(!window.firebase||!firebase.initializeApp||!firebase.firestore){console.error('Firebase libraries unavailable');return;}try{if(!firebase.apps.length)firebase.initializeApp(cfg);var db=firebase.firestore(),ref=db.collection(COLLECTION).doc(DOC);window.__acrowFirebaseRef=ref;ready=true;ref.onSnapshot(function(snap){var remote=snap.exists&&snap.data()?snap.data().data:null,local=localStore();if(!remote){if(local){lastSent=js(local);ref.set({data:local,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(console.error);}firstSnapshot=false;return;}var rj=js(remote);if(rj===lastSent||rj===lastRemote){firstSnapshot=false;return;}if(firstSnapshot){remote=mergeFirst(remote,local);rj=js(remote);firstSnapshot=false;}var focus=focusedProductionSnapshot(local);applyingRemote=true;try{store=remote;restoreFocusedProduction(focus);saveLocal();lastRemote=rj;if(!focus)renderAll();}finally{applyingRemote=false;}if(rj!==lastSent)queue();},function(e){console.error('Firebase listener failed',e);});setInterval(function(){var s=localStore();if(!s||applyingRemote)return;var now=js(s);if(now!==lastSent)queue();},300);window.addEventListener('beforeunload',function(){try{cloudSave();}catch(e){}});console.log('ACROW Factory 5 Firebase realtime connected');}catch(e){console.error('Firebase startup failed',e);}}
function loadScripts(){var a=document.createElement('script');a.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';a.onload=function(){var f=document.createElement('script');f.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';f.onload=start;document.head.appendChild(f);};document.head.appendChild(a);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadScripts);else loadScripts();

function showBigFaultScreenButton(){
  setTimeout(function(){
    var old=document.getElementById('bigFaultScreenButton');
    if(old)old.remove();
    var box=document.createElement('div');
    box.id='bigFaultScreenButton';
    box.style.cssText='position:fixed;top:76px;left:10px;right:10px;z-index:99990;background:#10263a;border:2px solid #0879d1;border-radius:16px;padding:10px;box-shadow:0 12px 35px rgba(0,0,0,.35);direction:rtl;text-align:center;font-family:Tajawal,Arial,sans-serif;';
    box.innerHTML='<button id="bigFaultOpenBtn" style="width:100%;min-height:68px;border:0;border-radius:12px;background:#0879d1;color:#fff;font-family:inherit;font-size:24px;font-weight:900;cursor:pointer">شاشة الأعطال</button>';
    document.body.appendChild(box);
    document.getElementById('bigFaultOpenBtn').onclick=function(){window.location.href='fault-screen.html?v=221';};
  },100);
}
function openFaultManagementDirect(){
  var btn=document.getElementById('maintenanceBtn');
  if(!btn || btn.dataset.faultDirectBound==='1')return;
  btn.dataset.faultDirectBound='1';
  btn.addEventListener('click',function(e){
    e.preventDefault();e.stopImmediatePropagation();
    setTimeout(function(){
      if(typeof openMaintenanceView==='function'){try{openMaintenanceView();}catch(err){console.error(err);}}
      showBigFaultScreenButton();
    },0);
  },true);
}
function findFaultButton(){
  var el=document.getElementById('maintenanceBtn');
  if(el)return el;
  var all=document.querySelectorAll('button,a,[role="button"]');
  for(var i=0;i<all.length;i++){
    var t=(all[i].textContent||'').replace(/\s+/g,'').trim();
    if(t==='إدارةالأعطال'||t==='إدارةالصيانة')return all[i];
  }
  return null;
}
function installFaultScreenDirect(){
  var tries=0;
  var timer=setInterval(function(){
    tries++;
    var btn=findFaultButton();
    if(btn && btn.dataset.faultDirectBound!=='1')openFaultManagementDirect();
    if(tries>160)clearInterval(timer);
  },250);
  if(window.MutationObserver){
    new MutationObserver(function(){
      var btn=findFaultButton();
      if(btn && btn.dataset.faultDirectBound!=='1')openFaultManagementDirect();
    }).observe(document.body,{childList:true,subtree:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installFaultScreenDirect);else installFaultScreenDirect();
})();