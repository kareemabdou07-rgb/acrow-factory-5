/* ACROW Factory 5 — v81: clear production/target/remaining + machine type/location */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v81';
function style(){if(document.getElementById(STYLE_ID))return;var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.machine-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-flow:row!important;gap:12px!important;align-items:start!important;width:100%!important;box-sizing:border-box!important;}
.machine-grid>.machine-card{grid-column:1!important;grid-row:auto!important;min-width:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;clear:both!important;}
.machine-card *{box-sizing:border-box!important;}
.mc-top{min-width:0!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:8px!important;}
.mc-top>*{min-width:0!important;max-width:100%!important;}
.mc-row,.acrow-production-row{display:grid!important;grid-template-columns:72px minmax(0,160px)!important;align-items:center!important;column-gap:8px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;}
.mc-row>label,.acrow-production-row>label{grid-column:1!important;width:72px!important;min-width:72px!important;max-width:72px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;position:static!important;box-sizing:border-box!important;color:#ffd54a!important;font-weight:900!important;font-size:16px!important;}
.mc-row>.actual-input,.mc-row>.mc-target-fixed,.acrow-production-row>.actual-input,.acrow-production-row>.mc-target-fixed{grid-column:2!important;width:160px!important;min-width:160px!important;max-width:160px!important;flex:none!important;box-sizing:border-box!important;}
.acrow-production-row .actual-input{height:70px!important;min-height:70px!important;max-height:70px!important;font-size:30px!important;text-align:center!important;font-weight:900!important;padding:6px!important;}
.mc-row .mc-target-fixed{height:70px!important;min-height:70px!important;max-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;white-space:nowrap!important;background:#fff3b0!important;background-image:none!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;}
.mc-row .mc-target-fixed small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:#4a3900!important;font-size:16px!important;font-weight:900!important;}
.mc-row:has(.mc-target-fixed) label{color:#ffd54a!important;font-weight:900!important;}
.acrow-remaining-row{display:grid!important;grid-template-columns:72px minmax(0,160px)!important;align-items:center!important;column-gap:8px!important;width:100%!important;margin-top:6px!important;box-sizing:border-box!important;}
.acrow-remaining-row>label{width:72px!important;min-width:72px!important;max-width:72px!important;color:#ffd54a!important;font-weight:900!important;font-size:16px!important;white-space:nowrap!important;}
.acrow-remaining-value{width:160px!important;min-width:160px!important;max-width:160px!important;height:70px!important;min-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#fff3b0!important;border:3px solid #e0ad00!important;border-radius:7px!important;color:#4a3900!important;font-family:var(--mono)!important;font-size:28px!important;font-weight:900!important;text-align:center!important;}
.mc-bottom{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;gap:8px!important;width:100%!important;min-width:0!important;}
.mc-bottom>.mc-btn.has-faults{width:110px!important;min-width:110px!important;max-width:110px!important;flex:none!important;box-sizing:border-box!important;overflow:hidden!important;white-space:nowrap!important;}
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;background-image:none!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;transition:none!important;}
.actual-input.acrow-fixed,.actual-input.acrow-fixed:focus,.actual-input[data-production-done="1"]{background:#b9f3d1!important;background-image:none!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:inset 0 0 0 9999px #b9f3d1!important;}
.acrow-production-row.acrow-production-done{background:#b9f3d1!important;border:3px solid #159957!important;border-radius:10px!important;padding:0!important;box-shadow:none!important;}
.acrow-production-row .production-label{color:#ffd54a!important;font-weight:900!important;font-size:18px!important;}
.acrow-production-row .actual-input{background:#b9f3d1!important;background-image:none!important;border-color:#159957!important;color:#063b22!important;}
.acrow-production-row .production-fix-btn-v2{display:none!important;}
.acrow-machine-info-row{display:grid!important;grid-template-columns:72px minmax(0,160px)!important;align-items:center!important;column-gap:8px!important;width:100%!important;margin-top:6px!important;box-sizing:border-box!important;}
.acrow-machine-info-row>label{width:72px!important;min-width:72px!important;max-width:72px!important;color:#ffd54a!important;font-weight:900!important;font-size:16px!important;white-space:nowrap!important;}
.acrow-machine-info-value{width:160px!important;min-width:160px!important;max-width:160px!important;min-height:42px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#fff3b0!important;border:2px solid #e0ad00!important;border-radius:8px!important;color:#4a3900!important;font-weight:900!important;padding:6px!important;text-align:center!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important;}
.acrow-custom-title{margin:18px 0 10px;padding-top:14px;border-top:1px solid var(--border);font-size:14px;font-weight:800;color:var(--accent);}
.acrow-custom-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px;}
.acrow-custom-row{display:grid;grid-template-columns:26px minmax(0,1fr) minmax(0,1fr) 58px;align-items:center;gap:7px;min-width:0;}
.acrow-custom-row span{width:26px;height:26px;border-radius:6px;background:var(--bg-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;color:var(--text-dim);flex:none;}
.acrow-custom-row input{width:100%;min-width:0;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:9px 10px;border-radius:7px;font-family:'Tajawal';font-size:13px;font-weight:700;box-sizing:border-box;}
.acrow-custom-row input:focus{outline:none;border-color:var(--accent);}
.acrow-custom-type-row{display:grid!important;grid-template-columns:72px minmax(0,160px)!important;align-items:center!important;column-gap:8px!important;width:100%!important;margin-top:6px!important;}
.acrow-custom-type-row .acrow-custom-type-value{width:160px!important;min-height:42px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#fff3b0!important;border:2px solid #e0ad00!important;border-radius:8px!important;color:#4a3900!important;font-weight:900!important;padding:6px!important;text-align:center!important;overflow:hidden!important;}
@media(max-width:600px){.machine-grid{grid-template-columns:1fr!important;}.machine-grid>.machine-card{width:100%!important;}.acrow-custom-grid{grid-template-columns:1fr;}.acrow-custom-row{grid-template-columns:26px minmax(0,1fr) minmax(0,1fr) 58px;}}
`;
document.head.appendChild(s);}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function targetOf(m){var n=Number(m&&m.target);return isFinite(n)&&n>0?n:null;}
function updateRemaining(card,m,input){if(!card||!m)return;var target=targetOf(m),actual=Number(input&&input.value);if(!isFinite(actual))actual=0;var value=target===null?'—':String(Math.max(0,target-actual));var el=card.querySelector('.acrow-remaining-value');if(el)el.textContent=value;}
function paint(input,r){var has=String(input.value||'').trim()!=='';var row=input.closest('.mc-row')||input.parentElement;input.classList.toggle('acrow-fixed',has);input.setAttribute('data-production-done',has?'1':'0');if(row){row.classList.add('acrow-production-row');row.classList.toggle('acrow-production-done',has);}input.style.setProperty('background',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-color',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-image','none','important');input.style.setProperty('border-color',has?'#159957':'#e0ad00','important');input.style.setProperty('color',has?'#063b22':'#4a3900','important');if(has)input.style.setProperty('box-shadow','inset 0 0 0 9999px #b9f3d1','important');else input.style.setProperty('box-shadow','none','important');if(r)r.productionFixed=has;var card=input.closest('.machine-card');var id=String(input.dataset.machine||'').trim();var m=typeof MACHINES!=='undefined'?MACHINES.find(function(x){return String(x.id)===id;}):null;updateRemaining(card,m,input);}
function addRemaining(card,m,input){if(!card||!m||!input||card.querySelector('.acrow-remaining-row'))return;var target=targetOf(m);if(target===null)return;var row=input.closest('.mc-row')||input.parentElement;if(!row)return;var rr=document.createElement('div');rr.className='acrow-remaining-row';rr.innerHTML='<label>الناقص</label><div class="acrow-remaining-value">0</div>';row.insertAdjacentElement('afterend',rr);updateRemaining(card,m,input);}
function addInfoRows(root){var scope=root||document;scope.querySelectorAll('.machine-card').forEach(function(card){var id=String(card.dataset.machine||'').trim();var m=typeof MACHINES!=='undefined'?MACHINES.find(function(x){return String(x.id)===id;}):null;if(!m)return;var input=card.querySelector('.actual-input');if(!input)return;var rows=card.querySelectorAll('.mc-row');var hoursRow=rows.length?rows[rows.length-1]:null;if(m.type&&!card.querySelector('.acrow-custom-type-row')&&hoursRow){var tr=document.createElement('div');tr.className='acrow-custom-type-row';tr.innerHTML='<label>النوع</label><div class="acrow-custom-type-value"></div>';tr.querySelector('.acrow-custom-type-value').textContent=String(m.type);hoursRow.insertAdjacentElement('afterend',tr);}
 if(m.deptName&&!card.querySelector('.acrow-machine-info-row')){var anchor=card.querySelector('.acrow-custom-type-row')||hoursRow;if(anchor){var lr=document.createElement('div');lr.className='acrow-machine-info-row';lr.innerHTML='<label>المكان</label><div class="acrow-machine-info-value"></div>';lr.querySelector('.acrow-machine-info-value').textContent=String(m.deptName);anchor.insertAdjacentElement('afterend',lr);}}
 addRemaining(card,m,input);});}
function normalizeTargetLabels(root){(root||document).querySelectorAll('.mc-target-fixed').forEach(function(el){var lab=el.closest('.mc-row')&&el.closest('.mc-row').querySelector('label');if(lab)lab.textContent='المستهدف';});}
function decorate(root){style();(root||document).querySelectorAll('.actual-input').forEach(function(input){paint(input,rec(String(input.dataset.machine||'').trim()));});normalizeTargetLabels(root||document);addInfoRows(root||document);}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;e.stopImmediatePropagation();var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';}paint(input,r);},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
document.addEventListener('blur',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
function watch(){if(!window.MutationObserver)return;var ob=new MutationObserver(function(list){list.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1){decorate(n);}});});});ob.observe(document.body,{childList:true,subtree:true});}
function start(){style();decorate();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
(function loadFaultRepairDeleteFix(){if(window.__acrowFaultRepairDeleteFixLoaded)return;window.__acrowFaultRepairDeleteFixLoaded=true;var s=document.createElement('script');s.src='fault-delete-fix.js?v=76';s.async=false;document.head.appendChild(s);})();
(function loadCustomMachines(){if(window.__acrowCustomMachinesV80Loaded)return;window.__acrowCustomMachinesV80Loaded=true;var s=document.createElement('script');s.src='custom-machines.js?v=80';s.async=false;document.head.appendChild(s);})();

/* v171 — force the actual splash text/button to open the app */
(function(){
  function openApp(e){
    if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    var splash=document.getElementById('acrowSplash');
    if(splash){splash.classList.add('hidden');splash.setAttribute('aria-hidden','true');splash.style.setProperty('display','none','important');splash.style.setProperty('visibility','hidden','important');splash.style.setProperty('opacity','0','important');splash.style.setProperty('pointer-events','none','important');}
    document.body.classList.add('v171-app-open');
    document.body.classList.remove('splash-open','v139-app-open','v128-app-open','v162-app-open','v163-app-open','v166-app-open');
    document.body.style.setProperty('overflow','auto','important');
    try{if(typeof render==='function')render();}catch(x){}
    return false;
  }
  function textOf(el){return String((el&&((el.innerText||el.textContent)||el.value))||'').replace(/\s+/g,' ').trim();}
  function bind(){
    var splash=document.getElementById('acrowSplash');
    if(!splash)return;
    var all=splash.querySelectorAll('button,input,a,[role="button"],div,span');
    for(var i=0;i<all.length;i++){
      var el=all[i],t=textOf(el);
      if(t && (t.indexOf('اضغط للدخول')!==-1 || t==='دخول' || t==='ادخل' || t==='ابدأ')){
        el.style.setProperty('pointer-events','auto','important');
        el.onclick=openApp;
        if(el.dataset.v171!=='1'){el.dataset.v171='1';el.addEventListener('click',openApp,true);el.addEventListener('touchend',openApp,true);}
      }
    }
  }
  document.addEventListener('click',function(e){
    var el=e.target;
    var splash=document.getElementById('acrowSplash');
    if(splash && splash.contains(el)){
      var t=textOf(el);
      var p=el.parentElement;
      if(t.indexOf('اضغط للدخول')!==-1 || (p&&textOf(p).indexOf('اضغط للدخول')!==-1))openApp(e);
    }
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  if(window.MutationObserver)new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(bind,200);
  setInterval(function(){if(document.body.classList.contains('v171-app-open')){var s=document.getElementById('acrowSplash');if(s)s.style.setProperty('display','none','important');}},100);
})();
})();
