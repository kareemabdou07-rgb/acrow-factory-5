/* ACROW Factory 5 — v198 shared protection + realtime Firestore sync */
(function(){
  'use strict';
  var PASSWORD='5445';
  var DB_PATH='acrowFactory5';
  var DOC_ID='store';
  var cloudReady=false, firstSnapshot=true, applyingRemote=false;
  var lastSent='', lastApplied='';
  var pendingTimer=null;

  function json(v){ try{return JSON.stringify(v||{});}catch(e){return '{}';} }
  function currentStore(){ return (typeof store!=='undefined' && store) ? store : null; }
  function saveLocal(){ try{ if(typeof saveStore==='function') saveStore(); }catch(e){} }

  /* ---------- one shared password for protected sections ---------- */
  function text(el){return ((el&&el.innerText)||(el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function protectedButton(el){
    if(!el) return false;
    if(el.closest && el.closest('#v198PasswordBackdrop')) return false;
    return !!(el.closest('#planStatusBtn') || el.closest('#jumpToAnalysisBtn') || el.closest('#maintenanceBtn') || el.closest('#adminMenuBtn'));
  }
  function passwordUI(){
    if(document.getElementById('v198PasswordBackdrop')) return;
    var b=document.createElement('div');
    b.id='v198PasswordBackdrop';
    b.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:99999999;display:none;align-items:center;justify-content:center;padding:18px;box-sizing:border-box';
    b.innerHTML='<div style="width:min(390px,94vw);background:#fff;border-radius:16px;padding:22px;box-shadow:0 18px 55px rgba(0,0,0,.4);text-align:center;font-family:Arial,sans-serif;direction:rtl"><div style="font-size:22px;font-weight:800;margin-bottom:12px;color:#111">الرقم السري</div><input id="v198PasswordInput" type="password" inputmode="numeric" autocomplete="off" style="width:100%;box-sizing:border-box;font-size:24px;text-align:center;padding:11px;border:2px solid #aaa;border-radius:10px"><div id="v198PasswordError" style="min-height:22px;color:#b00020;font-size:14px;margin-top:7px"></div><div style="display:flex;gap:9px;margin-top:10px"><button id="v198PasswordCancel" type="button" style="flex:1;padding:11px;border:0;border-radius:9px;background:#ddd;color:#222;font-size:17px">إلغاء</button><button id="v198PasswordOk" type="button" style="flex:1;padding:11px;border:0;border-radius:9px;background:#1686c9;color:#fff;font-size:17px">دخول</button></div></div>';
    document.body.appendChild(b);
    document.getElementById('v198PasswordCancel').onclick=function(){b.style.display='none';b._pending=null;};
    document.getElementById('v198PasswordOk').onclick=checkPassword;
    document.getElementById('v198PasswordInput').onkeydown=function(e){if(e.key==='Enter')checkPassword();if(e.key==='Escape'){b.style.display='none';b._pending=null;}};
  }
  function openPassword(action){
    passwordUI();
    var b=document.getElementById('v198PasswordBackdrop'),i=document.getElementById('v198PasswordInput'),er=document.getElementById('v198PasswordError');
    b._pending=action||null;i.value='';er.textContent='';b.style.display='flex';setTimeout(function(){i.focus();},40);
  }
  function checkPassword(){
    var i=document.getElementById('v198PasswordInput'),er=document.getElementById('v198PasswordError'),b=document.getElementById('v198PasswordBackdrop');
    if(i.value===PASSWORD){var a=b._pending;b.style.display='none';b._pending=null;sessionStorage.setItem('acrow_v198_unlocked','1');if(a)setTimeout(a,0);}
    else{er.textContent='الرقم السري غير صحيح';i.select();}
  }
  function bindProtection(){
    if(document.documentElement.dataset.v198Protection==='1')return;
    document.documentElement.dataset.v198Protection='1';
    passwordUI();
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest?e.target.closest('button,a,[role="button"]'):null;
      if(!protectedButton(el))return;
      if(sessionStorage.getItem('acrow_v198_unlocked')==='1')return;
      e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      openPassword(function(){el.click();});
    },true);
  }

  /* ---------- saved-production visual indicator ---------- */
  function addSavedStyle(){
    if(document.getElementById('v198SavedStyle'))return;
    var s=document.createElement('style');s.id='v198SavedStyle';
    s.textContent='.v198-production-saved{background:#d9f6df!important;border-color:#198754!important;color:#146c43!important;font-weight:900!important;box-shadow:0 0 0 2px rgba(25,135,84,.12)!important}.v198-cloud-status{position:fixed;left:10px;bottom:10px;z-index:99990;font:700 11px Arial,sans-serif;padding:6px 9px;border-radius:8px;background:rgba(16,42,69,.92);color:#fff;display:none}';
    document.head.appendChild(s);
  }
  function isProductionInput(el){
    if(!el||el.tagName!=='INPUT'||el.type!=='number'||!el.classList.contains('actual-input'))return false;
    return true;
  }
  function markProductionSaved(el){
    if(isProductionInput(el) && el.value!=='' && Number(el.value)>=0)el.classList.add('v198-production-saved');
  }
  function bindProduction(){
    document.querySelectorAll('input.actual-input[type="number"]').forEach(function(el){
      if(el.dataset.v198Prod==='1'){markProductionSaved(el);return;}
      el.dataset.v198Prod='1';
      el.addEventListener('input',function(){el.classList.remove('v198-production-saved');clearTimeout(el._v198Timer);el._v198Timer=setTimeout(function(){markProductionSaved(el);},350);queueCloudSave();});
      el.addEventListener('change',function(){markProductionSaved(el);queueCloudSave();});
      el.addEventListener('blur',function(){markProductionSaved(el);});
      markProductionSaved(el);
    });
  }

  /* ---------- realtime Firestore ---------- */
  function status(msg,show){
    var el=document.getElementById('v198CloudStatus');
    if(!el){el=document.createElement('div');el.id='v198CloudStatus';el.className='v198-cloud-status';document.body.appendChild(el);}
    el.textContent=msg;el.style.display=show?'block':'none';
  }
  function firebaseStart(){
    if(!window.firebase || !firebase.initializeApp || !firebase.firestore){
      status('تعذر تشغيل المزامنة السحابية',true);return;
    }
    try{
      var cfg={apiKey:'AIzaSyCGUyuOU0q-Zg5A1LnnH6oIcbJSwgwS9oc',authDomain:'acrow-factory-5.firebaseapp.com',projectId:'acrow-factory-5',storageBucket:'acrow-factory-5.firebasestorage.app',messagingSenderId:'26128829420',appId:'1:26128829420:web:75e6a0f31edc7e66c44ec9'};
      if(!firebase.apps.length)firebase.initializeApp(cfg);
      var db=firebase.firestore();cloudReady=true;
      var ref=db.collection(DB_PATH).doc(DOC_ID);
      ref.onSnapshot(function(snap){
        if(!snap.exists){
          firstSnapshot=false;
          var local=currentStore();
          if(local && Object.keys(local).length){lastSent=json(local);ref.set({data:local,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(function(){status('تعذر حفظ البيانات على السيرفر',true);});}
          return;
        }
        var remote=snap.data()&&snap.data().data;
        if(!remote)return;
        var remoteJson=json(remote);
        if(remoteJson===lastSent || remoteJson===lastApplied){firstSnapshot=false;return;}
        firstSnapshot=false;
        applyingRemote=true;
        try{
          store=remote;
          if(typeof rebuildMachines==='function')rebuildMachines();
          if(typeof fillDashboardDepts==='function')fillDashboardDepts();
          var focused=document.activeElement;
          if(!(focused && (focused.tagName==='INPUT'||focused.tagName==='TEXTAREA'||focused.tagName==='SELECT'))){
            if(typeof render==='function')render();
            if(typeof renderReport==='function')renderReport();
            if(typeof renderDashboard==='function')renderDashboard();
            if(typeof renderMaintenance==='function')renderMaintenance();
          }else{
            document.body.dataset.v198RemotePending='1';
          }
          lastApplied=remoteJson;
        }catch(e){console.error(e);}
        applyingRemote=false;
        bindProduction();
      },function(err){console.error(err);status('المزامنة السحابية غير متاحة — راجع صلاحيات Firestore',true);});
      status('متصل بالسيرفر',true);setTimeout(function(){status('',false);},1800);
      window.__acrowV198Sync={db:db,ref:ref};
    }catch(e){console.error(e);status('تعذر تشغيل المزامنة السحابية',true);}
  }
  function cloudSaveNow(){
    if(!cloudReady||applyingRemote)return;
    var local=currentStore();if(!local)return;
    var payload=json(local);
    if(payload===lastSent)return;
    lastSent=payload;
    window.__acrowV198Sync.ref.set({data:local,updatedAt:firebase.firestore.FieldValue.serverTimestamp()}).then(function(){
      bindProduction();
    }).catch(function(err){console.error(err);status('تعذر حفظ التعديل على السيرفر',true);});
  }
  function queueCloudSave(){clearTimeout(pendingTimer);pendingTimer=setTimeout(cloudSaveNow,220);}
  function watchStore(){
    var last=json(currentStore());
    setInterval(function(){
      if(document.body.dataset.v198RemotePending==='1' && !(document.activeElement&&document.activeElement.tagName==='INPUT')){
        delete document.body.dataset.v198RemotePending;
        if(typeof render==='function')render();if(typeof renderReport==='function')renderReport();if(typeof renderDashboard==='function')renderDashboard();if(typeof renderMaintenance==='function')renderMaintenance();
      }
      var now=json(currentStore());
      if(now!==last && !applyingRemote){last=now;queueCloudSave();}
      bindProduction();
    },300);
  }

  function init(){
    addSavedStyle();bindProtection();bindProduction();watchStore();
    var s1=document.createElement('script');s1.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
    var s2=document.createElement('script');s2.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
    s2.onload=firebaseStart;s1.onload=function(){document.head.appendChild(s2);};
    document.head.appendChild(s1);
    document.addEventListener('click',function(e){
      var p=e.target&&e.target.closest?e.target.closest('button'):null;
      if(p && (p.id==='adminSaveBtn'||p.id==='saveMonthlyPlanBtn'||p.id==='saveMachineBtn'||p.id==='doneMachineSelectBtn'||p.id==='addFaultBtn'||p.id==='addObstacleBtn'||p.id==='maintenanceRefresh'))queueCloudSave();
    },true);
    window.addEventListener('beforeunload',function(){try{cloudSaveNow();}catch(e){}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
