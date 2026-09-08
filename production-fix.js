/* ACROW Factory 5 — stable production entry v2 */
(function(){
'use strict';
var STYLE_ID='acrow-production-stable-style-v2',BTN='production-fix-btn-v2';
function style(){
 if(document.getElementById(STYLE_ID))return;
 var s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.actual-input{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important;-webkit-user-select:text!important;user-select:text!important;background:#fff3b0!important;border:3px solid #e0ad00!important;color:#4a3900!important;box-shadow:none!important;}
.actual-input.acrow-fixed{background:#b9f3d1!important;border:3px solid #159957!important;color:#063b22!important;}
.acrow-production-row{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;}
.acrow-production-row .actual-input{flex:1 1 auto!important;min-width:0!important;}
.${BTN}{display:inline-flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;min-width:82px!important;height:52px!important;align-items:center!important;justify-content:center!important;padding:8px 10px!important;border:2px solid #b48600!important;border-radius:8px!important;background:#d7a900!important;color:#fff!important;font-family:'Tajawal',sans-serif!important;font-size:14px!important;font-weight:900!important;cursor:pointer!important;position:relative!important;z-index:5!important;flex:0 0 auto!important;box-shadow:none!important;}
.${BTN}.fixed{background:#25e58f!important;color:#062417!important;border-color:#159957!important;}
@media(max-width:600px){.${BTN}{min-width:78px!important;font-size:13px!important;height:50px!important;}}
`;
 document.head.appendChild(s);
}
function rec(id){try{return typeof getRecord==='function'&&typeof dateInput!=='undefined'?getRecord(dateInput.value,currentShift,id):null}catch(e){return null}}
function paint(input,button,r){
 var has=input.value!=='';
 var fixed=!!(r&&r.productionFixed&&has);
 input.classList.toggle('acrow-fixed',fixed);
 if(button){button.classList.toggle('fixed',fixed);button.textContent=fixed?'تم التثبيت':'تثبيت';button.disabled=false;}
}
function decorate(){
 style();
 document.querySelectorAll('.actual-input').forEach(function(input){
  var row=input.closest('.mc-row')||input.parentElement;if(!row)return;
  row.classList.add('acrow-production-row');
  var id=String(input.dataset.machine||'').trim();if(!id)return;
  var b=row.querySelector('.'+BTN);
  if(!b){b=document.createElement('button');b.type='button';b.className=BTN;b.textContent='تثبيت';row.appendChild(b);}
  paint(input,b,rec(id));
 });
}
document.addEventListener('input',function(e){
 var input=e.target&&e.target.closest?e.target.closest('.actual-input'):null;if(!input)return;
 e.stopImmediatePropagation();
 var r=rec(String(input.dataset.machine||'').trim());
 if(r){r.actual=input.value===''?null:Number(input.value);r.productionFixed=false;try{saveStore()}catch(x){}}
 paint(input,input.closest('.mc-row')?.querySelector('.'+BTN),r);
 try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();if(typeof renderReport==='function')renderReport()}catch(x){}
},true);
document.addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('.'+BTN):null;if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 var row=b.closest('.mc-row')||b.parentElement,input=row&&row.querySelector('.actual-input');
 if(!input||input.disabled||input.value==='')return;
 var r=rec(String(input.dataset.machine||'').trim());if(!r)return;
 r.actual=Number(input.value);r.productionFixed=true;try{saveStore()}catch(x){}
 paint(input,b,r);
 try{if(typeof updateSummaryOnly==='function')updateSummaryOnly();if(typeof renderReport==='function')renderReport()}catch(x){}
},true);
function start(){style();decorate();setTimeout(decorate,300);setTimeout(decorate,1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
