/* ACROW Factory 5 — shared Firebase realtime data layer */
(function(){
  'use strict';
  var COLLECTION='acrowFactory5';
  var DOC='store';
  var ready=false, applyingRemote=false, firstSnapshot=true;
  var lastSent='', lastRemote='';
  var timer=null;

  var cfg={
    apiKey:'AIzaSyCGUyuOU0q-Zg5A1LnnH6oIcbJSwgwS9oc',
    authDomain:'acrow-factory-5.firebaseapp.com',
    projectId:'acrow-factory-5',
    storageBucket:'acrow-factory-5.firebasestorage.app',
    messagingSenderId:'26128829420',
    appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'
  };

  function js(v){try{return JSON.stringify(v||{});}catch(e){return '{}';}}
  function localStore(){return (typeof store!=='undefined'&&store)?store:null;}
  function saveLocal(){try{if(typeof saveStore==='function')saveStore();}catch(e){}}

  function renderAll(){
    try{if(typeof rebuildMachines==='function')rebuildMachines();}catch(e){}
    try{if(typeof fillDashboardDepts==='function')fillDashboardDepts();}catch(e){}
    try{if(typeof render==='function')render();}catch(e){}
    try{if(typeof renderReport==='function')renderReport();}catch(e){}
    try{if(typeof renderDashboard==='function')renderDashboard();}catch(e){}
    try{if(typeof renderMaintenance==='function')renderMaintenance();}catch(e){}
  }

  function mergeFirst(remote,local){
    if(!remote)return local||{};
    if(!local)return remote;
    var out=remote;
    if(local.records && typeof local.records==='object'){
      out.records=Object.assign({},remote.records||{},local.records);
      Object.keys(remote.records||{}).forEach(function(k){
        if(local.records[k] && remote.records[k] && typeof local.records[k]==='object' && typeof remote.records[k]==='object'){
          out.records[k]=Object.assign({},remote.records[k],local.records[k]);
        }
      });
    }
    if(!out.favorites && local.favorites)out.favorites=local.favorites;
    if(!out.settings && local.settings)out.settings=local.settings;
    if(!out.machineCustom && local.machineCustom)out.machineCustom=local.machineCustom;
    if(!out.machineDisabled && local.machineDisabled)out.machineDisabled=local.machineDisabled;
    if(!out.deptPasswords && local.deptPasswords)out.deptPasswords=local.deptPasswords;
    return out;
  }

  function cloudSave(){
    if(!ready||applyingRemote||!window.__acrowFirebaseRef)return;
    var s=localStore();if(!s)return;
    var payload=js(s);if(payload===lastSent)return;
    lastSent=payload;
    window.__acrowFirebaseRef.set({data:s,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(e){console.error('Firebase save failed',e);});
  }
  function queue(){clearTimeout(timer);timer=setTimeout(cloudSave,180);}

  function start(){
    if(!window.firebase||!firebase.initializeApp||!firebase.firestore){console.error('Firebase libraries unavailable');return;}
    try{
      if(!firebase.apps.length)firebase.initializeApp(cfg);
      var db=firebase.firestore();
      var ref=db.collection(COLLECTION).doc(DOC);
      window.__acrowFirebaseRef=ref;
      ready=true;
      ref.onSnapshot(function(snap){
        var remote=snap.exists && snap.data()?snap.data().data:null;
        var local=localStore();
        if(!remote){
          if(local){lastSent=js(local);ref.set({data:local,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(console.error);}
          firstSnapshot=false;return;
        }
        var rj=js(remote);
        if(rj===lastSent||rj===lastRemote){firstSnapshot=false;return;}
        if(firstSnapshot){
          remote=mergeFirst(remote,local);
          rj=js(remote);
          firstSnapshot=false;
        }
        applyingRemote=true;
        try{
          store=remote;
          saveLocal();
          lastRemote=rj;
          renderAll();
        }finally{applyingRemote=false;}
        if(firstSnapshot===false)queue();
      },function(e){console.error('Firebase listener failed',e);});

      setInterval(function(){
        var s=localStore();
        if(!s||applyingRemote)return;
        var now=js(s);
        if(now!==lastSent){queue();}
      },300);

      window.addEventListener('beforeunload',function(){try{cloudSave();}catch(e){}});
      console.log('ACROW Factory 5 Firebase realtime connected');
    }catch(e){console.error('Firebase startup failed',e);}
  }

  function loadScripts(){
    var a=document.createElement('script');
    a.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
    a.onload=function(){
      var f=document.createElement('script');
      f.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
      f.onload=start;
      f.onerror=function(e){console.error('Firestore library failed',e);};
      document.head.appendChild(f);
    };
    a.onerror=function(e){console.error('Firebase app library failed',e);};
    document.head.appendChild(a);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadScripts);else loadScripts();
})();
