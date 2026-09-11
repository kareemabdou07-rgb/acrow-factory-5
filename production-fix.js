/* ACROW Factory 5 — v77: one machine per fixed production card + visible custom machines */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v77';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.machine-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-flow:row!important;gap:12px!important;align-items:start!important;width:100%!important;box-sizing:border-box!important;}
.machine-grid>.machine-card{grid-column:1!important;grid-row:auto!important;min-width:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;clear:both!important;}
.machine-card *{box-sizing:border-box!important;}
.mc-top{min-width:0!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:8px!important;}
.mc-top>*{min-width:0!important;max-width:100%!important;}
.mc-row,.acrow-production-row{display:grid!important;grid-template-columns:58px minmax(0,160px)!important;align-items:center!important;column-gap:8px!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;}
.mc-row>label,.acrow-production-row>label{grid-column:1!important;width:58px!important;min-width:58px!important;max-width:58px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;position:static!important;box-sizing:border-box!important;}
.mc-row>.actual-input,.mc-row>.mc-target-fixed,.acrow-production-row>.actual-input,.acrow-production-row>.mc-target-fixed{grid-column:2!important;width:160px!important;min-width:160px!important;max-width:160px!important;flex:none!important;box-sizing:border-box!important;}
.acrow-production-row .actual-input{height:70px!important;min-height:70px!important;max-height:70px!important;font-size:28px!important;text-align:center!important;font-weight:800!important;padding:6px!important;}
.mc-row .mc-target-fixed{height:70px!important;min-height:70px!important;max-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;white-space:nowrap!important;}
.mc-row .mc-target-fixed small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
.mc-bottom{display:grid!important;grid-template-columns:minmax(0,1fr) 110px!important;gap:8px!important;width:100%!important;min-width:0!important;}
.mc-bottom>.mc-btn.has-faults{width:110px!important;min-width:110px!important;max-width:110px!important;flex:none!important;box-sizing:border-box!important;overflow:hidden!important;white-space:nowrap!important;}
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;background-image:none!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;transition:none!important;}
.actual-input.acrow-fixed,.actual-input.acrow-fixed:focus,.actual-input[data-production-done="1"]{background:#b9f3d1!important;background-image:none!important;border:3px solid #159957!important;color:#063b22!important;box-shadow:inset 0 0 0 9999px #b9f3d1!important;}
.acrow-production-row.acrow-production-done{background:#b9f3d1!important;border:3px solid #159957!important;border-radius:10px!important;padding:0!important;box-shadow:none!important;}
.acrow-production-row .production-label{color:#063b22!important;}
.acrow-production-row .actual-input{background:#b9f3d1!important;background-image:none!important;border-color:#159957!important;color:#063b22!important;}
.acrow-production-row .production-fix-btn-v2{display:none!important;}
.acrow-custom-title{margin:18px 0 10px;padding-top:14px;border-top:1px solid var(--border);font-size:14px;font-weight:800;color:var(--accent);}
.acrow-custom-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px;}
.acrow-custom-row{display:flex;align-items:center;gap:7px;min-width:0;}
.acrow-custom-row span{width:26px;height:26px;border-radius:6px;background:var(--bg-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;color:var(--text-dim);flex:none;}
.acrow-custom-row input{width:100%;min-width:0;background:var(--bg-2);border:1px solid var(--border);color:var(--text);padding:9px 10px;border-radius:7px;font-family:'Tajawal';font-size:13px;font-weight:700;box-sizing:border-box;}
.acrow-custom-row input:focus{outline:none;border-color:var(--accent);}
@media(max-width:600px){.machine-grid{grid-template-columns:1fr!important;}.machine-grid>.machine-card{width:100%!important;}.acrow-custom-grid{grid-template-columns:1fr;}}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function paint(input,r){var has=String(input.value||'').trim()!=='';var row=input.closest('.mc-row')||input.parentElement;input.classList.toggle('acrow-fixed',has);input.setAttribute('data-production-done',has?'1':'0');if(row){row.classList.add('acrow-production-row');row.classList.toggle('acrow-production-done',has);}input.style.setProperty('background',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-color',has?'#b9f3d1':'#fff3b0','important');input.style.setProperty('background-image','none','important');input.style.setProperty('border-color',has?'#159957':'#e0ad00','important');input.style.setProperty('color',has?'#063b22':'#4a3900','important');if(has)input.style.setProperty('box-shadow','inset 0 0 0 9999px #b9f3d1','important');else input.style.setProperty('box-shadow','none','important');if(r)r.productionFixed=has;}
function decorate(root){style();(root||document).querySelectorAll('.actual-input').forEach(function(input){paint(input,rec(String(input.dataset.machine||'').trim()));});}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;e.stopImmediatePropagation();var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';}paint(input,r);},true);
document.addEventListener('change',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
document.addEventListener('blur',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var r=rec(String(input.dataset.machine||'').trim());if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=input.value!=='';try{saveStore()}catch(x){}}paint(input,r);},true);
function watch(){if(!window.MutationObserver)return;var ob=new MutationObserver(function(list){list.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1)decorate(n);});});});ob.observe(document.body,{childList:true,subtree:true});}
function start(){style();decorate();watch();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
(function loadFaultRepairDeleteFix(){if(window.__acrowFaultRepairDeleteFixLoaded)return;window.__acrowFaultRepairDeleteFixLoaded=true;var s=document.createElement('script');s.src='fault-delete-fix.js?v=76';s.async=false;document.head.appendChild(s);})();
(function loadCustomMachines(){if(window.__acrowCustomMachinesV77Loaded)return;window.__acrowCustomMachinesV77Loaded=true;var s=document.createElement('script');s.src='custom-machines.js?v=77';s.async=false;document.head.appendChild(s);})();
})();
