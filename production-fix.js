/* ACROW Factory 5 — stable production entry */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style',BTN='production-fix-btn';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:20!important;}
.actual-input.acrow-has-value{background:#d9fbe8!important;border:3px solid #20b86a!important;color:#063b22!important;}
.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;}
.acrow-production-row{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;}
.acrow-production-row .actual-input{flex:1 1 auto!important;min-width:0!important;}
.${BTN}{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;min-width:82px!important;height:52px!important;align-items:center!important;justify-content:center!important;padding:8px 10px!important;border:2px solid #20b86a!important;border-radius:8px!important;background:#176b45!important;color:#fff!important;font-family:'Tajawal',sans-serif!important;font-size:14px!important;font-weight:900!important;cursor:pointer!important;position:relative!important;z-index:30!important;flex:0 0 auto!important;}
.${BTN}.fixed{background:#25e58f!important;color:#062417!important;border-color:#25e58f!important;}
@media(max-width:600px){.${BTN}{min-width:78px!important;font-size:13px!important;}}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function paint(input,button,r){var has=input.value!==''&&Number(input.value)>=0;input.classList.toggle('acrow-has-value',has&&!r?.productionFixed);input.classList.toggle('acrow-fixed',has&&!!r?.productionFixed);if(button){button.classList.toggle('fixed',has&&!!r?.productionFixed);button.textContent=has&&r?.productionFixed?'تم التثبيت':'تثبيت';button.disabled=false;}}
function decorate(){style();document.querySelectorAll('.actual-input').forEach(function(input){var row=input.closest('.mc-row')||input.parentElement;if(!row)return;row.classList.add('acrow-production-row');var id=String(input.dataset.machine||'').trim();if(!id)return;var b=row.querySelector('.'+BTN);if(!b){b=document.createElement('button');b.type='button';b.className=BTN;b.textContent='تثبيت';row.appendChild(b)}var r=rec(id);if(r&&r.actual!==null&&r.actual!==undefined&&input.value!==String(r.actual))input.value=r.actual;paint(input,b,r)})}
document.addEventListener('input',function(e){var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;var id=String(input.dataset.machine||'').trim(),r=rec(id);if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=false;try{saveStore()}catch(x){}}paint(input,input.closest('.mc-row')?.querySelector('.'+BTN),r)},true);
document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.'+BTN):null;if(!b)return;e.preventDefault();e.stopImmediatePropagation();var row=b.closest('.mc-row')||b.parentElement,input=row&&row.querySelector('.actual-input');if(!input||input.disabled||input.value==='')return;var r=rec(String(input.dataset.machine||'').trim());if(!r)return;r.actual=Number(input.value);r.productionFixed=true;try{saveStore()}catch(x){}paint(input,b,r);try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();if(typeof renderReport==='function')renderReport()}catch(x){}},true);
var t;function watch(){clearTimeout(t);t=setTimeout(decorate,20)}
function start(){style();decorate();new MutationObserver(watch).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
